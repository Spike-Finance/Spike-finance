import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth(@Res() res: Response) {
    return res.status(200).send('OK');
  }

  @Get('monnify/banks')
  async getBanks() {
    const data = await this.appService.getBanks();
    return data;
  }
}
