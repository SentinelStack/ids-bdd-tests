export interface HttpResponse<T = unknown> {
  status: number;
  ok: boolean;
  headers: Headers;
  body: T;
  raw: string;
}

/** Cerere HTTP subțire peste fetch; parsează JSON când e cazul. */
export async function httpRequest<T = unknown>(url: string, init: RequestInit = {}): Promise<HttpResponse<T>> {
  const res = await fetch(url, init);
  const raw = await res.text();
  let body: unknown = raw;
  if ((res.headers.get('content-type') ?? '').includes('application/json') && raw) {
    try { body = JSON.parse(raw); } catch { /* lăsăm raw */ }
  }
  return { status: res.status, ok: res.ok, headers: res.headers, body: body as T, raw };
}
