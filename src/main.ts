import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import ngrok = require('@ngrok/ngrok');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api/v1/', {
    exclude: ['health', 'auth/signup', 'auth/signin'],
  });

  app.enableCors();
  // app.use(helmet());
  // if (config.env.NODE_ENV === 'development' || config.env.NODE_ENV === 'test') {
  //   app.use(
  //     helmet.contentSecurityPolicy({
  //       directives: {
  //         ...helmet.contentSecurityPolicy.getDefaultDirectives(),
  //         'img-src': ["'self'", 'data:', 'https://cdn.jsdelivr.net/'],
  //         'script-src': [
  //           "'self'",
  //           "'unsafe-inline'",
  //           "'unsafe-eval'",
  //           'https://cdn.jsdelivr.net/',
  //         ],
  //       },
  //     }),
  //   );
  // }

  //  app.useStaticAssets(join(__dirname, '..', 'public'));
  //  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  //  const partialsDir = join(__dirname, '..', 'views/partials');

  //  const filenames = readdirSync(partialsDir);

  //  filenames.forEach(function (filename) {
  //    var matches = /^([^.]+).hbs$/.exec(filename);
  //    if (!matches) {
  //      return;
  //    }
  //    const name = matches[1];
  //    const template = readFileSync(`${partialsDir}/${filename}`, 'utf8');
  //    hbs.registerPartial(name, template);
  //  });

  const PORT = +process.env.PORT || 3000;
  await app.listen(PORT, () => {
    console.log('Server started on port: ' + PORT);
    useNgrok(PORT);
  });
}

export default async function useNgrok(PORT: number) {
  const authtoken = '2iNYAsvLDDEdfou5XtVPx11ViuX_2GN1hMdo3hV4tTeLroKXL';
  const domain = 'kingfish-stirring-amazingly.ngrok-free.app';
  const listener = await ngrok.forward({ addr: PORT, authtoken });
  console.log(`Ingress established at: ${listener.url()}`);
}
bootstrap();
