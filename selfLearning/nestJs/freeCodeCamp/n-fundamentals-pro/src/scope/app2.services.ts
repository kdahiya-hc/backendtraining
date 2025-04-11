// src/app2.service.ts
import { Injectable } from '@nestjs/common';
import { RequestService } from './request.service';
import { SingletonService } from './singleton.service';
import { TransientService } from './transient.service';

@Injectable()
export class App2Service {
  constructor(
    private readonly transientService: TransientService,
    private readonly singletonService: SingletonService,
    private readonly requestService: RequestService,
  ) {}

  getOperationIdByTransientService(): string {
    return this.transientService.getOperationId();
  }

  getOperationIdBySingletonService(): string {
    return this.singletonService.getOperationId();
  }

  getOperationIdByRequestService(): string {
    return this.requestService.getOperationId();
  }
}