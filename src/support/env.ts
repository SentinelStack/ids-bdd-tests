import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const readJson = (p: string): any => JSON.parse(readFileSync(resolve(root, p), 'utf8'));

export interface Env {
  name: string;
  apiBaseUrl: string;
  webBaseUrl: string;
  reportsPathPrefix: string;
  agentApiKey: string;
  operator: { username: string; password: string; totpSecret: string };
  mongo: { uri: string; database: string };
  clickhouse: { url: string; database: string };
  timeouts: { actionMs: number; expectMs: number; pollMs: number };
}

let cached: Env | undefined;

/** Încarcă mediul ales (ENV=qa|qa-local|demo), peste defaults + ci, cu secrete din variabile de mediu. */
export function loadEnv(): Env {
  if (cached) return cached;
  const envName = process.env.ENV ?? 'qa-local';
  const defaults = readJson('config/defaults.json');
  const ci = process.env.CI ? readJson('config/ci.json') : {};
  const e = readJson(`config/environments/${envName}.json`);
  const get = (name: string, fallback = '') => process.env[name] ?? fallback;
  cached = {
    name: e.name,
    apiBaseUrl: process.env.API_BASE_URL ?? e.apiBaseUrl,
    webBaseUrl: process.env.WEB_BASE_URL ?? e.webBaseUrl,
    reportsPathPrefix: e.reportsPathPrefix,
    agentApiKey: get(e.agentApiKeyEnv),
    operator: {
      username: get(e.operator.usernameEnv),
      password: get(e.operator.passwordEnv),
      totpSecret: get(e.operator.totpSecretEnv),
    },
    mongo: { uri: get(e.mongo.uriEnv), database: e.mongo.database },
    clickhouse: { url: get(e.clickhouse.urlEnv), database: e.clickhouse.database },
    timeouts: { ...defaults.timeouts, ...(ci.timeouts ?? {}) },
  };
  return cached;
}
