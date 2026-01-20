import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import { validationPipe } from './config/validation.config';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Documentação Swagger
  setupSwagger(app);

  // Habilita o uso de cookies
  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:5173', // frontend
    credentials: true,
  });

  // Validacao global
  app.useGlobalPipes(validationPipe);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
