import { Page } from '@playwright/test';
import { Env } from '@support/env';
import { LoginPage } from 'src/pages/console/LoginPage';
import { DashboardPage } from 'src/pages/console/DashboardPage';
import { IncidentsPage } from 'src/pages/console/IncidentsPage';
import { RulesPage } from 'src/pages/console/RulesPage';
import { ReportsPage } from 'src/pages/console/ReportsPage';
import { SideBar } from 'src/pages/console/components/SideBar';

/** „World"-ul web: page-objects ale consolei AEGIS IDS. */
export class WebWorld {
  readonly login: LoginPage;
  readonly dashboard: DashboardPage;
  readonly incidents: IncidentsPage;
  readonly rules: RulesPage;
  readonly reports: ReportsPage;
  readonly sideBar: SideBar;

  constructor(readonly page: Page, readonly env: Env) {
    this.login = new LoginPage(page, env.webBaseUrl);
    this.dashboard = new DashboardPage(page);
    this.incidents = new IncidentsPage(page);
    this.rules = new RulesPage(page);
    this.reports = new ReportsPage(page);
    this.sideBar = new SideBar(page);
  }
}
