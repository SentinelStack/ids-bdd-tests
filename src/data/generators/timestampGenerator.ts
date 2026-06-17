export const nowIso = (): string => new Date().toISOString();
export const isoSecondsAgo = (s: number): string => new Date(Date.now() - s * 1000).toISOString();
