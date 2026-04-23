import type { Rule } from '../types/common.js';

/** Generic secret detection rules (sorted by key). */
export const genericRules: ReadonlyArray<Rule> = [
  {
    key: 'BasicAuthURL',
    patterns: [
      /\bhttps?:\/\/[^\s@]+:[^\s@]+@[a-zA-Z0-9.-]+(?:\.[a-zA-Z]{2,})?(?::\d{1,5})?[\w/]*\b/g,
    ],
  },
  {
    key: 'EnvironmentVariable',
    patterns: [
      /(?:process\.env|import\.meta\.env)\.[A-Z_]{2,}\s*(?:\|\||&&|\?\?)\s*["']([a-zA-Z0-9_\-+/=:.]{8,})["']/g,
    ],
  },
  {
    key: 'GenericAPIKey',
    patterns: [
      /(?:api[_-]?key|apikey|api[_-]?secret)\s*[:=]\s*["']([a-zA-Z0-9_-]{20,})["']/gi,
    ],
  },
  {
    key: 'GenericConnectionString',
    patterns: [
      /(?:connection[_-]?string|conn[_-]?str)\s*[:=]\s*["']([^"']{20,})["']/gi,
    ],
  },
  {
    key: 'GenericSecret',
    patterns: [
      /(?:secret|password|passwd|pwd|token|auth)\s*[:=]\s*["']([a-zA-Z0-9_\-+/=]{16,})["']/gi,
    ],
  },
];
