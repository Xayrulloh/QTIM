import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';
import { IConfig } from '../config/config.interface';
import { ConfigService } from '@nestjs/config';

export const swaggerConfig = (configService: ConfigService) => {
  const config = configService.get<IConfig>('config')!;

  const swaggerConfig = new DocumentBuilder()
    .setTitle(config.swagger.title)
    .setDescription(config.swagger.description)
    .setVersion(config.swagger.version)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'jwt',
        description: 'Enter JWT token',
        in: 'header',
      },
      'jwt',
    )
    .build();

  const swaggerCustomOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
      docExpansion: 'none',
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'method',
    },
    customSiteTitle: config.swagger.title,
  };

  return { swaggerConfig, swaggerCustomOptions };
};
