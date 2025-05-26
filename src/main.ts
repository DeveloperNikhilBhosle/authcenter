import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { readFileSync } from 'fs';
import { UserauthModule } from './auth/userauth/userauth.module';
import { StaticPagesModule } from './static-pages/static-pages/static-pages.module';
import { UsersModule } from './admin/users/users.module';
import { MastersModule } from './admin/masters/masters.module';
import { ProductsModule } from './admin/products/products.module';


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

  //#region SWAGGER AuthCenter

  const config = new DocumentBuilder()
    .setTitle('AuthCenter')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    include: [UserauthModule, StaticPagesModule],
  });
  // SwaggerModule.setup('api', app, document); // Swagger UI served at /api

  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'AuthCenter API Docs',
    customCss: `
      /* Set topbar background to black */
      .swagger-ui .topbar {
        background-color: #144b6e;
        padding: 10px;
        display: flex;
        align-items: center;
      }

      .topbar{
          margin-bottom: 23px;
      }

      .info{
      display: none;
      }

      .swagger-ui svg:not(:root) {
    overflow: hidden;
    display: none;
}
  
      /* Remove the default Swagger logo image */
      .swagger-ui .topbar .topbar-wrapper .link img {
        display: none !important;
      }

      //  .topbar-wrapper {
      //   display: none !important;
      // }

      #logo_small_svg__SW_TM-logo-on-dark {
  display: none;
  height: 0 !important;
}
  
      /* Remove the default Swagger text */
      .swagger-ui .topbar .topbar-wrapper .link span {
        display: none !important;
      }

     .swagger-ui .topbar .topbar-wrapper .link {
  content: "";
  display: inline-block;
  background-image: url('./AuthCenter_Logo.png');
  background-size: contain;
  background-repeat: no-repeat;
  width: 40px;
  height: 40px;
  margin-right: 10px;
  vertical-align: middle;
}

  

      /* Add your custom logo and name in the topbar */
      .swagger-ui .topbar .topbar-wrapper .link::before {
        content: "";
        display: inline-block;
        background-image: url('./AuthCenter_Logo.png');
        background-size: contain;
        background-repeat: no-repeat;
        width: 40px;
        height: 40px;
        margin-right: 10px;
        vertical-align: middle;
      }
  
      /* Add your brand name next to the logo */
      .swagger-ui .topbar .topbar-wrapper .link::after {
        content: "AuthCenter";
        href: "/#"
        color: white;
        font-weight: bold;
        font-size: 22px;
        vertical-align: middle;
      }

      .swagger-ui a.nostyle {
    color: #144b6e;
    font-family: sans-serif;
}
    `,
  });


  //#endregion

  //#region SWAGGER Admin

  const adminConfig = new DocumentBuilder()
    .setTitle('AuthCenter')
    .build();

  const adminDocument = SwaggerModule.createDocument(app, adminConfig, {
    include: [UsersModule, MastersModule, ProductsModule],
  });
  // SwaggerModule.setup('api', app, document); // Swagger UI served at /api

  SwaggerModule.setup('admin', app, adminDocument, {
    customSiteTitle: 'AuthCenter API Docs',
    customCss: `
      /* Set topbar background to black */
      .swagger-ui .topbar {
        background-color: #144b6e;
        padding: 10px;
        display: flex;
        align-items: center;
      }

      .topbar{
          margin-bottom: 23px;
      }

      .info{
      display: none;
      }

      .swagger-ui svg:not(:root) {
    overflow: hidden;
    display: none;
}
  
      /* Remove the default Swagger logo image */
      .swagger-ui .topbar .topbar-wrapper .link img {
        display: none !important;
      }

      //  .topbar-wrapper {
      //   display: none !important;
      // }

      #logo_small_svg__SW_TM-logo-on-dark {
  display: none;
  height: 0 !important;
}
  
      /* Remove the default Swagger text */
      .swagger-ui .topbar .topbar-wrapper .link span {
        display: none !important;
      }

     .swagger-ui .topbar .topbar-wrapper .link {
  content: "";
  display: inline-block;
  background-image: url('./AuthCenter_Logo.png');
  background-size: contain;
  background-repeat: no-repeat;
  width: 40px;
  height: 40px;
  margin-right: 10px;
  vertical-align: middle;
}

  

      /* Add your custom logo and name in the topbar */
      .swagger-ui .topbar .topbar-wrapper .link::before {
        content: "";
        display: inline-block;
        background-image: url('./AuthCenter_Logo.png');
        background-size: contain;
        background-repeat: no-repeat;
        width: 40px;
        height: 40px;
        margin-right: 10px;
        vertical-align: middle;
      }
  
      /* Add your brand name next to the logo */
      .swagger-ui .topbar .topbar-wrapper .link::after {
        content: "AuthCenter";
        href: "/#"
        color: white;
        font-weight: bold;
        font-size: 22px;
        vertical-align: middle;
      }
    `,
  });


  //#endregion

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
