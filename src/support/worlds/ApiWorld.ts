import { Env } from '../env';
import { ScenarioContext } from '../context/ScenarioContext';
import { HttpResponse } from '../../clients/http';
import { DevicesClient } from '../../clients/api/DevicesClient';
import { AlertsClient } from '../../clients/api/AlertsClient';
import { AccountClient } from '../../clients/api/AccountClient';
import { RulesClient } from '../../clients/api/RulesClient';
import { TrafficClient } from '../../clients/api/TrafficClient';
import { ForensicsClient } from '../../clients/api/ForensicsClient';
import { ReportsClient } from '../../clients/api/ReportsClient';
import { ConsoleClient } from '../../clients/api/ConsoleClient';

/** Grupează clienții de API și starea de autentificare per scenariu. */
export class ApiWorld {
  readonly devices: DevicesClient;
  readonly alerts: AlertsClient;
  readonly traffic: TrafficClient;
  readonly forensics: ForensicsClient;
  readonly account: AccountClient;
  readonly rules: RulesClient;
  readonly reports: ReportsClient;
  readonly console: ConsoleClient;
  lastResponse?: HttpResponse;

  constructor(readonly env: Env, readonly context: ScenarioContext) {
    const base = env.apiBaseUrl;
    const agent = { 'x-api-key': env.agentApiKey };
    this.devices = new DevicesClient(base, agent);
    this.alerts = new AlertsClient(base, agent);
    this.traffic = new TrafficClient(base, agent);
    this.forensics = new ForensicsClient(base, agent);
    this.account = new AccountClient(base);
    this.rules = new RulesClient(base);
    this.reports = new ReportsClient(base);
    this.console = new ConsoleClient(base);
  }

  /** Atașează jetonul de operator pe clienții care cer autentificare de operator. */
  authenticateOperator(token: string): void {
    this.context.set('operatorToken', token);
    const h = { authorization: `Bearer ${token}` };
    [this.account, this.alerts, this.rules, this.reports, this.console].forEach((c) => c.setAuth(h));
  }
}
