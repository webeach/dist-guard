import { rules as allRules } from './rules/index.js';
import type { Config, Finding, Rule, ScanResult } from './types/common.js';

import { spawn, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';

/**
 * Resolves the ripgrep binary path.
 * Prefers the system-installed `rg` (e.g. via Homebrew) to avoid issues with
 * `@vscode/ripgrep` postinstall scripts being skipped by package managers like pnpm.
 * Falls back to the bundled binary from `@vscode/ripgrep`.
 */
function resolveRgPath(): string {
  const whichCmd = process.platform === 'win32' ? 'where' : 'which';
  const result = spawnSync(whichCmd, ['rg'], { encoding: 'utf8' });

  if (result.status === 0 && result.stdout.trim()) {
    return result.stdout.trim().split('\n')[0].trim();
  }

  try {
    const require = createRequire(import.meta.url);
    const { rgPath } = require('@vscode/ripgrep') as { rgPath: string };
    return rgPath;
  } catch {
    return 'rg';
  }
}

const rgBin = resolveRgPath();

/** Ripgrep JSON match output type. */
interface RgMatch {
  type: 'match';
  data: {
    path: { text: string };
    lines: { text: string };
    line_number: number;
    submatches: Array<{
      match: { text: string };
      start: number;
      end: number;
    }>;
  };
}

/** Ripgrep JSON summary output type. */
interface RgSummary {
  type: 'summary';
  data: {
    stats: {
      matched_lines: number;
      searches_with_match: number;
      searches: number;
    };
  };
}

type RgJsonLine = RgMatch | RgSummary | { type: string };

/**
 * Masks a secret value, showing only the first and last 4 characters.
 */
function redactSecret(value: string): string {
  if (value.length <= 12) {
    return '*'.repeat(value.length);
  }
  const visibleChars = 4;
  const prefix = value.slice(0, visibleChars);
  const suffix = value.slice(-visibleChars);
  const masked = '*'.repeat(value.length - visibleChars * 2);
  return `${prefix}${masked}${suffix}`;
}

/**
 * Determines which rule a match belongs to by testing the matched text
 * against all rule patterns.
 */
function identifyRule(
  matchText: string,
  lineText: string,
  filteredRules: ReadonlyArray<Rule>,
): string | null {
  for (const rule of filteredRules) {
    for (const pattern of rule.patterns) {
      const regex = new RegExp(pattern.source, pattern.flags);
      if (regex.test(matchText) || regex.test(lineText)) {
        return rule.key;
      }
    }
  }
  return null;
}

/**
 * Builds ripgrep arguments for scanning.
 *
 * @remarks
 * `--no-ignore` is essential: build artifacts (`dist/`, `build/`) are almost
 * universally listed in `.gitignore` / `.ignore` files, and ripgrep would
 * silently skip them by default — producing a misleading "0 files scanned"
 * result. The user's `include`/`exclude` globs are the sole intended filter.
 */
function buildRgArgs(config: Config, regexPatterns: string[]): string[] {
  const args: string[] = [
    '--json',
    '--no-heading',
    '--line-number',
    '--column',
    '--no-filename',
    '--no-ignore',
    '--pcre2',
  ];

  for (const glob of config.include) {
    args.push('--glob', glob);
  }

  for (const glob of config.exclude) {
    args.push('--glob', `!${glob}`);
  }

  for (const pattern of regexPatterns) {
    args.push('-e', pattern);
  }

  args.push('.');

  return args;
}

/**
 * Scans files matching the include globs for leaked secrets using ripgrep.
 */
export async function scan(config: Config): Promise<ScanResult> {
  const startTime = performance.now();

  // Filter rules based on ignoreRules
  const ignoreSet = new Set(config.ignoreRules);
  const filteredRules = allRules.filter((rule) => !ignoreSet.has(rule.key));

  if (filteredRules.length === 0) {
    return {
      findings: [],
      filesScanned: 0,
      duration: Math.round(performance.now() - startTime),
      success: true,
    };
  }

  // Collect all regex patterns
  const regexPatterns: string[] = [];
  for (const rule of filteredRules) {
    for (const pattern of rule.patterns) {
      let source = pattern.source;
      if (pattern.ignoreCase) {
        // Prepend inline case-insensitive flag for ripgrep (PCRE2/Rust Regex)
        source = `(?i)${source}`;
      }
      regexPatterns.push(source);
    }
  }

  if (regexPatterns.length === 0) {
    return {
      findings: [],
      filesScanned: 0,
      duration: Math.round(performance.now() - startTime),
      success: true,
    };
  }

  // Run ripgrep
  const rgArgs = buildRgArgs(config, regexPatterns);
  const rgOutput = await runRipgrep(rgArgs);

  // Parse results
  const findings: Finding[] = [];
  let filesScanned = 0;

  for (const line of rgOutput.split('\n').filter(Boolean)) {
    let parsed: RgJsonLine;
    try {
      parsed = JSON.parse(line);
    } catch {
      continue;
    }

    if (parsed.type === 'summary') {
      const summary = parsed as RgSummary;
      filesScanned = summary.data.stats.searches;
      continue;
    }

    if (parsed.type !== 'match') {
      continue;
    }

    const match = parsed as RgMatch;
    const filePath = path.resolve(match.data.path.text);
    const lineContent = match.data.lines.text.replace(/\n$/, '');
    const lineNumber = match.data.line_number;

    for (const submatch of match.data.submatches) {
      const matchText = submatch.match.text;
      const ruleKey = identifyRule(matchText, lineContent, filteredRules);

      if (ruleKey) {
        findings.push({
          ruleKey,
          filePath,
          lineNumber,
          lineContent,
          rawMatch: matchText,
          redactedMatch: redactSecret(matchText),
          matchColumn: submatch.start + 1,
          matchLength: matchText.length,
        });
      }
    }
  }

  const duration = Math.round(performance.now() - startTime);

  return {
    findings,
    filesScanned,
    duration,
    success: findings.length === 0,
  };
}

/**
 * Spawns the ripgrep process and collects its output.
 */
function runRipgrep(args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const rg = spawn(rgBin, args, { stdio: ['ignore', 'pipe', 'pipe'] });

    let stdout = '';
    let stderr = '';

    rg.stdout.on('data', (data: Buffer) => {
      stdout += data.toString();
    });

    rg.stderr.on('data', (data: Buffer) => {
      stderr += data.toString();
    });

    rg.on('close', (code) => {
      // ripgrep exit code 1 = no matches found (not an error)
      if (code === 0 || code === 1) {
        resolve(stdout);
      } else {
        reject(new Error(`ripgrep exited with code ${code}: ${stderr}`));
      }
    });

    rg.on('error', (err: any) => {
      if (err.code === 'ENOENT') {
        reject(
          new Error(
            `\n\nripgrep (rg) binary not found.\n` +
              `dist-guard requires ripgrep to scan files.\n` +
              `\n👉 Install ripgrep using one of these methods:\n\n` +
              `   macOS:   brew install ripgrep\n` +
              `   Ubuntu:  sudo apt install ripgrep\n` +
              `   Windows: winget install BurntSushi.ripgrep.MSVC\n\n` +
              `Alternatively, rebuild the bundled binary (if you use pnpm/yarn):\n` +
              `   pnpm rebuild @vscode/ripgrep\n` +
              `   npm rebuild @vscode/ripgrep\n\n`,
          ),
        );
      } else {
        reject(err);
      }
    });
  });
}
