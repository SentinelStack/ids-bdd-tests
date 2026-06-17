/**
 * Rezolvă un token de alias opțional (ex. "device2") la un alias normalizat.
 * Dacă token-ul lipsește, întoarce alias-ul implicit; dacă e prezent dar fără prefix,
 * îi adaugă prefixul (ex. "2" -> "device2").
 */
export function normalizeAlias(token: string | undefined, fallback: string, prefix: string): string {
  const t = (token ?? '').trim();
  if (!t) return fallback;
  return t.startsWith(prefix) ? t : `${prefix}${t}`;
}
