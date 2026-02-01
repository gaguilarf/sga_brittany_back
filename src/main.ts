import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable cookie parser
  app.use(cookieParser());

  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'https://sga.brittanygroup.edu.pe',
      'http://sga.brittanygroup.edu.pe',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Brittany Group - Sistema de Gestión Académica')
    .setDescription(
      'API REST para el Sistema de Gestión Académica (SGA) de Brittany Group. ' +
        'Incluye gestión de leads, autenticación, usuarios, alumnos, matrículas, pagos, y más.',
    )
    .setVersion('2.0')
    .addTag('Authentication', 'Endpoints de autenticación y autorización')
    .addTag('Leads', 'Endpoints para la gestión de leads')
    .addBearerAuth()
    .addCookieAuth('access_token')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.getHttpAdapter().get('/api/docs-json', (req, res) => {
    res.json(document);
  });

  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Brittany Group API',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  console.log(`\n🚀 Servidor corriendo en: http://localhost:${port}`);
  console.log(`📚 Documentación Swagger: http://localhost:${port}/api/docs\n`);
}
bootstrap();
