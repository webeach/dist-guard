/**
 * All shared types for dist-guard.
 */

/** Detection rule definition. */
export interface Rule {
  /** Unique key identifying the rule, e.g. "AWSAccessKey". */
  readonly key: string;
  /** Regex patterns to search for. */
  readonly patterns: ReadonlyArray<RegExp>;
}

// ─── Config Types ──────────────────────────────────────────────────────────────

/** dist-guard configuration. */
export interface Config {
  /** Path to the dist directory to scan. @default "./dist" */
  readonly targetDir: string;
  /** Glob pattern for file matching. @default "*.*" */
  readonly pattern: string;
  /** Rule keys to ignore during scanning. @default [] */
  readonly ignoreRules: ReadonlyArray<string>;
  /** Glob patterns for files/directories to ignore. @default [] */
  readonly ignorePatterns: ReadonlyArray<string>;
  /**
   * Whether to mask matched secrets in output.
   * When true, shows first/last 4 chars with `*` in between.
   * @default true
   */
  readonly redact: boolean;
}

// ─── Scan Result Types ─────────────────────────────────────────────────────────

/** A single detected finding. */
export interface Finding {
  /** Key of the rule that matched. */
  readonly ruleKey: string;
  /** Absolute path to the file containing the match. */
  readonly filePath: string;
  /** Line number where the match was found (1-indexed). */
  readonly lineNumber: number;
  /** Full content of the matched line. */
  readonly lineContent: string;
  /** The raw matched secret value (full, unmasked). */
  readonly rawMatch: string;
  /** Redacted (masked) version of the matched secret. */
  readonly redactedMatch: string;
  /** Column where the match starts (1-indexed). */
  readonly matchColumn: number;
  /** Length of the matched secret. */
  readonly matchLength: number;
}

/** Scan result returned by the scanner. */
export interface ScanResult {
  /** All detected findings. */
  readonly findings: ReadonlyArray<Finding>;
  /** Number of files that were scanned. */
  readonly filesScanned: number;
  /** Scan duration in milliseconds. */
  readonly duration: number;
  /** Whether the scan passed (no findings). */
  readonly success: boolean;
}
