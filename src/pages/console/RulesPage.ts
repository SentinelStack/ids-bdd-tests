import { Page } from '@playwright/test';
export class RulesPage {
  constructor(private readonly page: Page) {}
  async open(): Promise<void> { await this.page.getByRole('link', { name: /reguli|rules/i }).click(); }
  async toggleFirst(): Promise<void> { await this.page.getByRole('switch').first().click(); }
}
