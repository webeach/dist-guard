/**
 * dist-guard — scan dist folders for leaked tokens, API keys, and secrets.
 *
 * @module dist-guard
 */

export { resolveConfig } from './config.js';
export type { PartialConfig } from './config.js';
export { report } from './reporter.js';
export { rules } from './rules/index.js';
export { scan } from './scanner.js';
export type { Config, Finding, Rule, ScanResult } from './types/common.js';
