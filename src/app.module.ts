import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { RedisModule } from './redis/redis.module';
import { SwaggerModuleConfig } from './swagger/swagger.module';
import { AuthModule } from './modules/auth/auth.module';
import { ArticlesModule } from './modules/article/article.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormConfig } from './database/database.config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeormConfig,
    }),
    RedisModule,
    AuthModule,
    ArticlesModule,
    SwaggerModuleConfig,
  ],
})
export class AppModule {}
