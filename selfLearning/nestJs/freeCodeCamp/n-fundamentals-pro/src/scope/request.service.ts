// src/request.service.ts
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class RequestService {
  private readonly operationId: string;

  constructor() {
    this.operationId = Math.random().toString(36).substring(2, 8);
    console.log(`RequestService created with ID: ${this.operationId}`);
  }

  getOperationId(): string {
    return this.operationId;
  }
}