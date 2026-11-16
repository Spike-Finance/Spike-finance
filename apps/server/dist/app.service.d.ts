import { MonnifyService } from './common/services/monnify/monnify.service';
import { ServerResponse } from '@spike/shared';
export declare class AppService {
    private monnifyService;
    constructor(monnifyService: MonnifyService);
    getHello(): Promise<import("./common/services/monnify/monnify.service").MonnifyAuthResponse>;
    getBanks(): Promise<ServerResponse<import("./common/services/monnify/monnify.service").MonnifyResponse<import("./common/services/monnify/models/MonnifyBanks").IMonnifyBank[]>>>;
}
