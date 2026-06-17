import { test as base } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { loadEnv, Env } from '../support/env';
import { ScenarioContext } from '../support/context/ScenarioContext';
import { ApiWorld } from '../support/worlds/ApiWorld';
import { WebWorld } from '../support/worlds/WebWorld';
import { DbWorld } from '../support/worlds/DbWorld';

type Fixtures = {
  env: Env;
  context: ScenarioContext;
  api: ApiWorld;
  web: WebWorld;
  db: DbWorld;
};

// Fixturile joacă rolul „world"-urilor: sunt construite proaspăt pentru fiecare scenariu.
export const test = base.extend<Fixtures>({
  env: async ({}, use) => { await use(loadEnv()); },
  context: async ({}, use) => { await use(new ScenarioContext()); },
  api: async ({ env, context }, use) => { await use(new ApiWorld(env, context)); },
  web: async ({ page, env, context }, use) => { await use(new WebWorld(page, env, context)); },
  db: async ({ env }, use) => { await use(new DbWorld(env)); },
});

export const { Given, When, Then, Before, After } = createBdd(test);
