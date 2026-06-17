import { test as base, createBdd } from 'playwright-bdd';
import { loadEnv } from '@support/env';
import { UnifiedWorld } from '@support/worlds/UnifiedWorld';

type Fixtures = { world: UnifiedWorld };

export const test = base.extend<Fixtures>({
  world: async ({ page }, use) => { await use(new UnifiedWorld(loadEnv(), page)); },
});

export const { Given, When, Then, Before, After } = createBdd(test);
