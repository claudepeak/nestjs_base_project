import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './app/common/filter/http-exception.filter';
import { urlencoded, json } from 'express';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  // Create the application instance using AppModule and initialize it
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app));

  // Apply a global ValidationPipe to validate and transform incoming data
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, //
      whitelist: true,
      forbidNonWhitelisted: true, //Fazla field ya da eksik field olursa hata verir
    }),
  );
  // Enable Cross-Origin Resource Sharing (CORS)
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  // Configure API documentation using Swagger
  const config = new DocumentBuilder()
    .setTitle('Nest Base project')
    .setDescription(`Base Project Description \n\n ${process.env.JWT_CODE}`)
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  // Generate the documentation and connect Swagger to the configured route in the app
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;

  // Start listening for incoming requests on the specified port
  await app.listen(port);

  // Log the URL where the server is running
  Logger.log(`Server started running on: ${await app.getUrl()}`, 'Bootstrap');
}

// Call the bootstrap function to start the application
bootstrap();
