import { Page } from '@playwright/test';
/** Ajutoare web reutilizabile (de extins după nevoie). */
export async function waitForToast(page: Page, text: string): Promise<void> {
  await page.getByText(text).first().waitFor({ state: 'visible' });
}
