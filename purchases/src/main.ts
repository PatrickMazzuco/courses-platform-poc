import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  const apiConfig = {
    prefix: 'api/v1',
    port: process.env.PORT || 3030,
  };

  app.setGlobalPrefix(apiConfig.prefix);
  app.enableCors();

  await app.listen(apiConfig.port, () => {
    logger.log(`Application is running on port ${apiConfig.port}`);
  });
}
bootstrap();
