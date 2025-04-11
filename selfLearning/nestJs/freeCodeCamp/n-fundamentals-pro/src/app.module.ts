import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongModule } from './song/song.module';
import { AppModule1 } from './scope/app.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './song/entity/song.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'kishandahiya', // Replace with your actual username
      password: 'june1506', // Replace with your actual password
      database: 'n-test',
      entities: [Song], // Add all your entities here
      synchronize: true, // Only for development!
      logging: true, // Enable SQL query logging
    }),
    SongModule, AppModule1
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    // consumer.apply(LoggerMiddleware).forRoutes({ path: 'songs', method: RequestMethod.PATCH });
  }
}
