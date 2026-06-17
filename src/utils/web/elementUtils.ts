import { Page } from '@playwright/test';

export async function waitForToast(page: Page, text: string): Promise<void> {
  await page.getByText(text).first().waitFor({ state: 'visible' });
}
