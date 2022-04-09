import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  const apiConfig = {
    prefix: 'api/v1',
    port: process.env.PORT || 4040,
  };

  app.setGlobalPrefix(apiConfig.prefix);
  app.enableCors();

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'classroom',
        brokers: ['localhost:29092'],
      },
    },
  });

  app.startAllMicroservices().then(() => {
    logger.log(`Microservices ready`);
  });

  await app.listen(apiConfig.port, () => {
    logger.log(`Application is running on port ${apiConfig.port}`);
  });
}

bootstrap();
