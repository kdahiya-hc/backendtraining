// src/app1.service.ts
import { Injectable } from '@nestjs/common';
import { RequestService } from './request.service';
import { SingletonService } from './singleton.service';
import { TransientService } from './transient.service';

@Injectable()
export class App1Service {
  constructor(
    private readonly transientService: TransientService,
    private readonly singletonService: SingletonService,
    private readonly requestService: RequestService,
  ) {}

  getOperationIdByTransientScopeService(): string {
    return this.transientService.getOperationId();
  }

  getOperationIdBySingletonScopeService(): string {
    return this.singletonService.getOperationId();
  }

  getOperationIdByRequestScopeService(): string {
    return this.requestService.getOperationId();
  }
}