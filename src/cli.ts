import { cac } from 'cac';

import type { PartialConfig } from './config.js';
import { resolveConfig } from './config.js';
import { report } from './reporter.js';
import { scan } from './scanner.js';

import { createRequire } from 'node:module';

/**
 * Reads the version from package.json.
 */
function getVersion(): string {
  try {
    const require = createRequire(import.meta.url);
    const pkg = require('../package.json');
    return pkg.version ?? '0.0.0';
  } catch {
    return '0.0.0';
  }
}

const cli = cac('dist-guard');

cli
  .option('-t, --target-dir <path>', 'Target directory to scan')
  .option('-p, --pattern <glob>', 'File pattern to search')
  .option('-r, --ignore-rules <rules>', 'Comma-separated rule keys to ignore')
  .option(
    '-i, --ignore-patterns <globs>',
    'Comma-separated file patterns to ignore',
  )
  .option('--no-redact', 'Show secrets in plain text instead of masking them');

cli.help();
cli.version(getVersion());

const parsed = cli.parse();

// If help or version was requested, don't run the scan.
if (
  !process.argv.includes('--help') &&
  !process.argv.includes('-h') &&
  !process.argv.includes('--version') &&
  !process.argv.includes('-v')
) {
  run(parsed.options);
}

/**
 * Main entry point for the CLI.
 */
async function run(options: Record<string, any>): Promise<void> {
  // Build CLI overrides from parsed options
  const cliOverrides: PartialConfig = {};

  if (options.targetDir !== undefined) {
    cliOverrides.targetDir = options.targetDir;
  }

  if (options.pattern !== undefined) {
    cliOverrides.pattern = options.pattern;
  }

  if (options.ignoreRules !== undefined) {
    cliOverrides.ignoreRules = String(options.ignoreRules)
      .split(',')
      .map((rule: string) => rule.trim())
      .filter(Boolean);
  }

  if (options.ignorePatterns !== undefined) {
    cliOverrides.ignorePatterns = String(options.ignorePatterns)
      .split(',')
      .map((pattern: string) => pattern.trim())
      .filter(Boolean);
  }

  // cac sets options.redact = false when --no-redact is passed
  if (options.redact === false) {
    cliOverrides.redact = false;
  }

  const config = resolveConfig(cliOverrides);

  try {
    const result = await scan(config);
    report(result, config);
    process.exit(result.success ? 0 : 1);
  } catch (error) {
    console.error(
      '\x1b[31m✖ dist-guard error:\x1b[0m',
      error instanceof Error ? error.message : error,
    );
    process.exit(2);
  }
}
