import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './swagger.config';
import { INestApplication } from '@nestjs/common/interfaces';

@Module({})
export class SwaggerModuleConfig {
  static setup(app: INestApplication) {
    const configService = app.get(ConfigService);
    const { swaggerConfig: config, swaggerCustomOptions: customOptions } =
      swaggerConfig(configService);

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, customOptions);
  }
}
