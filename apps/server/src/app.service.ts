import { Injectable } from '@nestjs/common';
import { MonnifyService } from './common/services/monnify/monnify.service';
import { ServerResponse } from '@spike/shared';

@Injectable()
export class AppService {
  constructor(private monnifyService: MonnifyService) {}
  async getHello() {
    return await this.monnifyService.login();
  }

  async getBanks() {
    const data = await this.monnifyService.getBanks();
    console.log(data);
    return new ServerResponse({
      status: 200,
      data,
      message: 'Monnify Banks',
    });
  }
}
