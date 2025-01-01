import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AppDataSource } from 'data-source';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await AppDataSource.initialize();
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
