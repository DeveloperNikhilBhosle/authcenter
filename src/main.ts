import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Allow all origins (you can specify an array of allowed origins instead)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
    allowedHeaders: 'Content-Type, Authorization', // Allowed headers
  });

  console.log(process.env.AUTH_CENTER_DATABASE_URL, 'process.env.AUTH_CENTER_DATABASE_URL Main.TS');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
