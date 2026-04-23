import { rgPath } from '@vscode/ripgrep';

import { rules as allRules } from './rules/index.js';
import type { Config, Finding, Rule, ScanResult } from './types/common.js';

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

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
 */
function buildRgArgs(config: Config, regexPatterns: string[]): string[] {
  const targetDir = path.resolve(config.targetDir);
  const args: string[] = [
    '--json',
    '--no-heading',
    '--line-number',
    '--column',
    '--no-filename',
    '--pcre2',
  ];

  // Add file pattern
  if (config.pattern && config.pattern !== '*.*') {
    args.push('--glob', config.pattern);
  }

  // Add ignore patterns
  for (const ignorePattern of config.ignorePatterns) {
    args.push('--glob', `!${ignorePattern}`);
  }

  // Add all regex patterns
  for (const pattern of regexPatterns) {
    args.push('-e', pattern);
  }

  args.push(targetDir);

  return args;
}

/**
 * Scans the target directory for leaked secrets using ripgrep.
 */
export async function scan(config: Config): Promise<ScanResult> {
  const startTime = performance.now();

  // Validate target directory
  const targetDir = path.resolve(config.targetDir);
  if (!fs.existsSync(targetDir)) {
    return {
      findings: [],
      filesScanned: 0,
      duration: Math.round(performance.now() - startTime),
      success: true,
    };
  }

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
    const rg = spawn(rgPath, args, { stdio: ['ignore', 'pipe', 'pipe'] });

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

    rg.on('error', reject);
  });
}
