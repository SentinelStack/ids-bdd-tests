import { test as base } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { loadEnv, Env } from '../support/env';
import { ScenarioContext } from '../support/context/ScenarioContext';
import { ApiWorld } from '../support/worlds/ApiWorld';
import { WebWorld } from '../support/worlds/WebWorld';
import { DbWorld } from '../support/worlds/DbWorld';

type Fixtures = {
  env: Env;
  scenario: ScenarioContext;
  api: ApiWorld;
  web: WebWorld;
  db: DbWorld;
};

// Fixturile joacă rolul „world"-urilor: sunt construite proaspăt pentru fiecare scenariu.
// (`scenario` în loc de `context`, ca să nu se ciocnească cu fixtura `context: BrowserContext` din Playwright.)
export const test = base.extend<Fixtures>({
  env: async ({}, use) => { await use(loadEnv()); },
  scenario: async ({}, use) => { await use(new ScenarioContext()); },
  api: async ({ env, scenario }, use) => { await use(new ApiWorld(env, scenario)); },
  web: async ({ page, env, scenario }, use) => { await use(new WebWorld(page, env, scenario)); },
  db: async ({ env }, use) => { await use(new DbWorld(env)); },
});

export const { Given, When, Then, Before, After } = createBdd(test);
