import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongModule } from './song/song.module';
import { AppModule1 } from './scope/app.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';

@Module({
  imports: [SongModule, AppModule1],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    // consumer.apply(LoggerMiddleware).forRoutes({ path: 'songs', method: RequestMethod.PATCH });
  }
}
