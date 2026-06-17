
export interface BaseDatabaseClient {
  connect(): Promise<void>;
  close(): Promise<void>;
}
