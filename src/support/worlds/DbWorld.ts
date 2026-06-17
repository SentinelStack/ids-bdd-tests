import { Env } from '@support/env';
import { MongoDbClient } from 'src/clients/database/MongoDbClient';
import { ClickHouseDbClient } from 'src/clients/database/ClickHouseDbClient';

/** Acces la baze pentru pregătirea/verificarea datelor (folosit în integrare/e2e). */
export class DbWorld {
  readonly mongo: MongoDbClient;
  readonly clickhouse: ClickHouseDbClient;
  constructor(readonly env: Env) {
    this.mongo = new MongoDbClient(env.mongo.uri, env.mongo.database);
    this.clickhouse = new ClickHouseDbClient(env.clickhouse.url, env.clickhouse.database);
  }
}
