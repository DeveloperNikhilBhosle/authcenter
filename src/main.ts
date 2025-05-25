import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { readFileSync } from 'fs';
import { UserauthModule } from './auth/userauth/userauth.module';
import { StaticPagesModule } from './static-pages/static-pages/static-pages.module';


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
    include: [UserauthModule, StaticPagesModule],
  });
  // SwaggerModule.setup('api', app, document); // Swagger UI served at /api

  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'AuthCenter API Docs',
    customCss: `
      /* Set topbar background to black */
      .swagger-ui .topbar {
        background-color: black;
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
  background-image: url('https://images.yourstory.com/cs/images/companies/Finance1-1656490229148.jpg');
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
        background-image: url('https://images.yourstory.com/cs/images/companies/Finance1-1656490229148.jpg?fm=auto&ar=1%3A1&mode=fill&fill=solid&fill-color=fff&format=auto&w=384&q=75');
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
