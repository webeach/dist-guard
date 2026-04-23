import type { Rule } from '../types/common.js';
import { aiServiceRules } from './ai-services.js';
import { ciCdRules } from './ci-cd.js';
import { cloudProviderRules } from './cloud-providers.js';
import { communicationRules } from './communication.js';
import { cryptoKeyRules } from './crypto-keys.js';
import { databaseRules } from './databases.js';
import { emailRules } from './email.js';
import { genericRules } from './generic.js';
import { packageRegistryRules } from './package-registries.js';
import { paymentRules } from './payment.js';
import { saasRules } from './saas.js';
import { systemRules } from './system.js';
import { versionControlRules } from './version-control.js';

/** All detection rules aggregated. */
export const rules: ReadonlyArray<Rule> = [
  ...cloudProviderRules,
  ...aiServiceRules,
  ...versionControlRules,
  ...communicationRules,
  ...paymentRules,
  ...databaseRules,
  ...ciCdRules,
  ...emailRules,
  ...cryptoKeyRules,
  ...packageRegistryRules,
  ...saasRules,
  ...systemRules,
  ...genericRules,
];

export type { Rule } from '../types/common.js';

export {
  aiServiceRules,
  ciCdRules,
  cloudProviderRules,
  communicationRules,
  cryptoKeyRules,
  databaseRules,
  emailRules,
  genericRules,
  packageRegistryRules,
  paymentRules,
  saasRules,
  systemRules,
  versionControlRules,
};
