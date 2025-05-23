import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';


async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule); // ✅ Use the correct type

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.enableCors({
    origin: '*', // Allow all origins (you can specify an array of allowed origins instead)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
    allowedHeaders: 'Content-Type, Authorization', // Allowed headers
  });

  console.log(process.env.AUTH_CENTER_DATABASE_URL, 'process.env.AUTH_CENTER_DATABASE_URL Main.TS');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
