import type { Rule } from '../types/common.js';

/** Cryptographic key and token detection rules (sorted by key). */
export const cryptoKeyRules: ReadonlyArray<Rule> = [
  {
    key: 'JWT',
    patterns: [
      /\b((?:eyJ|ewogIC|ewoid)[A-Za-z0-9_-]{12,}={0,2}\.(?:eyJ|ewo)[A-Za-z0-9_-]{12,}={0,2}\.[A-Za-z0-9_-]{12,})\b/g,
    ],
  },
  {
    key: 'PGPPrivateKey',
    patterns: [
      /-----BEGIN PGP PRIVATE KEY BLOCK-----[\s\S]+?-----END PGP PRIVATE KEY BLOCK-----/g,
    ],
  },
  {
    key: 'PrivateKey',
    patterns: [
      /-----\s*?BEGIN[ A-Z0-9_-]*?PRIVATE KEY\s*?-----[\s\S]*?----\s*?END[ A-Z0-9_-]*? PRIVATE KEY\s*?-----/gi,
    ],
  },
  {
    key: 'RSAPrivateKey',
    patterns: [
      /-----BEGIN RSA PRIVATE KEY-----[\s\S]+?-----END RSA PRIVATE KEY-----/g,
    ],
  },
  {
    key: 'SSHPrivateKey',
    patterns: [
      /-----BEGIN OPENSSH PRIVATE KEY-----[\s\S]+?-----END OPENSSH PRIVATE KEY-----/g,
    ],
  },
];
