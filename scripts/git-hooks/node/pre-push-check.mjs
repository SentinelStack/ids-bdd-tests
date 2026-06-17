#!/usr/bin/env node
// Rulează typecheck + lint înainte de push.
import { execSync } from 'node:child_process';
try {
  execSync('npm run typecheck', { stdio: 'inherit' });
  execSync('npm run lint', { stdio: 'inherit' });
} catch {
  process.exit(1);
}
