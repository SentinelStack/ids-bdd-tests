# ids-bdd-tests

Teste **BDD** (Gherkin) end-to-end și de API pentru platforma **Sentinel IDS**, cu
**Playwright + playwright-bdd + TypeScript**. Structura urmează un cadru de testare pe
domenii (clienți API, page-objects, pași, world-uri, generatoare de date, validatori).

## Domenii acoperite
- `@api` — interfața REST a backendului: dispozitive, alerte, trafic, criminalistică, reguli, conturi/autentificare, export.
- `@web` — consola web AEGIS IDS (login + 2FA, tablou de bord, incidente, reguli, export).
- `@e2e` — fluxul complet edge → cloud → consolă (alerta agentului apare în interfață).

## Structură
```
config/environments/   medii (qa, qa-local, demo) + defaults/ci
src/clients/           clienți API (per domeniu) + DB (Mongo, ClickHouse)
src/pages/console/     page-objects pentru consolă
src/steps/             definițiile pașilor (api/web/e2e) + bdd.ts (fixturi/world-uri)
src/support/           env, world-uri (Api/Web/Db), context de scenariu, logger
src/data/generators/   constructori de date de test
src/schemas/zod/       scheme de validare
src/validators/        validatori de răspuns
tests/                 fișierele .feature (Gherkin), pe zone și domenii
scripts/               git-hooks + rulare selectivă a testelor
```

## Rulare
```bash
npm install
npx playwright install         # browsere
ENV=qa npm test                # toate
npm run test:api               # doar @api
npm run test:web               # doar @web
npm run test:e2e               # doar @e2e
npm run report                 # raport HTML
```

## Configurare (variabile de mediu, secretele NU se comit)
- `ENV` — mediul (qa | qa-local | demo).
- `AGENT_API_KEY` — cheia agentului (pentru endpoint-urile de ingestie).
- `OPERATOR_USER`, `OPERATOR_PASS`, `OPERATOR_TOTP_SECRET` — contul de test al operatorului (2FA).
- `MONGODB_URI`, `CLICKHOUSE_URL` — opțional, pentru verificări în baze.

> Selectorii din page-objects sunt orientativi (marcați `// TODO`) — ajustează-i la DOM-ul real al consolei.

## Rulare
```bash
npm install
npx playwright install        # browsere (doar pentru testele @web/@e2e)
npm run bddgen                # generează spec-urile Playwright din .feature
npm test                      # bddgen + playwright test
```

## Versiuni
Folosește versiuni **moderne**, aliniate (testat pe Node 25): `playwright`/`@playwright/test` `^1.61`
și `playwright-bdd` `^9.1`. În playwright-bdd 9.x, `test` se extinde din `'playwright-bdd'`
(vezi `src/steps/bdd.ts`), nu din `'@playwright/test'`.
Erori posibile dacă versiunile nu se potrivesc: `Cannot find module .../playwright/lib/common/configLoader.js`
(playwright-bdd prea vechi pentru Playwright-ul instalat) sau `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX`
(Playwright prea vechi pentru Node-ul instalat) — în ambele cazuri,
`npm install -D @playwright/test@latest playwright@latest playwright-bdd@latest`.

## Acoperire teste
57 fișiere `.feature` · 141 de scenarii · pozitive (`requestResponse/`) + negative (`errorHandling/`)
pentru fiecare endpoint al backendului, plus `@web` (consolă) și `@e2e` (flux complet).

Pașii sunt scriși în modelul „world": o singură fixtură `world: UnifiedWorld` (`world.api` cu clienți + context per domeniu + `state` + `log`), pattern-uri regex cu alias opțional, `normalizeAlias`, body-uri tipate zod, date cu `faker` și override de headere pentru cazurile negative.
