import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableVersioning({
    type: VersioningType.URI,
  });
  
  const config = new DocumentBuilder()
    .setTitle('Ste CRUD API')
    .setDescription('API para gerenciamento de pessoas - Ste')
    .setVersion('1.0')
    .addTag('people', 'Operações relacionadas a pessoas')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  await app.listen(process.env.PORT ?? 4001);
}
bootstrap();
