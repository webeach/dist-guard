import type { Rule } from '../types/common.js';

/** Cloud provider secret detection rules (sorted by key). */
export const cloudProviderRules: ReadonlyArray<Rule> = [
  {
    key: 'AlibabaCloudAccessKey',
    patterns: [/\bLTAI[A-Za-z0-9]{20}\b/g],
  },
  {
    // Unique prefix: AKIA / ABIA / ACCA
    key: 'AWSAccessKey',
    patterns: [/\b((?:AKIA|ABIA|ACCA)[A-Z0-9]{16})\b/g],
  },
  {
    // Context-aware: AWS secret access keys are 40 base64 chars — too generic alone.
    key: 'AWSSecretKey',
    patterns: [
      /(?:aws_secret_access_key|secretAccessKey)\s*[:=]\s*['"]?([A-Za-z0-9+/]{40})['"]?/gi,
    ],
  },
  {
    key: 'AzureAppConfigConnectionString',
    patterns: [/Endpoint=https:\/\/[^;]+;Id=[^;]+;Secret=[A-Za-z0-9+/=]+/g],
  },
  {
    key: 'AzureConnectionString',
    patterns: [
      /DefaultEndpointsProtocol=https?;AccountName=[^;]+;AccountKey=[A-Za-z0-9+/=]{88}/g,
    ],
  },
  {
    key: 'AzureSASToken',
    patterns: [/[?&]sig=[A-Za-z0-9%+/=]+&(?:se|st|sv|sp|sr)=[^&\s]+/g],
  },
  {
    key: 'DigitalOceanOAuthToken',
    patterns: [/\bdoo_v1_[a-f0-9]{64}\b/g],
  },
  {
    key: 'DigitalOceanRefreshToken',
    patterns: [/\bdor_v1_[a-f0-9]{64}\b/g],
  },
  {
    key: 'DigitalOceanToken',
    patterns: [/\bdop_v1_[a-f0-9]{64}\b/g],
  },
  {
    key: 'GCPServiceAccount',
    patterns: [/\{[^{]+auth_provider_x509_cert_url[^}]+\}/g],
  },
  {
    key: 'GoogleAPIKey',
    patterns: [/\bAIza[0-9A-Za-z_-]{35}\b/g],
  },
  {
    // Context-aware: IBM Cloud API keys are 44 alphanum chars — no structural prefix.
    key: 'IBMCloudAPIKey',
    patterns: [
      /ibm[_-]?(?:cloud)?[_-]?(?:api)?[_-]?(?:key|token|secret)\s*[:=]\s*['"]?([A-Za-z0-9_-]{44})['"]?/gi,
    ],
  },
  {
    key: 'ScalewayKey',
    patterns: [/\bSCW[A-Z0-9]{28}\b/g],
  },
  {
    // Context-aware: Vultr API keys are 36 uppercase alphanum — no structural prefix.
    key: 'VultrAPIKey',
    patterns: [
      /vultr[_-]?(?:api)?[_-]?(?:key|token|secret)\s*[:=]\s*['"]?([A-Z0-9]{36})['"]?/gi,
    ],
  },
];
