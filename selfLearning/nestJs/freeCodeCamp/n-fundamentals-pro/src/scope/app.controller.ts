// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { App1Service } from './app1.services';
import { App2Service } from './app2.services';

interface ScopeTestResult {
  ids: string[];
  same: boolean;
  note: string;
}

@Controller()
export class AppController {
  constructor(
    private readonly app1Service: App1Service,
    private readonly app2Service: App2Service,
  ) {}

  @Get('/singleton')
  getOperationIdsSingleton(): ScopeTestResult {
    const id1 = this.app1Service.getOperationIdBySingletonScopeService();
    const id2 = this.app2Service.getOperationIdBySingletonService();
    return {
      ids: [id1, id2],
      same: id1 === id2,
      note: 'Should be same within and across requests'
    };
  }

  @Get('/request')
  getOperationIdsRequest(): ScopeTestResult {
    const id1 = this.app1Service.getOperationIdByRequestScopeService();
    const id2 = this.app2Service.getOperationIdByRequestService();
    return {
      ids: [id1, id2],
      same: id1 === id2,
      note: 'Should be same within request but different across requests'
    };
  }

  @Get('/transient')
  getOperationIdsTransient(): ScopeTestResult {
    const id1 = this.app1Service.getOperationIdByTransientScopeService();
    const id2 = this.app2Service.getOperationIdByTransientService();
    return {
      ids: [id1, id2],
      same: id1 === id2,
      note: 'Should be different within and across requests'
    };
  }
}