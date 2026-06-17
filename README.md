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
