import { MongoClient, Db } from 'mongodb';
import { BaseDatabaseClient } from 'src/clients/database/BaseDatabaseClient';

/** Acces la baza operațională (ids_platform) pentru pregătire/verificare de date de test. */
export class MongoDbClient implements BaseDatabaseClient {
  private client?: MongoClient;
  private db?: Db;
  constructor(private readonly uri: string, private readonly database: string) {}
  async connect() { this.client = new MongoClient(this.uri); await this.client.connect(); this.db = this.client.db(this.database); }
  async close() { await this.client?.close(); }
  collection<T extends Document = Document>(name: string) {
    if (!this.db) throw new Error('MongoDbClient neconectat');
    return this.db.collection(name);
  }
}
