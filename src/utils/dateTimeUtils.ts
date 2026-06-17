export const nowIso = (): string => new Date().toISOString();
export const isoMinutesAgo = (m: number): string => new Date(Date.now() - m * 60_000).toISOString();
