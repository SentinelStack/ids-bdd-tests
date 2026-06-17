import { test as base, createBdd } from 'playwright-bdd';
import { loadEnv } from '@support/env';
import { UnifiedWorld } from '@support/worlds/UnifiedWorld';

type Fixtures = { world: UnifiedWorld };

// `world` e construit proaspăt pentru fiecare scenariu și agregă api/web/db.
export const test = base.extend<Fixtures>({
  world: async ({ page }, use) => { await use(new UnifiedWorld(loadEnv(), page)); },
});

export const { Given, When, Then, Before, After } = createBdd(test);
