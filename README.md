# ids-bdd-tests

End-to-end and API **BDD** (Gherkin) tests for the **Sentinel IDS** platform, built with
**Playwright + playwright-bdd + TypeScript**. The layout follows a domain-oriented test
framework (API clients, page objects, steps, worlds, data generators, validators).

## Covered areas
- `@api` — the backend REST API: devices, alerts, traffic, forensics, rules, account/auth, reports.
- `@web` — the AEGIS IDS web console (login + 2FA, dashboard, incidents, rules, export).
- `@e2e` — the full edge → cloud → console flow (an agent alert shows up in the UI).

## Layout
```
config/environments/   environments (qa, qa-local, demo) + defaults/ci
src/clients/           API clients (per domain) + DB (Mongo, ClickHouse)
src/pages/console/     console page objects
src/steps/             step definitions (api/web/e2e) + bdd.ts (fixtures/worlds)
src/support/           env, worlds (Api/Web/Db), scenario context, logger
src/data/generators/   test-data builders
src/schemas/zod/       validation schemas
src/validators/        response validators
tests/                 .feature files (Gherkin), grouped by area and domain
scripts/               git hooks + selective test runs
```

## Running
```bash
npm install
npx playwright install         # browsers (only for @web/@e2e tests)
npm run bddgen                 # generate the Playwright specs from the .feature files
npm test                       # bddgen + playwright test (all)
npm run test:api               # @api only
npm run test:web               # @web only
npm run test:e2e               # @e2e only
npm run report                 # HTML report
```

## Configuration (environment variables — secrets are NOT committed)
- `ENV` — the environment (qa | qa-local | demo).
- `AGENT_API_KEY` — the agent key (for the ingestion endpoints).
- `OPERATOR_USER`, `OPERATOR_PASS`, `OPERATOR_TOTP_SECRET` — the operator test account (2FA).
- `MONGODB_URI`, `CLICKHOUSE_URL` — optional, for database assertions.

> Page-object selectors are placeholders (marked `// TODO`) — adjust them to the real console DOM.

## Versions
Use **modern, aligned** versions (tested on Node 25): `playwright`/`@playwright/test` `^1.61`
and `playwright-bdd` `^9.1`. In playwright-bdd 9.x, `test` is extended from `'playwright-bdd'`
(see `src/steps/bdd.ts`), not from `'@playwright/test'`.
Possible errors on a version mismatch: `Cannot find module .../playwright/lib/common/configLoader.js`
(playwright-bdd too old for the installed Playwright) or `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX`
(Playwright too old for the installed Node) — in both cases run
`npm install -D @playwright/test@latest playwright@latest playwright-bdd@latest`.

## Test coverage
57 `.feature` files · 141 scenarios · positive (`requestResponse/`) + negative (`errorHandling/`)
for every backend endpoint, plus `@web` (console) and `@e2e` (full flow).

Steps follow the "world" model: a single `world: UnifiedWorld` fixture (`world.api` with clients +
per-domain context + `state` + `log`), regex patterns with an optional alias, `normalizeAlias`,
zod-typed bodies, `faker` data, and header overrides for the negative cases.
