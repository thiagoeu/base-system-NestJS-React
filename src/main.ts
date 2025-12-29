import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import { validationPipe } from './config/validation.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Documentação Swagger
  setupSwagger(app);

  // Validacao global
  app.useGlobalPipes(validationPipe);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
