import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { readFileSync } from 'fs';
import { UserauthModule } from './auth/userauth/userauth.module';


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

  //#region SWAGGER 

  const config = new DocumentBuilder()
    .setTitle('AuthCenter')
    // .setDescription('API description')
    // .setVersion('1.0')
    // .addTag('example') // Optional: Group your endpoints by tags
    // .
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    include: [UserauthModule],
  });
  SwaggerModule.setup('api', app, document); // Swagger UI served at /api

  // SwaggerModule.setup('/swagger-json', app, document); // serve JSON separately

  // Serve static assets (e.g., logo) if needed
  // app.use('/assets', express.static(join(__dirname, '..', 'assets')));

  // Serve custom HTML
  // app.use('/api', (req, res) => {
  //   const html = readFileSync(join(__dirname, 'public', 'swagger-custom.html'), 'utf8');
  //   res.send(html);
  // });

  //#endregion

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
