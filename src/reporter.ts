import type { Config, Finding, ScanResult } from './types/common.js';

/*
 * ANSI color helpers — lightweight, no dependencies.
 */
const ansi = {
  red: (text: string) => `\x1b[31m${text}\x1b[0m`,
  green: (text: string) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text: string) => `\x1b[33m${text}\x1b[0m`,
  cyan: (text: string) => `\x1b[36m${text}\x1b[0m`,
  dim: (text: string) => `\x1b[2m${text}\x1b[0m`,
  bold: (text: string) => `\x1b[1m${text}\x1b[0m`,
};

/**
 * Creates a clickable OSC 8 hyperlink.
 * Supported by: iTerm2, VS Code terminal, WebStorm terminal, Windows Terminal.
 *
 * Note: URL must be a plain file:// path — no #L fragment,
 * as some IDEs (WebStorm) treat the fragment as part of the filename.
 */
function hyperlink(filePath: string, displayText: string): string {
  const url = `file://${filePath}`;
  return `\x1b]8;;${url}\x1b\\${displayText}\x1b]8;;\x1b\\`;
}

/**
 * Formats a file path as a relative path from cwd.
 */
function relativePath(filePath: string): string {
  const cwd = process.cwd();
  if (filePath.startsWith(cwd + '/') || filePath.startsWith(cwd + '\\')) {
    return filePath.slice(cwd.length + 1);
  }
  return filePath;
}

/**
 * Reports a single finding as one line with a clickable file link
 * and the matched value (redacted or raw depending on config).
 *
 * Example output:
 *   ✖  AWSAccessKey  →  dist/config.js:3:15  AKIA****MPLE
 */
function reportFinding(finding: Finding, redact: boolean): void {
  const rel = relativePath(finding.filePath);
  const location = `${rel}:${finding.lineNumber}:${finding.matchColumn}`;
  const link = hyperlink(finding.filePath, ansi.cyan(location));
  const matchDisplay = redact ? finding.redactedMatch : finding.rawMatch;

  console.log(
    `  ${ansi.red('✖')}  ${ansi.bold(finding.ruleKey)}  ${ansi.dim('→')}  ${link}  ${ansi.yellow(matchDisplay)}`,
  );
}

/**
 * Strips ANSI escape codes and OSC 8 sequences for box width calculation.
 */
function stripForWidth(text: string): string {
  return (
    text
      // ANSI color codes
      // eslint-disable-next-line no-control-regex
      .replace(/\x1b\[[0-9;]*m/g, '')
      // OSC 8 hyperlinks — extract display text only
      // eslint-disable-next-line no-control-regex
      .replace(/\x1b]8;;[^\x1b]*\x1b\\([^\x1b]*)\x1b]8;;\x1b\\/g, '$1')
  );
}

/**
 * Draws the summary box.
 */
function reportSummary(result: ScanResult): void {
  const { findings, filesScanned, duration, success } = result;

  const lines = [
    '',
    `  ${ansi.bold('dist-guard')} scan complete`,
    '',
    `  Files scanned:  ${ansi.cyan(String(filesScanned))}`,
    `  Findings:       ${findings.length > 0 ? ansi.red(String(findings.length)) : ansi.green('0')}`,
    `  Duration:       ${ansi.dim(`${duration}ms`)}`,
    '',
    success
      ? `  ${ansi.green('✔')} ${ansi.green('No secret leaks detected')}`
      : `  ${ansi.red('✖')} ${ansi.red(`${findings.length} potential secret leak${findings.length === 1 ? '' : 's'} found`)}`,
    '',
  ];

  const contentWidth = Math.max(
    40,
    ...lines.map((ln) => stripForWidth(ln).length + 2),
  );

  console.log('');
  console.log(`  ╭${'─'.repeat(contentWidth)}╮`);
  for (const line of lines) {
    const stripped = stripForWidth(line);
    const padding = contentWidth - stripped.length;
    console.log(`  │${line}${' '.repeat(Math.max(0, padding))}│`);
  }
  console.log(`  ╰${'─'.repeat(contentWidth)}╯`);
  console.log('');
}

/**
 * Reports the full scan result to the console.
 */
export function report(result: ScanResult, config: Config): void {
  if (result.findings.length > 0) {
    console.log('');
    for (const finding of result.findings) {
      reportFinding(finding, config.redact);
    }
  }

  reportSummary(result);
}
