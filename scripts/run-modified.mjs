#!/usr/bin/env node
// Rulează doar fișierele .feature modificate față de main.
import { execSync } from 'node:child_process';
const out = execSync('git diff --name-only origin/main...HEAD').toString();
const features = out.split('\n').filter((f) => f.endsWith('.feature'));
if (features.length === 0) { console.log('Niciun .feature modificat.'); process.exit(0); }
execSync(`npx bddgen && npx playwright test ${features.join(' ')}`, { stdio: 'inherit' });
