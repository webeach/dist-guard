import type { Rule } from '../types/common.js';

/** CI/CD platform secret detection rules (sorted by key). */
export const ciCdRules: ReadonlyArray<Rule> = [
  {
    key: 'BuildkiteToken',
    patterns: [/\bbkua_[a-f0-9]{40}\b/g],
  },
  {
    key: 'CircleCIToken',
    patterns: [/\bcircle-token_[a-zA-Z0-9]{40}\b/g],
  },
  {
    key: 'DockerAuthConfig',
    patterns: [/\{"auths"\s*:\s*\{[^}]*"auth"\s*:\s*"[A-Za-z0-9+/=]+"/g],
  },
  {
    key: 'DockerHubToken',
    patterns: [/\bdckr_pat_[A-Za-z0-9_-]{27}\b/g],
  },
  {
    key: 'DroneCIToken',
    patterns: [/\bdrone_[a-zA-Z0-9]{32}\b/g],
  },
  {
    key: 'FlyIOToken',
    patterns: [/\bfo1_[a-zA-Z0-9_-]{39}\b/g],
  },
  {
    key: 'HerokuAPIKey',
    patterns: [/\bHRKU-AA[0-9a-zA-Z_-]{58}\b/g],
  },
  {
    key: 'NetlifyToken',
    patterns: [/\bnfp_[a-zA-Z0-9]{40}\b/g],
  },
  {
    key: 'PulumiAccessToken',
    patterns: [/\bpul-[a-f0-9]{40}\b/g],
  },
  {
    key: 'RailwayAPIToken',
    patterns: [/\brailway_[a-zA-Z0-9_-]{36}\b/g],
  },
  {
    key: 'RenderToken',
    patterns: [/\brnd_[a-zA-Z0-9]{32,}\b/g],
  },
  {
    key: 'TerraformCloudToken',
    patterns: [/\b[a-zA-Z0-9]{14}\.atlasv1\.[a-zA-Z0-9_-]{60,}\b/g],
  },
  {
    key: 'TravisCIToken',
    patterns: [/\btravis-ci_[a-zA-Z0-9]{22}\b/g],
  },
  {
    key: 'VercelToken',
    patterns: [/\bvercel_[a-zA-Z0-9]{24}\b/g],
  },
  {
    // VSCE (VS Code Extension) publish tokens are Azure DevOps PATs.
    // Commonly stored as AZURE_VSCE, VSCE_PAT, VSCE_TOKEN, etc.
    key: 'VSCEToken',
    patterns: [
      /(?:azure_vsce|vsce|vsce_?(?:pat|token|password))\s*[:=]\s*['"]?([a-zA-Z0-9]{52,100})['"]?/gi,
    ],
  },
];
