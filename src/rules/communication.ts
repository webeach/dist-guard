import type { Rule } from '../types/common.js';

/** Communication platform secret detection rules (sorted by key). */
export const communicationRules: ReadonlyArray<Rule> = [
  {
    key: 'DiscordBotToken',
    patterns: [/\b[A-Za-z0-9_-]{24}\.[A-Za-z0-9_-]{6}\.[A-Za-z0-9_-]{27}\b/g],
  },
  {
    key: 'DiscordWebhook',
    patterns: [
      /https:\/\/discord\.com\/api\/webhooks\/[0-9]{18,19}\/[0-9a-zA-Z-]{68}/g,
    ],
  },
  {
    // Context-aware: Line channel access tokens are 172-char base64 strings — too generic alone.
    key: 'LineMessagingToken',
    patterns: [
      /(?:line[_-]?(?:channel[_-]?)?(?:access[_-]?)?token|line[_-]?secret)\s*[:=]\s*['"]?([a-zA-Z0-9+/=]{172})['"]?/gi,
    ],
  },
  {
    key: 'MicrosoftTeamsWebhook',
    patterns: [
      /https:\/\/[a-z0-9]+\.webhook\.office\.com\/webhookb2\/[a-z0-9-]+/g,
    ],
  },
  {
    key: 'SlackBotToken',
    patterns: [/xoxb-[0-9]{10,13}-[0-9]{10,13}[a-zA-Z0-9-]*/g],
  },
  {
    key: 'SlackUserToken',
    patterns: [/xoxp-[0-9]{10,13}-[0-9]{10,13}[a-zA-Z0-9-]*/g],
  },
  {
    key: 'SlackWebhook',
    patterns: [
      /https:\/\/hooks\.slack\.com\/services\/T[A-Z0-9]+\/B[A-Z0-9]+\/[A-Za-z0-9]{23,25}/g,
      /https:\/\/hooks\.slack\.com\/workflows\/T[A-Z0-9]+\/A[A-Z0-9]+\/[0-9]{17,19}\/[A-Za-z0-9]{23,25}/g,
    ],
  },
  {
    key: 'SlackWorkspaceToken',
    patterns: [/xoxa-[0-9]{10,13}-[0-9]{10,13}[a-zA-Z0-9-]*/g],
  },
  {
    key: 'TelegramBotToken',
    patterns: [/\b[0-9]{8,10}:[a-zA-Z0-9_-]{35}\b/g],
  },
  {
    key: 'TwilioAccountSID',
    patterns: [/\bAC[0-9a-f]{32}\b/g],
  },
  {
    key: 'TwilioAPIKey',
    patterns: [/\bSK[0-9a-f]{32}\b/g],
  },
];
