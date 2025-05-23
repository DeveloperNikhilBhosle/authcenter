import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { join } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getPage(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', '..', 'public', 'website.html'));
    // res.send(`
    //   <html>
    //     <head><title>My Page</title></head>
    //     <body>
    //       <h1>Hello from NestJS</h1>
    //       <p>This is a custom HTML page.</p>
    //     </body>
    //   </html>
    // `);
  }
}
