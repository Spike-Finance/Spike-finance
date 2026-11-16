import type { Response } from 'express';
import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): Promise<import("./common/services/monnify/monnify.service").MonnifyAuthResponse>;
    getHealth(res: Response): Response<any, Record<string, any>>;
    getBanks(): Promise<import("@spike/shared").ServerResponse<import("./common/services/monnify/monnify.service").MonnifyResponse<import("./common/services/monnify/models/MonnifyBanks").IMonnifyBank[]>>>;
}
