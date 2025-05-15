import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { User } from './entities/user.entity';

@Injectable()
export class TypeormConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get('config.database.host'),
      port: this.configService.get('config.database.port'),
      username: this.configService.get('config.database.username'),
      password: this.configService.get('config.database.password'),
      database: this.configService.get('config.database.database'),
      logging: true,
      entities: [Article, User],
    } as TypeOrmModuleOptions;
  }
}
