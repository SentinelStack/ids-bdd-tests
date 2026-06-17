import { Page } from '@playwright/test';
import { Env } from '../env';
import { ScenarioContext } from '../context/ScenarioContext';
import { LoginPage } from '../../pages/console/LoginPage';
import { DashboardPage } from '../../pages/console/DashboardPage';
import { IncidentsPage } from '../../pages/console/IncidentsPage';
import { RulesPage } from '../../pages/console/RulesPage';
import { ReportsPage } from '../../pages/console/ReportsPage';
import { SideBar } from '../../pages/console/components/SideBar';

/** Grupează page-objects ale consolei pentru testele web. */
export class WebWorld {
  readonly login: LoginPage;
  readonly dashboard: DashboardPage;
  readonly incidents: IncidentsPage;
  readonly rules: RulesPage;
  readonly reports: ReportsPage;
  readonly sideBar: SideBar;

  constructor(readonly page: Page, readonly env: Env, readonly context: ScenarioContext) {
    this.login = new LoginPage(page, env.webBaseUrl);
    this.dashboard = new DashboardPage(page);
    this.incidents = new IncidentsPage(page);
    this.rules = new RulesPage(page);
    this.reports = new ReportsPage(page);
    this.sideBar = new SideBar(page);
  }
}
