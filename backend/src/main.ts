import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './Filter/all-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CustomResponseInterceptor } from './common/custom-response.Interceptor';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import * as multer from 'multer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Tourism Website ')
    .setDescription('API for accessing the tourism website')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document);

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new AllExceptionsFilter());

   app.use(multer({ dest: join(__dirname, '..', 'uploads') }).single('file'));

  app.useGlobalInterceptors(new CustomResponseInterceptor());
  
  app.enableCors({
    origin: 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, 
  });

  app.use(cookieParser());
  
  await app.listen(5001);
}
bootstrap();

