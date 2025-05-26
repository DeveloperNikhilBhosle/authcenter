import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { AddUser, MapUserToProduct } from './users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('add')
  async AddUser(@Body() ip: AddUser) {
    return await this.usersService.AddUser(ip);
  }

  @Post('product/mapping')
  async MapUserToProduct(@Body() ip: MapUserToProduct) {
    return await this.usersService.MapUserProduct(ip);
  }

  @Post('product/unmapping')
  async UnMapUserToProduct(@Body() ip: MapUserToProduct) {
    return await this.usersService.UnMapUserProduct(ip);
  }
}
