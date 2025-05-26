import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CryptoService } from 'src/auth/crypto_service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, CryptoService],
})
export class UsersModule { }
