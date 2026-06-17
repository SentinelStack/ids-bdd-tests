import { Page, expect } from '@playwright/test';
export class DashboardPage {
  constructor(private readonly page: Page) {}
  async expectLoaded(): Promise<void> {
    await expect(this.page.getByText(/AEGIS IDS/i).first()).toBeVisible();
  }
  liveAlerts() { return this.page.getByTestId('live-alerts'); }
}
