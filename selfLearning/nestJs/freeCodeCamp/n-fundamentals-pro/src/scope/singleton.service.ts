// src/singleton.service.ts
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.DEFAULT }) // DEFAULT is singleton
export class SingletonService {
  private readonly operationId: string;

  constructor() {
    this.operationId = Math.random().toString(36).substring(2, 8);
    console.log(`SingletonService created with ID: ${this.operationId}`);
  }

  getOperationId(): string {
    return this.operationId;
  }
}