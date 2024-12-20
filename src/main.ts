import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('/api');
  const configSwagger = new DocumentBuilder()
    .setTitle('Api Rest Ecommerce ')
    .setDescription('Api rest ecommerce`s manage.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('docs', app, document);
  app.enableCors({
    origin: '*',
  });
  await app.listen(3000);
}
bootstrap();
