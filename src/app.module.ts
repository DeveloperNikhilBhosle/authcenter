import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthCenterDBModule } from './dbmodels/authcenter/authcenter.drizzle.module';
import { UserauthModule } from './auth/userauth/userauth.module';
import { StaticPagesModule } from './static-pages/static-pages/static-pages.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CryptoService } from './auth/crypto_service';
import { UsersModule } from './admin/users/users.module';
import { MastersModule } from './admin/masters/masters.module';
import { ProductsModule } from './admin/products/products.module';


@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      exclude: ['/api*'],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    AuthCenterDBModule.forRootAsync({
      useFactory: () => ({
        // url: process.env.AUTH_CENTER_DATABASE_URL,
        url: process.env.AUTH_CENTER_DATABASE_URL ?? ""
      }),
    }),
    UserauthModule,
    StaticPagesModule,
    UsersModule,
    MastersModule,
    ProductsModule,

  ],
  controllers: [AppController],
  providers: [AppService, CryptoService],
})
export class AppModule { }
