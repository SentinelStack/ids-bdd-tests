
export function normalizeAlias(token: string | undefined, fallback: string, prefix: string): string {
  const t = (token ?? '').trim();
  if (!t) return fallback;
  return t.startsWith(prefix) ? t : `${prefix}${t}`;
}
