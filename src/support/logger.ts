export type LogObject = Record<string, unknown>;

export interface Logger {
  info(obj: LogObject | string, msg?: string): void;
  warn(obj: LogObject | string, msg?: string): void;
  error(obj: LogObject | string, msg?: string): void;
}

function emit(level: string, a: LogObject | string, msg?: string): void {
  if (process.env.BDD_LOG === 'silent') return;
  if (typeof a === 'string') console.log(`[${level}] ${a}`);
  else console.log(`[${level}] ${msg ?? ''}`.trim(), JSON.stringify(a));
}

export const logger: Logger = {
  info: (a, m) => emit('INFO', a, m),
  warn: (a, m) => emit('WARN', a, m),
  error: (a, m) => emit('ERROR', a, m),
};
