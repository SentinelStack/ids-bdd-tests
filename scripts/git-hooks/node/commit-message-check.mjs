#!/usr/bin/env node
// Validează mesajul de commit în stil Conventional Commits.
import { readFileSync } from 'node:fs';
const msg = readFileSync(process.argv[2] ?? '.git/COMMIT_EDITMSG', 'utf8').trim();
const re = /^(feat|fix|chore|test|docs|refactor|ci)(\(.+\))?!?: .{3,}/;
if (!re.test(msg.split('\n')[0])) {
  console.error('Mesaj de commit invalid (Conventional Commits).');
  process.exit(1);
}
