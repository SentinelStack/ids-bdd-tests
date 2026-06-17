import { Page } from '@playwright/test';
export class ReportsPage {
  constructor(private readonly page: Page) {}
  async open(): Promise<void> { await this.page.getByRole('link', { name: /export|rapoarte|reports/i }).click(); }
  async preview(): Promise<void> { await this.page.getByRole('button', { name: /previzualiz/i }).click(); }
}
