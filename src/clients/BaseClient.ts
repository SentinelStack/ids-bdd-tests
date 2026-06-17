import { httpRequest, HttpResponse } from './http';

export type HeaderMap = Record<string, string>;

/** Client de bază: gazdă + anteturi implicite + anteturi de autentificare (setabile la rulare). */
export class BaseClient {
  protected authHeaders: HeaderMap = {};
  constructor(protected readonly baseUrl: string, protected readonly defaultHeaders: HeaderMap = {}) {}

  /** Atașează un antet de autentificare (de ex. Bearer de operator). */
  setAuth(headers: HeaderMap): this { this.authHeaders = headers; return this; }

  protected headers(extra: HeaderMap = {}): HeaderMap {
    return { 'content-type': 'application/json', ...this.defaultHeaders, ...this.authHeaders, ...extra };
  }
  protected url(path: string): string { return `${this.baseUrl}${path}`; }

  get<T = unknown>(path: string, headers: HeaderMap = {}): Promise<HttpResponse<T>> {
    return httpRequest<T>(this.url(path), { method: 'GET', headers: this.headers(headers) });
  }
  post<T = unknown>(path: string, body?: unknown, headers: HeaderMap = {}): Promise<HttpResponse<T>> {
    return httpRequest<T>(this.url(path), {
      method: 'POST', headers: this.headers(headers), body: body === undefined ? undefined : JSON.stringify(body),
    });
  }
  put<T = unknown>(path: string, body?: unknown, headers: HeaderMap = {}): Promise<HttpResponse<T>> {
    return httpRequest<T>(this.url(path), {
      method: 'PUT', headers: this.headers(headers), body: body === undefined ? undefined : JSON.stringify(body),
    });
  }
}
