export interface HttpResponse<T = unknown> {
  status: number;
  statusCode: number;
  ok: boolean;
  headers: Headers;
  body: T;
  raw: string;
}

export async function httpRequest<T = unknown>(url: string, init: RequestInit = {}): Promise<HttpResponse<T>> {
  const res = await fetch(url, init);
  const raw = await res.text();
  let body: unknown = raw;
  if ((res.headers.get('content-type') ?? '').includes('application/json') && raw) {
    try { body = JSON.parse(raw); } catch {  }
  }
  return { status: res.status, statusCode: res.status, ok: res.ok, headers: res.headers, body: body as T, raw };
}
