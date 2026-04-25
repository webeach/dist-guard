import { resolveConfig, scan } from '../src';

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

describe('Scanner Integration Tests', () => {
  let tmpDir: string;

  beforeAll(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dist-guard-test-'));
  });

  afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  /** Helper to run a scan on a specific string content */
  async function scanContent(content: string) {
    const filename = `test-${Date.now()}-${Math.random()}.js`;
    const testFile = path.join(tmpDir, filename);
    fs.writeFileSync(testFile, content, 'utf-8');

    const originalCwd = process.cwd();
    process.chdir(tmpDir);

    try {
      const config = resolveConfig({
        include: [filename],
        redact: false,
      });
      return await scan(config);
    } finally {
      process.chdir(originalCwd);
    }
  }

  describe('Positive Matches (True Positives)', () => {
    const positiveCases = [
      {
        name: 'Stripe Secret Key',
        content: 'const key = "sk_live_1234567890abcdef1234567890abcdef";',
        expectedRule: 'StripeSecretKey',
      },
      {
        name: 'GitHub Token',
        content: 'const gh = "ghp_1234567890abcdef1234567890abcdef1234";',
        expectedRule: 'GitHubToken',
      },
      {
        name: 'AWS Access Key ID',
        content: 'export const awsKey = "AKIAIOSFODNN7EXAMPLE";',
        expectedRule: 'AWSAccessKey',
      },
      {
        name: 'Slack Bot Token',
        content: 'const token = "xoxb-1234567890-1234567890-abcdef1234567890";',
        expectedRule: 'SlackBotToken',
      },
      {
        name: 'Figma Token',
        content:
          'const figma = "figd_WXYZ-12345678-ABCD-EFGH-IJKL-0123456789AB";',
        expectedRule: 'FigmaToken',
      },
      {
        name: 'Render Token',
        content: 'const render = "rnd_ABCDEF1234567890ABCDEF1234567890";',
        expectedRule: 'RenderToken',
      },
      {
        name: 'Mapbox Secret Token',
        content:
          'const mapbox = "sk.ABCDEF1234567890ABCD.GHIJKL567890ABCDEF12";',
        expectedRule: 'MapboxSecretToken',
      },
      {
        name: 'Vercel Token',
        content: 'const vercel = "vercel_1234567890abcdef12345678";',
        expectedRule: 'VercelToken',
      },
      {
        name: 'User Home Directory Leak (macOS)',
        content:
          'const sourceMap = "/Users/ruslanmart/projects/webeach/app.js";',
        expectedRule: 'UserHomeDirLeak',
      },
      {
        name: 'User Home Directory Leak (Linux)',
        content: 'const path = "/home/ubuntu/app/dist/index.js";',
        expectedRule: 'UserHomeDirLeak',
      },
      {
        name: 'User Home Directory Leak (Windows Forward Slash)',
        content: 'var dir = "C:/Users/Admin/Desktop/app/";',
        expectedRule: 'UserHomeDirLeak',
      },
      {
        name: 'User Home Directory Leak (Windows Backslash)',
        content: 'var dir = "C:\\\\Users\\\\JohnDoe\\\\Documents";',
        expectedRule: 'UserHomeDirLeak',
      },
    ];

    for (const testCase of positiveCases) {
      it(`should detect ${testCase.name}`, async () => {
        const result = await scanContent(testCase.content);
        expect(result.findings.length).toBeGreaterThan(0);
        expect(result.findings[0].ruleKey).toBe(testCase.expectedRule);
      });
    }
  });

  describe('Context-Aware Positive Matches', () => {
    const contextCases = [
      {
        name: 'Supabase URL with Key',
        content:
          'const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFic2RlamtsbW5vcHFyc3R1dnd4eXoiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxMTI1MjA0OCwiZXhwIjoxOTI2ODQ0MDQ4fQ.1234567890abcdef1234567890abcdef1234567890a";',
        expectedRule: 'JWT', // Should be caught as JWT due to eyJ...
      },
      {
        name: 'AWS Secret Access Key with Context',
        content:
          'const aws_secret_access_key = "1234567890abcdef1234567890abcdef12345678";',
        expectedRule: 'AWSSecretKey',
      },
      {
        name: 'Generic API Key with Context',
        content: 'const API_KEY = "1234567890abcdef1234567890abcdef";',
        expectedRule: 'GenericAPIKey',
      },
      {
        name: 'Mixpanel Secret Key with Context',
        content:
          'const mixpanel_secret_key = "1234567890abcdef1234567890abcdef";',
        expectedRule: 'AnalyticsSecretKey',
      },
      {
        name: 'Clerk Secret Key with Context',
        content:
          'const clerk_secret = "sk_live_1234567890abcdef1234567890abcdef";',
        // Note: Ripgrep might classify it as StripeSecretKey because sk_live overlaps and Stripe evaluates first.
        // As long as it finds it, we are happy.
        expectAnyOf: ['ClerkSecretKey', 'StripeSecretKey'],
      },
      {
        name: 'Azure DevOps VSCE PAT',
        content:
          'const AZURE_VSCE = "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234";',
        expectedRule: 'VSCEToken',
      },
    ];

    for (const testCase of contextCases) {
      it(`should detect ${testCase.name}`, async () => {
        const result = await scanContent(testCase.content);
        expect(result.findings.length).toBeGreaterThan(0);

        if (testCase.expectAnyOf) {
          expect(testCase.expectAnyOf).toContain(result.findings[0].ruleKey);
        } else {
          expect(result.findings[0].ruleKey).toBe(testCase.expectedRule);
        }
      });
    }
  });

  describe('Negative Matches (False Positives Prevention)', () => {
    const negativeCases = [
      {
        name: 'Generic UUID (No context)',
        content: 'const id = "123e4567-e89b-12d3-a456-426614174000";',
      },
      {
        name: 'Generic 32-char Hex (No context)',
        content: 'const hash = "1234567890abcdef1234567890abcdef";',
      },
      {
        name: 'Generic 40-char Hex (No context)',
        content:
          'const commitSha = "1234567890abcdef1234567890abcdef12345678";',
      },
      {
        name: 'Fake AWS Access Key (Wrong length/prefix)',
        content: 'const key = "AKIA123";', // Too short
      },
      {
        name: 'Normal text containing "API_KEY"',
        content: 'console.log("Please provide your API_KEY in the dashboard");', // No assignment/equals
      },
      {
        name: 'Normal URL path with /users/ (Not a local user dir)',
        content: 'const url = "https://example.com/users/admin/profile";',
      },
      {
        name: 'Normal URL path with /home/ (Not a local user dir)',
        content: 'const url = "http://localhost:3000/home/ubuntu";',
      },
      {
        name: 'Relative path starting with users/',
        content: 'const path = "users/admin/data.json";',
      },
      {
        name: 'Simple username in text (Not a local path)',
        content: 'const message = "Hello admin, welcome back!";',
      },
      {
        name: 'Random Base64 String (No context)',
        content: 'const b64 = "SGVsbG8gV29ybGQ=";',
      },
    ];

    for (const testCase of negativeCases) {
      it(`should ignore ${testCase.name}`, async () => {
        const result = await scanContent(testCase.content);
        expect(result.findings).toHaveLength(0);
      });
    }
  });
});
