const stamp = () => new Date().toISOString();
export const logger = {
  info: (msg: string, ...a: unknown[]) => console.log(`[${stamp()}] INFO  ${msg}`, ...a),
  warn: (msg: string, ...a: unknown[]) => console.warn(`[${stamp()}] WARN  ${msg}`, ...a),
  error: (msg: string, ...a: unknown[]) => console.error(`[${stamp()}] ERROR ${msg}`, ...a),
};
