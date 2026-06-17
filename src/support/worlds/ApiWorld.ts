import { Env } from '@support/env';
import { ScenarioContext } from '@support/context/ScenarioContext';
import { logger, Logger } from '@support/logger';
import { DeviceContext } from '@support/context/DeviceContext';
import { AlertContext } from '@support/context/AlertContext';
import { TrafficContext } from '@support/context/TrafficContext';
import { ForensicsContext } from '@support/context/ForensicsContext';
import { RulesContext } from '@support/context/RulesContext';
import { ReportsContext } from '@support/context/ReportsContext';
import { AccountContext } from '@support/context/AccountContext';
import { ConsoleContext } from '@support/context/ConsoleContext';
import { DevicesClient } from 'src/clients/api/DevicesClient';
import { AlertsClient } from 'src/clients/api/AlertsClient';
import { AccountClient } from 'src/clients/api/AccountClient';
import { RulesClient } from 'src/clients/api/RulesClient';
import { TrafficClient } from 'src/clients/api/TrafficClient';
import { ForensicsClient } from 'src/clients/api/ForensicsClient';
import { ReportsClient } from 'src/clients/api/ReportsClient';
import { ConsoleClient } from 'src/clients/api/ConsoleClient';

/** Ultimul răspuns API expus pașilor: cod de stare + corp. */
export interface ApiState { statusCode: number; body: unknown }

/** „World"-ul de API: clienți per domeniu, contexte per domeniu, starea curentă și logger. */
export class ApiWorld {
  readonly devicesClient: DevicesClient;
  readonly alertsClient: AlertsClient;
  readonly trafficClient: TrafficClient;
  readonly forensicsClient: ForensicsClient;
  readonly accountClient: AccountClient;
  readonly rulesClient: RulesClient;
  readonly reportsClient: ReportsClient;
  readonly consoleClient: ConsoleClient;

  // Contexte per domeniu (înlănțuiesc răspunsuri între pași, pe alias).
  readonly deviceCtx = new DeviceContext();
  readonly alertCtx = new AlertContext();
  readonly trafficCtx = new TrafficContext();
  readonly forensicsCtx = new ForensicsContext();
  readonly rulesCtx = new RulesContext();
  readonly reportsCtx = new ReportsContext();
  readonly accountCtx = new AccountContext();
  readonly consoleCtx = new ConsoleContext();

  // Stocare ad-hoc între pași (id-uri, payload-uri intermediare etc.).
  readonly context = new ScenarioContext();

  readonly log: Logger = logger;
  state: ApiState = { statusCode: 0, body: undefined };
  operatorToken?: string;

  constructor(readonly env: Env) {
    const base = env.apiBaseUrl;
    const agent = { 'x-api-key': env.agentApiKey };
    this.devicesClient = new DevicesClient(base, agent);
    this.alertsClient = new AlertsClient(base, agent);
    this.trafficClient = new TrafficClient(base, agent);
    this.forensicsClient = new ForensicsClient(base, agent);
    this.accountClient = new AccountClient(base);
    this.rulesClient = new RulesClient(base);
    this.reportsClient = new ReportsClient(base);
    this.consoleClient = new ConsoleClient(base);
  }

  /** Atașează jetonul de operator pe clienții cu endpoint-uri de operator. */
  authenticateOperator(token: string): void {
    this.operatorToken = token;
    const h = { authorization: `Bearer ${token}` };
    [this.accountClient, this.alertsClient, this.devicesClient, this.trafficClient,
      this.forensicsClient, this.rulesClient, this.reportsClient, this.consoleClient]
      .forEach((c) => c.setAuth(h));
  }
}
