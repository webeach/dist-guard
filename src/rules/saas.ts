import type { Rule } from '../types/common.js';

/**
 * SaaS platform secret detection rules.
 *
 * Rules that lack a unique structural prefix use context-aware patterns
 * (require service name near the assignment) to reduce false positives.
 */
export const saasRules: ReadonlyArray<Rule> = [
  {
    // Unique prefix: sbp_
    key: 'SupabaseToken',
    patterns: [/\bsbp_[a-z0-9]{40}\b/g],
  },
  {
    // Unique prefix: ddp_ or ddw_
    key: 'DatadogToken',
    patterns: [/\bdd[pw]_[a-zA-Z0-9]{36}\b/g],
  },
  {
    // Unique prefix: figd_
    key: 'FigmaToken',
    patterns: [/\bfigd_[a-zA-Z0-9_-]{30,80}\b/g],
  },
  {
    // Unique prefix: sntrys_
    key: 'SentryToken',
    patterns: [/\bsntrys_[a-zA-Z0-9]{60,}\b/g],
  },
  {
    // Unique prefix: orgtoken_
    key: 'SentryOrgToken',
    patterns: [/\borgtoken_[a-zA-Z0-9]{60,}\b/g],
  },
  {
    // Unique prefix: api-<uuid>
    key: 'LaunchDarklyToken',
    patterns: [
      /\bapi-[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\b/g,
    ],
  },
  {
    // Unique prefix: ntn_
    key: 'NotionIntegrationToken',
    patterns: [/\bntn_[a-zA-Z0-9]{43}\b/g],
  },
  {
    // Unique prefix: CFPAT-
    key: 'ContentfulPAT',
    patterns: [/\bCFPAT-[a-zA-Z0-9_-]{43}\b/g],
  },
  {
    // Unique structure: pat<14alphanum>.<64hex>
    key: 'AirtablePAT',
    patterns: [/\bpat[a-zA-Z0-9]{14}\.[a-f0-9]{64}\b/g],
  },
  {
    // Unique prefix: lin_api_
    key: 'LinearAPIKey',
    patterns: [/\blin_api_[a-zA-Z0-9]{40}\b/g],
  },
  {
    // Unique prefix: tskey-auth-
    key: 'TailscaleKey',
    patterns: [/\btskey-auth-[a-zA-Z0-9]+-[a-zA-Z0-9]+\b/g],
  },
  {
    // Unique prefix: glsa_
    key: 'GrafanaToken',
    patterns: [/\bglsa_[a-zA-Z0-9_]{32,}_[a-f0-9]{8}\b/g],
  },
  {
    // Unique structure: sk.<base64url_20+>.<base64url_20+>
    // Real Mapbox secret tokens have long base64-encoded segments; short placeholder examples like sk.xxxx.yyyy are excluded.
    key: 'MapboxSecretToken',
    patterns: [/\bsk\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\b/g],
  },
  {
    // Context-aware: Mixpanel, Segment, Amplitude often use 32-char hex strings.
    key: 'AnalyticsSecretKey',
    patterns: [
      /(?:mixpanel|segment|amplitude)[_-]?(?:secret|api)[_-]?(?:key|token)\s*[:=]\s*['"]?([a-zA-Z0-9]{32})['"]?/gi,
    ],
  },
  {
    // Context-aware: Algolia admin keys are 32 hex chars — too generic alone.
    key: 'AlgoliaAdminKey',
    patterns: [
      /algolia[_-]?(?:admin|api)[_-]?(?:key|token|secret)\s*[:=]\s*['"]?([a-f0-9]{32})['"]?/gi,
    ],
  },
  {
    // Context-aware: Honeycomb keys are 22 alphanumeric chars — no structural prefix.
    key: 'HoneycombAPIKey',
    patterns: [
      /honeycomb[_-]?(?:api)?[_-]?(?:key|token|secret)\s*[:=]\s*['"]?([a-zA-Z0-9]{22})['"]?/gi,
    ],
  },
  {
    // Context-aware: Clerk uses sk_live_ and sk_test_ which overlap with Stripe, require context.
    key: 'ClerkSecretKey',
    patterns: [
      /clerk[_-]?(?:secret|api)?[_-]?(?:key|token)\s*[:=]\s*['"]?(sk_(?:live|test)_[a-zA-Z0-9]{30,})['"]?/gi,
    ],
  },
  {
    // Context-aware: Snyk keys are UUIDs — too generic alone.
    key: 'SnykKey',
    patterns: [
      /snyk[_-]?(?:api)?[_-]?(?:key|token|secret)\s*[:=]\s*['"]?([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})['"]?/gi,
    ],
  },
  {
    // Context-aware: Cloudflare API tokens are 40 chars — too generic alone.
    key: 'CloudflareAPIToken',
    patterns: [
      /cloudflare[_-]?(?:api)?[_-]?(?:key|token|secret)\s*[:=]\s*['"]?([A-Za-z0-9_-]{40})['"]?/gi,
    ],
  },
  {
    // Context-aware: Sanity tokens are often long alphanumeric strings.
    key: 'SanityAPIToken',
    patterns: [
      /sanity[_-]?(?:api)?[_-]?(?:key|token|secret)\s*[:=]\s*['"]?([a-zA-Z0-9_-]{40,})['"]?/gi,
    ],
  },
  {
    // Unique prefix: phx_
    key: 'PosthogAPIKey',
    patterns: [/\bphx_[a-zA-Z0-9]{40,}\b/g],
  },
];
