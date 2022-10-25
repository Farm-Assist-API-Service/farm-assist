import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { Logger, ValidationPipe, HttpStatus } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { E_API_ERR } from './core/schemas';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.setGlobalPrefix(`api/v${configService.get('API_VERSION')}`);

  const port = configService.get('SERVER_PORT') || 3000;
  const nodeEnv = configService.get('NODE_ENV');

  // -- Helmet
  app.use(helmet());

  // -- Cors setup
  app.enableCors({
    origin: false, // Specify the allowed origins.  I'm setting false to allow requests from any origin
  });

  // -- Rate limiting: Limits the number of requests from the same IP in a period of time.
  app.use(
    rateLimit({
      windowMs: 5 * 60 * 1000, // 10 minutes
      max: 100, // Limit each IP to 100 requests per `window` (here, per 10 minutes)
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers,
      skipSuccessfulRequests: false, // The counting will skip all successful requests and just count the errors. Instead of removing rate-limiting, it's better to set this to true to limit the number of times a request fails. Can help prevent against brute-force attacks
      message: {
        message: `${E_API_ERR.manyRequest} Try again in 5 minutes.`,
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
      },
    }),
  );

  // -- Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(port, async () => {
    const url = await app.getUrl();
    Logger.log(`${configService.get('APP_NAME')} server running on ${url}`);
    Logger.log(`Environment: *** ${nodeEnv} mode ***`);
  });
}
bootstrap();
