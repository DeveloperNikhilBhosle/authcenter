import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthCenterDBModule } from './dbmodels/authcenter/authcenter.drizzle.module';
import { UserauthModule } from './auth/userauth/userauth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    AuthCenterDBModule.forRootAsync({
      useFactory: () => ({
        // url: process.env.AUTH_CENTER_DATABASE_URL,
        url: process.env.AUTH_CENTER_DATABASE_URL ?? ""
      }),
    }),
    UserauthModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
