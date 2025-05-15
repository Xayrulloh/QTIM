import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from '../../database/entities/article.entity';
import { AuthModule } from '../auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ArticlesController } from './article.controller';
import { ArticlesService } from './article.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article]),
    AuthModule,
    CacheModule.register(),
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
