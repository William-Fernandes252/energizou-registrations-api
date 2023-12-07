import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { DEFAULT_SECURITY_SCHEME } from './config/auth.config';
import { AppModule } from './app.module';
import type { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { useContainer } from 'class-validator';
import formatValidationErrors from './common/errors/format';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
    {
      cors: { origin: process.env.CORS_ALLOWED_ORIGINS.split(',') },
    },
  );

  const config = new DocumentBuilder()
    .setTitle('Energizou Registrations API')
    .setDescription('API para gerenciamento dos clientes da Energizou.')
    .setVersion('1.0')
    .addTag('energizou-registrations')
    .addBearerAuth(
      DEFAULT_SECURITY_SCHEME as SecuritySchemeObject,
      DEFAULT_SECURITY_SCHEME.apiName,
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      disableErrorMessages: false,
      exceptionFactory: errors => {
        const message = formatValidationErrors(errors);
        return new BadRequestException({
          message,
          error: 'Bad Request',
          statusCode: 400,
        });
      },
    }),
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen('8000', '0.0.0.0');
}
bootstrap();
