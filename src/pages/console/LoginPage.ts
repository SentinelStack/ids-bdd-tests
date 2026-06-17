import { Page } from '@playwright/test';
/** Pagina de autentificare a consolei AEGIS IDS. (Selectorii sunt orientativi — ajustează la DOM-ul real.) */
export class LoginPage {
  constructor(private readonly page: Page, private readonly baseUrl: string) {}
  async goto(): Promise<void> { await this.page.goto(`${this.baseUrl}/login`); }
  async submitCredentials(username: string, password: string): Promise<void> {
    await this.page.getByLabel(/utilizator|user/i).fill(username); // TODO: selector real
    await this.page.getByLabel(/parol|password/i).fill(password);
    await this.page.getByRole('button', { name: /autentific|login|sign in/i }).click();
  }
  async submitTotp(code: string): Promise<void> {
    await this.page.getByLabel(/cod|code/i).fill(code); // TODO: selector real
    await this.page.getByRole('button', { name: /verific|confirm|trimite/i }).click();
  }
  mfaPrompt() { return this.page.getByText(/al doilea factor|cod de autentificare/i); } // TODO
}
