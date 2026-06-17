#!/usr/bin/env node
// Rulează un singur fișier .feature: node scripts/run-feature.mjs tests/@api/.../x.feature
import { execSync } from 'node:child_process';
const feature = process.argv[2];
if (!feature) { console.error('Indică un fișier .feature'); process.exit(1); }
execSync(`npx bddgen && npx playwright test ${feature}`, { stdio: 'inherit' });
