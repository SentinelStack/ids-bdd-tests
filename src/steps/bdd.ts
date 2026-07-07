import { test as base, createBdd } from 'playwright-bdd';
import { loadEnv } from '@support/env';
import { UnifiedWorld } from '@support/worlds/UnifiedWorld';

type Fixtures = { world: UnifiedWorld };

export const test = base.extend<Fixtures>({
  world: async ({ page }, use, testInfo) => {
    const world = new UnifiedWorld(loadEnv(), page);
    world.scenarioTitle = testInfo.title;
    await use(world);
  },
});

export const { Given, When, Then, Before, After } = createBdd(test);
