import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow<string>('MYSQL_HOST'),
        port: parseInt(configService.getOrThrow('MYSQL_PORT'), 10),
        database: configService.getOrThrow<string>('MYSQL_DATABASE'),
        username: configService.getOrThrow<string>('MYSQL_USERNAME'),
        password: configService.getOrThrow<string>('MYSQL_PASSWORD'),
        autoLoadEntities: true,
        synchronize: configService.getOrThrow('MYSQL_SYNC') === 'true',
        logging: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
