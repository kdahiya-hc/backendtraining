// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { App1Service } from './app1.services';
import { App2Service } from './app2.services';
import { RequestService } from './request.service';
import { SingletonService } from './singleton.service';
import { TransientService } from './transient.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    App1Service,
    App2Service,
    RequestService,
    SingletonService,
    TransientService,
  ],
})
export class AppModule1 {}