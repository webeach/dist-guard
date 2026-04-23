import type { Rule } from '../types/common.js';

/** Payment service secret detection rules (sorted by key). */
export const paymentRules: ReadonlyArray<Rule> = [
  {
    key: 'BraintreeAccessToken',
    patterns: [
      /access_token\$(?:production|sandbox)\$[a-z0-9]{16}\$[a-f0-9]{32}/g,
    ],
  },
  {
    key: 'FlutterwaveKey',
    patterns: [/FLWSECK-[a-fA-F0-9]{32}-X/g],
  },
  {
    key: 'PaymongoKey',
    patterns: [/\bsk_(?:live|test)_[a-zA-Z0-9]{40,}\b/g],
  },
  {
    key: 'PayPalOAuth',
    patterns: [/\baccess_token\$production\$[a-z0-9]{13}\$[a-f0-9]{32}\b/g],
  },
  {
    key: 'PaystackKey',
    patterns: [/\bsk_(?:live|test)_[a-zA-Z0-9]{40}\b/g],
  },
  {
    key: 'ShopifyAccessToken',
    patterns: [/\b(?:shppa_|shpat_)[0-9A-Fa-f]{32}\b/g],
  },
  {
    key: 'ShopifySharedSecret',
    patterns: [/\bshpss_[0-9A-Fa-f]{32}\b/g],
  },
  {
    key: 'SquareAccessToken',
    patterns: [/\bEAAA[a-zA-Z0-9_-]{48,60}\b/g],
  },
  {
    key: 'StripePublishableKey',
    patterns: [/pk_live_[a-zA-Z0-9]{20,247}/g],
  },
  {
    key: 'StripeSecretKey',
    patterns: [/[rs]k_live_[a-zA-Z0-9]{20,247}/g],
  },
  {
    key: 'StripeWebhookSecret',
    patterns: [/whsec_[a-zA-Z0-9]{32,}/g],
  },
];
