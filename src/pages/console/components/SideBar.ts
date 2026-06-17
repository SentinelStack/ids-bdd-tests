import { Page } from '@playwright/test';
export class SideBar {
  constructor(private readonly page: Page) {}
  link(name: RegExp) { return this.page.getByRole('link', { name }); }
}
