import { Body, Controller, Get, Post, Query, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { UserauthService } from './userauth.service';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ApiResponse } from 'Util/APiResponse';
import { AccessToken } from './userauth.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('google')
@ApiTags("Google SSO")
export class UserauthController {
  constructor(private readonly userauthService: UserauthService) { }


  @Get('initiate')
  async googleInitiate(
    @Query('product_id') productId: number,
    @Query('product_auth_code') productAuthId: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const response = await this.userauthService.googleInitiate(productId, productAuthId)
    console.log(response, 'response response');
    return res.redirect(302, response.toString());
    //return ApiResponse.ReturnResponse(200, "Success", { redirect_url: response })
    // return res.redirect(response.toString());
  }

  @Get('callback')
  async googleCallback(@Query() query, @Res() res: Response) {
    console.log("API Called Successfully");
    const { code, state } = query;
    console.log(query, 'query');
    console.log(state, 'state ');
    const b = JSON.parse(decodeURIComponent(state))
    console.log(b.productId, 'decoded productId');
    console.log(b.productAuthId, 'decoded productAuthId');
    // const { } = decodeURIComponent(state);

    const [productId, productAuthCode] = decodeURIComponent(state).split(':');

    console.log(productId, 'ProductId');
    console.log(productAuthCode, 'productAuthCode');


    const response = await this.userauthService.googleCallback(b.productId, b.productAuthId, code);
    console.log(response, 'res res res')

    // console.log(response, 'response');
    // return res.redirect(`${response}`);
    return res.redirect(302, response ?? '');
    return ApiResponse.ReturnResponse(200, "Token Generated Successfully");

  }

  @Post('token')
  async getTokenByRefreshToken(@Body() res: AccessToken) {
    const response = await this.userauthService.refreshAccessToken(res.refresh_token);
    return ApiResponse.ReturnResponse(200, "Token Generated Successfully", response);
  }





}
