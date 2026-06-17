import { Env } from '../env';
import { MongoDbClient } from '../../clients/database/MongoDbClient';
import { ClickHouseDbClient } from '../../clients/database/ClickHouseDbClient';

/** Acces la baze pentru pregătirea/verificarea datelor (folosit în integrare/e2e). */
export class DbWorld {
  readonly mongo: MongoDbClient;
  readonly clickhouse: ClickHouseDbClient;
  constructor(readonly env: Env) {
    this.mongo = new MongoDbClient(env.mongo.uri, env.mongo.database);
    this.clickhouse = new ClickHouseDbClient(env.clickhouse.url, env.clickhouse.database);
  }
}
