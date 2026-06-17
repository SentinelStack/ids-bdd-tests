import { Page, expect } from '@playwright/test';
export class DashboardPage {
  constructor(private readonly page: Page) {}
  async expectLoaded(): Promise<void> {
    await expect(this.page.getByText(/AEGIS IDS/i).first()).toBeVisible(); // TODO: selector real
  }
  liveAlerts() { return this.page.getByTestId('live-alerts'); } // TODO: data-testid real
}
