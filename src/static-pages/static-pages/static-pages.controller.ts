import { Controller, Get, Res } from '@nestjs/common';
import { StaticPagesService } from './static-pages.service';
import { Response } from 'express';
import { join } from 'path';
@Controller('')
export class StaticPagesController {
  constructor(private readonly staticPagesService: StaticPagesService) { }



  @Get('/unauthorised')
  getWebsite(@Res() res: Response) {
    // Use process.cwd() to get project root (where you run `npm start` from)
    const filePath = join(process.cwd(), 'public', 'unauthorised.html');
    console.log('Trying to send file:', filePath);

    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('❌ Error sending file:', err);
        res.status(500).send('Internal Server Error: Cannot serve website.html');
      }
    });
  }

  @Get('/api-docs')
  getApiCustomDocs(@Res() res: Response) {
    // Use process.cwd() to get project root (where you run `npm start` from)
    const filePath = join(process.cwd(), 'public', 'swagger-custom.html');
    console.log('Trying to send file:', filePath);

    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('❌ Error sending file:', err);
        res.status(500).send('Internal Server Error: Cannot serve website.html');
      }
    });
  }

  @Get('/admin-login')
  getAdminLoginPage(@Res() res: Response) {
    // Use process.cwd() to get project root (where you run `npm start` from)
    const filePath = join(process.cwd(), 'public', 'login.html');
    console.log('Trying to send file:', filePath);

    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('❌ Error sending file:', err);
        res.status(500).send('Internal Server Error: Cannot serve website.html');
      }
    });
  }
}
