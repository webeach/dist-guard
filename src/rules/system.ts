import type { Rule } from '../types/common.js';

/** System and environment leak detection rules. */
export const systemRules: ReadonlyArray<Rule> = [
  {
    // Detects absolute local paths from developers' machines.
    // Matches:
    // - macOS: /Users/username/
    // - Linux: /home/username/
    // - Windows: C:/Users/username/ or C:\Users\username\ or C:\\Users\\username\\
    key: 'UserHomeDirLeak',
    patterns: [
      /(?<![a-zA-Z0-9_.-])(?:\/Users\/|\/home\/|[a-zA-Z]:[\\/]+Users[\\/]+)[a-zA-Z0-9_.-]+[\\/]/gi,
    ],
  },
];
