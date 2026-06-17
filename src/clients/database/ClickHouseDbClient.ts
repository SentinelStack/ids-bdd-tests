import { BaseDatabaseClient } from './BaseDatabaseClient';
import { httpRequest } from '../http';

/** Interogări de verificare pe magazinul analitic (ClickHouse), prin interfața HTTP. */
export class ClickHouseDbClient implements BaseDatabaseClient {
  constructor(private readonly url: string, private readonly database: string) {}
  async connect() { /* HTTP fără sesiune persistentă */ }
  async close() { /* nimic */ }
  async query<T = unknown>(sql: string): Promise<T[]> {
    const res = await httpRequest<string>(`${this.url}/?database=${this.database}&default_format=JSONEachRow`, {
      method: 'POST', body: sql,
    });
    return res.raw.trim().split('\n').filter(Boolean).map((l) => JSON.parse(l)) as T[];
  }
}
