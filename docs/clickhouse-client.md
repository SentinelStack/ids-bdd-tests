# ClickHouse client

`src/clients/database/ClickHouseDbClient.ts` opens an HTTP connection to ClickHouse
(the analytical store) so integration/e2e tests can assert that alerts land in the
`sentinel.alerts` table through the Kafka → materialized view → MergeTree chain.
