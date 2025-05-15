import { registerAs } from '@nestjs/config';
import { IConfig } from './config.interface';

export default registerAs(
  'config',
  (): IConfig => ({
    port: parseInt(process.env.PORT || '3000', 10),
    database: {
      host: process.env.DB_HOST!,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME!,
      password: process.env.DB_PASSWORD!,
      database: process.env.DB_NAME!,
    },
    redis: {
      host: process.env.REDIS_HOST!,
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      ttl: parseInt(process.env.REDIS_TTL || '60', 10),
    },
    jwt: {
      secret: process.env.JWT_SECRET!,
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    },
    swagger: {
      title: process.env.SWAGGER_TITLE || 'NestJS API',
      description: process.env.SWAGGER_DESCRIPTION || 'API description',
      version: process.env.SWAGGER_VERSION || '1.0',
    },
  }),
);
