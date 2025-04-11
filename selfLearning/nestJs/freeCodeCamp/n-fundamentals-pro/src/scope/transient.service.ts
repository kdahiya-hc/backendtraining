// src/transient.service.ts
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class TransientService {
  private readonly operationId: string;

  constructor() {
    this.operationId = Math.random().toString(36).substring(2, 8);
    console.log(`TransientService created with ID: ${this.operationId}`);
  }

  getOperationId(): string {
    return this.operationId;
  }
}