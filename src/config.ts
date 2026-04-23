import type { Config } from './types/common.js';

import fs from 'node:fs';
import path from 'node:path';

/** Default configuration values. */
const DEFAULT_CONFIG: Config = {
  targetDir: './dist',
  pattern: '*.*',
  ignoreRules: [],
  ignorePatterns: [],
  redact: true,
};

/** Partial config that can come from external sources. */
export interface PartialConfig {
  targetDir?: string;
  pattern?: string;
  ignoreRules?: string[];
  ignorePatterns?: string[];
  redact?: boolean;
}

/**
 * Reads the distGuard field from the project's package.json.
 */
function readPackageJsonConfig(cwd: string): PartialConfig {
  const pkgPath = path.resolve(cwd, 'package.json');

  if (!fs.existsSync(pkgPath)) {
    return {};
  }

  try {
    const raw = fs.readFileSync(pkgPath, 'utf-8');
    const pkg = JSON.parse(raw);
    return (pkg.distGuard as PartialConfig) ?? {};
  } catch {
    return {};
  }
}

/**
 * Reads the dist-guard.config.json file from the project root.
 */
function readConfigFile(cwd: string): PartialConfig {
  const configPath = path.resolve(cwd, 'dist-guard.config.json');

  if (!fs.existsSync(configPath)) {
    return {};
  }

  try {
    const raw = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(raw) as PartialConfig;
  } catch {
    return {};
  }
}

/**
 * Merges a partial config on top of a base config.
 * Only defined keys from the partial override the base.
 */
function mergeConfig(base: Config, partial: PartialConfig): Config {
  return {
    targetDir: partial.targetDir ?? base.targetDir,
    pattern: partial.pattern ?? base.pattern,
    ignoreRules: partial.ignoreRules ?? base.ignoreRules,
    ignorePatterns: partial.ignorePatterns ?? base.ignorePatterns,
    redact: partial.redact ?? base.redact,
  };
}

/**
 * Resolves the final configuration by merging in order:
 * 1. Defaults
 * 2. package.json → distGuard
 * 3. dist-guard.config.json
 * 4. CLI overrides (highest priority)
 */
export function resolveConfig(
  cliOverrides: PartialConfig = {},
  cwd: string = process.cwd(),
): Config {
  let config = { ...DEFAULT_CONFIG };

  // Layer 2: package.json distGuard field
  const pkgConfig = readPackageJsonConfig(cwd);
  config = mergeConfig(config, pkgConfig);

  // Layer 3: dist-guard.config.json
  const fileConfig = readConfigFile(cwd);
  config = mergeConfig(config, fileConfig);

  // Layer 4: CLI overrides (highest priority)
  config = mergeConfig(config, cliOverrides);

  return config;
}
