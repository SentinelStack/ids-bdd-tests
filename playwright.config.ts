import { defineConfig } from '@playwright/test';
import { defineBddConfig, cucumberReporter } from 'playwright-bdd';

// Generează testele Playwright din fișierele .feature, legând pașii din src/steps.
const testDir = defineBddConfig({
  features: 'tests/**/*.feature',
  steps: 'src/steps/**/*.ts',
});

export default defineConfig({
  testDir,
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    cucumberReporter('html', { outputFile: 'reports/cucumber.html' }),
    ['list'],
  ],
  use: {
    // baseURL pentru testele web (consola); cel pentru API se ia din config-ul de mediu.
    baseURL: process.env.WEB_BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
});
