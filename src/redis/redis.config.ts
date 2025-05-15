import { IRedisConfig } from './redis.interface';
import { ConfigService } from '@nestjs/config';

export const redisConfig = (configService: ConfigService): IRedisConfig => ({
  host: configService.get<string>('config.redis.host')!,
  port: configService.get<number>('config.redis.port')!,
  ttl: configService.get<number>('config.redis.ttl', 60),
});
