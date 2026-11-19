import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import morgan from 'morgan';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('MAIN');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  // middleware setup
  app.use(morgan('combined'));
  app.enableCors({
    origin: ['https://spike-admin.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Transaction-Pin',
      'Upload-Offset',
      'Upload-Length',
      'Tus-Resumable',
      'Upload-Metadata',
    ],
    credentials: true,
  });
  const config = app.get(ConfigService);
  const port = config.get<number>('PORT', 8000);

  // swagger documentation setup
  const documentBuilder = new DocumentBuilder()
    .setTitle('Spike API')
    .setDescription('Spike API Documentation')
    .setVersion('1.0')
    .build();
  const document = () =>
    SwaggerModule.createDocument(app as any, documentBuilder);
  SwaggerModule.setup('documentation', app as any, document);
  await app.listen(port, () =>
    logger.log(`🚀 Application is running on: ${port}`),
  );
}
bootstrap();
