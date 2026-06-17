import { Page } from '@playwright/test';
import { Env } from '@support/env';
import { ApiWorld } from '@support/worlds/ApiWorld';
import { WebWorld } from '@support/worlds/WebWorld';
import { DbWorld } from '@support/worlds/DbWorld';

/** World-ul unic injectat în fiecare pas: agregă API, web și baza de date. */
export class UnifiedWorld {
  readonly api: ApiWorld;
  readonly web: WebWorld;
  readonly db: DbWorld;

  constructor(readonly env: Env, page: Page) {
    this.api = new ApiWorld(env);
    this.web = new WebWorld(page, env);
    this.db = new DbWorld(env);
  }
}
