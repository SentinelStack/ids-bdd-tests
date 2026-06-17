# Cum se scrie un test

1. Adaugă un fișier `.feature` în `tests/<zonă>/...` (Gherkin: Given/When/Then), cu tag-uri (`@api`, `@web`, `@e2e`, `@devices`...).
2. Implementează pașii în `src/steps/...` folosind `Given/When/Then` din `src/steps/bdd.ts`.
3. Pașii folosesc „world"-urile (`api`, `web`, `context`) ca să apeleze clienții API / page-objects.
4. Rulează: `npm test` (toate), `npm run test:api`, `npm run test:web`, `npm run test:e2e`.

Structura urmează exemplul: `clients/` (API + DB), `pages/` (page-objects consolă), `steps/`, `support/worlds`, `data/generators`, `validators/`, `schemas/zod`.
