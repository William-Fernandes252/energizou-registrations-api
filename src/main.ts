import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

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
    .setDescription('API para gerenciamento dos clientes da Energizou')
    .setVersion('1.0')
    .addTag('energizou-registrations')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen('8000', '0.0.0.0');
}
bootstrap();
