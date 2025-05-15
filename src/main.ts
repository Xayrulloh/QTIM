import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModuleConfig } from './swagger/swagger.module';
import { IConfig } from './config/config.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const config = configService.get<IConfig>('config')!;

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger setup
  SwaggerModuleConfig.setup(app);

  await app.listen(config.port, () => {
    Logger.log(`Server running on port ${config.port}`);
    Logger.log(`Swagger UI: http://localhost:${config.port}/api`);
  });
}

bootstrap().catch((err) => {
  Logger.error('Error during bootstrap:', err);
  process.exit(1);
});
