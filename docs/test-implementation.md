# How to write a test

1. Add a `.feature` file under `tests/<area>/...` (Gherkin: Given/When/Then), with tags (`@api`, `@web`, `@e2e`, `@devices`...).
2. Implement the steps in `src/steps/...` using `Given/When/Then` from `src/steps/bdd.ts`.
3. Steps use the worlds (`world.api`, `world.web`, `world.db`) to call the API clients / page objects.
4. Run: `npm test` (all), `npm run test:api`, `npm run test:web`, `npm run test:e2e`.

The layout follows the reference: `clients/` (API + DB), `pages/` (console page objects), `steps/`, `support/worlds`, `data/generators`, `validators/`, `schemas/zod`.
