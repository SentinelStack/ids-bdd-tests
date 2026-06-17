#!/usr/bin/env node
// Verifică denumirea ramurii: <tip>/<descriere-kebab> (feat, fix, chore, test, docs).
import { execSync } from 'node:child_process';
const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
const ok = /^(feat|fix|chore|test|docs)\/[a-z0-9._-]+$/.test(branch) || branch === 'main';
if (!ok) {
  console.error(`Ramură invalidă: "${branch}". Folosește <tip>/<descriere>.`);
  process.exit(1);
}
