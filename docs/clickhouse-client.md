# Client ClickHouse

`src/clients/database/ClickHouseDbClient.ts` deschide o conexiune HTTP către ClickHouse
(magazinul analitic) pentru a verifica, în testele de integrare/e2e, că alertele ajung în
tabelul `sentinel.alerts` prin lanțul Kafka → vedere materializată → MergeTree.
