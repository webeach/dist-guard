import type { Rule } from '../types/common.js';

/** Version control platform secret detection rules (sorted by key). */
export const versionControlRules: ReadonlyArray<Rule> = [
  {
    // Context-aware: Azure DevOps PATs are alphanumeric strings,
    // 52 chars (old format) or 84 chars (new format since 2022).
    // Too generic without context — require PAT-related variable name.
    key: 'AzureDevOpsPAT',
    patterns: [
      /(?:azure_?devops_?(?:pat|token|password)|system_?accesstoken|devops_?token)\s*[:=]\s*['"']?([a-zA-Z0-9]{52,84})['"']?/gi,
    ],
  },
  {
    key: 'BitbucketAppPassword',
    patterns: [/\bATBB[a-zA-Z0-9]{32}\b/g],
  },
  {
    key: 'GitHubAppToken',
    patterns: [/\b((?:ghu|ghs)_[a-zA-Z0-9]{36})\b/g],
  },
  {
    key: 'GitHubOAuth',
    patterns: [/\bgho_[a-zA-Z0-9]{36}\b/g],
  },
  {
    key: 'GitHubToken',
    patterns: [
      /\b((?:ghp|gho|ghu|ghs|ghr|github_pat)_[a-zA-Z0-9_]{36,255})\b/g,
    ],
  },
  {
    key: 'GitLabPersonalAccessToken',
    patterns: [/\bglpat-[a-zA-Z0-9\-=_]{20,22}\b/g],
  },
  {
    key: 'GitLabPipelineToken',
    patterns: [/\bglptt-[a-zA-Z0-9_-]{20,}\b/g],
  },
];
