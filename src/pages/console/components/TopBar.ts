import { Page } from '@playwright/test';
export class TopBar {
  constructor(private readonly page: Page) {}
  async logout(): Promise<void> { await this.page.getByRole('button', { name: /deconect|logout/i }).click(); }
  notifications() { return this.page.getByRole('button', { name: /notific/i }); }
}
