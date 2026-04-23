import type { Rule } from '../types/common.js';

/** Database connection string detection rules (sorted by key). */
export const databaseRules: ReadonlyArray<Rule> = [
  {
    key: 'AzureRedisConnectionString',
    patterns: [
      /\b[\w\d.-]{1,100}\.redis\.cache\.windows\.net:6380,password=[^,]{44},ssl=True,abortConnect=False\b/g,
    ],
  },
  {
    key: 'FTPCredentials',
    patterns: [/\bftp:\/\/[\S]{3,50}:[\S]{3,50}@[-.%\w/:]+\b/g],
  },
  {
    key: 'JDBCConnectionString',
    patterns: [/jdbc:[a-z]+:\/\/[^\s;]+(?:;[^\s;]*)*password=[^\s;]+/gi],
  },
  {
    key: 'MongoDBConnectionString',
    patterns: [
      /\bmongodb(?:\+srv)?:\/\/\S{3,50}:\S{3,88}@[-.%\w]+(?::\d{1,5})?(?:,[-.%\w]+(?::\d{1,5})?)*/g,
    ],
  },
  {
    key: 'MySQLConnectionString',
    patterns: [/\bmysql:\/\/\S+\b/gi],
  },
  {
    key: 'PostgreSQLConnectionString',
    patterns: [/\b(?:postgres(?:ql)?):\/\/\S+\b/gi],
  },
  {
    key: 'RedisConnectionString',
    patterns: [/\bredi[s]{1,2}:\/\/[\S]{3,50}:([\S]{3,50})@[-.%\w/:]+\b/g],
  },
  {
    key: 'SQLServerConnectionString',
    patterns: [/Server=[^;]+;.*Password=[^;]+/gi],
  },
];
