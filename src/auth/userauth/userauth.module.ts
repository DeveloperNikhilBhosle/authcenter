import { Module } from '@nestjs/common';
import { UserauthService } from './userauth.service';
import { UserauthController } from './userauth.controller';
import { HttpModule, HttpService } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';


@Module({
  // imports: [HttpModule],
  imports: [
    HttpModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret', // use env in prod
      signOptions: { expiresIn: '1d' },
    }),
  ],

  controllers: [UserauthController],
  providers: [UserauthService],
})
export class UserauthModule { }
