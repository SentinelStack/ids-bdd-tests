import { defineConfig } from '@playwright/test';
import { defineBddConfig, cucumberReporter } from 'playwright-bdd';

const testDir = defineBddConfig({
  features: 'tests/**/*.feature',
  steps: 'src/steps/**/*.ts',
});

export default defineConfig({
  testDir,
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    cucumberReporter('html', { outputFile: 'reports/cucumber.html' }),
    ['list'],
  ],
  use: {

    baseURL: process.env.WEB_BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
});
