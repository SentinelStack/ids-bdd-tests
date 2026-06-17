/** Contract comun pentru clienții de bază de date folosiți la pregătirea/verificarea datelor de test. */
export interface BaseDatabaseClient {
  connect(): Promise<void>;
  close(): Promise<void>;
}
