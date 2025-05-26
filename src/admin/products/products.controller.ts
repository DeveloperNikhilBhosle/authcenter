import { Body, Controller, Post, HttpCode } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AddProduct, AddRoleToProduct } from './product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post('add')
  @HttpCode(200)
  async AddProduct(@Body() ip: AddProduct) {
    return await this.productsService.AddProduct(ip);
  }

  @Post('mapping/role')
  @HttpCode(200)
  async AddRoleToProduct(@Body() ip: AddRoleToProduct) {
    return await this.productsService.AddRoleToProduct(ip);
  }
}
