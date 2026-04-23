import type { Rule } from '../types/common.js';

/** AI service secret detection rules (sorted by key). */
export const aiServiceRules: ReadonlyArray<Rule> = [
  {
    key: 'AnthropicKey',
    patterns: [/\bsk-ant-api03-[A-Za-z0-9_-]{93}-[A-Za-z0-9_-]{6}AA\b/g],
  },
  {
    key: 'CohereAPIKey',
    patterns: [
      /cohere[_-]?(?:api)?[_-]?(?:key|token|secret)\s*[:=]\s*['"]?([a-zA-Z0-9]{40})['"]?/gi,
    ],
  },
  {
    key: 'DeepSeekKey',
    patterns: [/\bsk-[a-f0-9]{48}\b/g],
  },
  {
    key: 'ElevenLabsKey',
    patterns: [
      /elevenlabs[_-]?(?:api)?[_-]?(?:key|token|secret)\s*[:=]\s*['"]?([a-f0-9]{32})['"]?/gi,
    ],
  },
  {
    key: 'GroqKey',
    patterns: [/\bgsk_[a-zA-Z0-9]{52}\b/g],
  },
  {
    key: 'HuggingFaceToken',
    patterns: [/\bhf_[a-zA-Z0-9]{34}\b/g],
  },
  {
    key: 'NVIDIANGCKey',
    patterns: [/\bnvapi-[a-zA-Z0-9_-]{64}\b/g],
  },
  {
    key: 'OpenAIKey',
    patterns: [
      /\b(sk-(?:(?:proj|svcacct|service)-[A-Za-z0-9_-]+|[a-zA-Z0-9]+)T3BlbkFJ[A-Za-z0-9_-]+)\b/g,
    ],
  },
  {
    key: 'ReplicateToken',
    patterns: [/\br8_[a-zA-Z0-9]{40}\b/g],
  },
  {
    key: 'xAIKey',
    patterns: [/\bxai-[a-zA-Z0-9]{48}\b/g],
  },
];
