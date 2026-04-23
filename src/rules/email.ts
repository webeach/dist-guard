import type { Rule } from '../types/common.js';

/**
 * Email service secret detection rules.
 *
 * Rules without a unique structural prefix use context-aware patterns:
 * require the service name near the assignment to avoid false positives.
 */
export const emailRules: ReadonlyArray<Rule> = [
  {
    // Unique prefix: SG.<key_id>.<secret>
    key: 'SendGridAPIKey',
    patterns: [/\bSG\.[\w-]{20,24}\.[\w-]{39,50}\b/g],
  },
  {
    // Unique prefix: key-<32 hex>  OR  <hex>-<hex>-<hex> (Mailgun private format)
    key: 'MailgunAPIKey',
    patterns: [
      /\bkey-[a-z0-9]{32}\b/g,
      /\b[a-f0-9]{32}-[a-f0-9]{8}-[a-f0-9]{8}\b/g,
    ],
  },
  {
    // Unique suffix: <32 hex>-us<1-2 digits>
    key: 'MailchimpAPIKey',
    patterns: [/\b[a-f0-9]{32}-us[0-9]{1,2}\b/g],
  },
  {
    // Context-aware: Postmark server/account tokens are UUIDs — too generic alone.
    key: 'PostmarkToken',
    patterns: [
      /postmark[_-]?(?:server|account|api)?[_-]?(?:token|key|secret)\s*[:=]\s*['"]?([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})['"]?/gi,
    ],
  },
  {
    // Context-aware: SparkPost keys are 40 hex chars — too generic alone.
    key: 'SparkPostAPIKey',
    patterns: [
      /sparkpost[_-]?(?:api)?[_-]?(?:key|token|secret)\s*[:=]\s*['"]?([a-f0-9]{40})['"]?/gi,
    ],
  },
  {
    // Context-aware: Mandrill keys are 22 random chars — no structural prefix.
    key: 'MandrillKey',
    patterns: [
      /mandrill[_-]?(?:api)?[_-]?(?:key|token|secret)\s*[:=]\s*['"]?([a-zA-Z0-9_-]{22})['"]?/gi,
    ],
  },
  {
    // Context-aware: Mailjet keys are 32 hex chars — too generic alone.
    key: 'MailjetAPIKey',
    patterns: [
      /mailjet[_-]?(?:api)?[_-]?(?:key|token|secret|public|private)\s*[:=]\s*['"]?([a-f0-9]{32})['"]?/gi,
    ],
  },
  {
    // Context-aware: Elastic Email keys are GUIDs — too generic alone.
    key: 'ElasticEmailKey',
    patterns: [
      /elastic[_-]?email[_-]?(?:api)?[_-]?(?:key|token)\s*[:=]\s*['"]?([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})['"]?/gi,
    ],
  },
];
