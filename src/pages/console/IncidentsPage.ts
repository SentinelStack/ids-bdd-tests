import { Page } from '@playwright/test';
export class IncidentsPage {
  constructor(private readonly page: Page) {}
  async open(): Promise<void> { await this.page.getByRole('link', { name: /incidente|incidents/i }).click(); }
  rowByAlertId(alertId: string) { return this.page.getByText(alertId); }
  async acknowledgeFirst(): Promise<void> { await this.page.getByRole('button', { name: /confirm/i }).first().click(); }
}
