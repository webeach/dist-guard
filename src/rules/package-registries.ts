import type { Rule } from '../types/common.js';

/** Package registry token detection rules (sorted by key). */
export const packageRegistryRules: ReadonlyArray<Rule> = [
  {
    // Context-aware: legacy npm tokens are UUIDs — too generic without context.
    key: 'NPMTokenV1',
    patterns: [
      /npm[_-]?(?:auth)?[_-]?(?:token|key|secret)\s*[:=]\s*['"]?([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})['"]?/gi,
    ],
  },
  {
    key: 'NPMTokenV2',
    patterns: [/npm_[0-9a-zA-Z]{36}/g],
  },
  {
    key: 'NuGetAPIKey',
    patterns: [/\boy2[a-z0-9]{43}\b/g],
  },
  {
    key: 'PyPIToken',
    patterns: [/\bpypi-[A-Za-z0-9_-]{50,}\b/g],
  },
  {
    key: 'RubyGemsAPIKey',
    patterns: [/\brubygems_[a-f0-9]{48}\b/g],
  },
];
