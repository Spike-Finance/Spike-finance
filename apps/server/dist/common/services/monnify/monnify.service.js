"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonnifyService = void 0;
const cache_manager_1 = require("@nestjs/cache-manager");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const http_client_1 = require("@nestjs/http-client");
let MonnifyService = class MonnifyService {
    configService;
    httpService;
    cacheManager;
    BASE_URL;
    API_KEY;
    SECRET_KEY;
    SANDBOX_URL;
    CONTRACT_CODE;
    BUSINESS_CODE;
    logger = new common_1.Logger('MONNIFY_SERVICE');
    TOKEN = 'TOKEN';
    TTL = 'TTL';
    constructor(configService, httpService, cacheManager) {
        this.configService = configService;
        this.httpService = httpService;
        this.cacheManager = cacheManager;
        this.API_KEY = this.configService.get('MONNIFY_API_KEY');
        this.SECRET_KEY = this.configService.get('MONNIFY_SECRET_KEY');
        this.SANDBOX_URL = this.configService.get('MONNIFY_SANDBOX_URL');
        this.CONTRACT_CODE = this.configService.get('MONNIFY_CONTRACT_CODE');
        this.BUSINESS_CODE = this.configService.get('MONNIFY_BUSINESS_CODE');
        this.BASE_URL = this.configService.get('MONNIFY_SANDBOX_URL');
    }
    generateBase64Code() {
        this.logger.debug(`API KEY -> ${this.API_KEY}`);
        this.logger.debug(`SECRET KEY -> ${this.SECRET_KEY}`);
        const code = Buffer.from(`${this.API_KEY}:${this.SECRET_KEY}`).toString('base64');
        this.logger.debug(`Base64 Code generated -> ${code}`);
        return code;
    }
    async login() {
        try {
            const token = this.generateBase64Code();
            this.logger.error(`TOKEN-> ${token}`);
            const response = await this.httpService.post(`${this.BASE_URL}/auth/login`, {
                headers: {
                    'Authorization': `Basic ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        }
        catch (error) {
            this.logger.error(error);
            throw new common_1.UnauthorizedException(`Login Failed`, error);
        }
    }
    async getAccessToken() {
        try {
            let accessToken = await this.cacheManager.get(this.TOKEN);
            const ttl = await this.cacheManager.get(this.TTL);
            if (accessToken && ttl && Date.now() < parseInt(ttl)) {
                this.logger.debug('CACHED TOKEN', accessToken);
                return accessToken;
            }
            const base64Credentials = this.generateBase64Code();
            this.logger.debug('BASE64 STRING => ', base64Credentials);
            const response = await this.httpService.post(`${this.BASE_URL}/auth/login`, {
                headers: {
                    Authorization: `Basic ${base64Credentials}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.data.requestSuccessful) {
                throw new Error(`Monnify authentication failed: ${response.data.responseMessage}`);
            }
            this.logger.log(response?.data);
            this.cacheManager.set(this.TOKEN, response?.data?.responseBody?.accessToken);
            this.cacheManager.set(this.TTL, Date.now() + response?.data?.responseBody?.expiresIn * 1000);
            accessToken = response?.data?.responseBody?.accessToken;
            setTimeout(() => {
                this.clearAccessToken();
            }, response.data.responseBody.expiresIn * 1000);
            return accessToken;
        }
        catch (error) {
            this.logger.error(`Failed to get Monnify access token: ${error.message}`);
            throw error;
        }
    }
    clearAccessToken() {
        this.cacheManager.del(this.TOKEN);
        this.cacheManager.del(this.TTL);
    }
    async getBanks() {
        try {
            const token = await this.getAccessToken();
            const response = await this.httpService.get(`${this.BASE_URL}/banks`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.data.requestSuccessful) {
                throw new Error(`Monnify authentication failed: ${response.data.responseMessage}`);
            }
            return response.data;
        }
        catch (error) {
            this.logger.error(`Failed to get banks: ${error?.response?.data}`);
            throw new common_1.BadRequestException(error?.response?.data);
        }
    }
    async validateBank({ accountNumber, bankCode, }) {
        try {
            const token = await this.getAccessToken();
            const response = await this.httpService.get(`${this.BASE_URL}/disbursements/account/validate?accountNumber=${accountNumber}&bankCode=${bankCode}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.data.requestSuccessful) {
                throw new Error(`Monnify authentication failed: ${response.data.responseMessage}`);
            }
            return response.data;
        }
        catch (error) {
            this.logger.error(`Failed to validate bank details`, error?.response?.data);
            throw new common_1.BadRequestException(error?.response?.data);
        }
    }
    async validateTransaction(reference) {
        try {
            const token = await this.getAccessToken();
            const response = await this.httpService.get(`${this.BASE_URL}/transaction/${reference}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            this.logger.error(response);
            if (!response.data.requestSuccessful) {
                throw new common_1.BadRequestException(`Monnify authentication failed: ${response.data.responseMessage}`);
            }
            return response.data;
        }
        catch (error) {
            this.logger.error(`Failed to validate transaction`, error?.response?.data);
            throw new common_1.BadRequestException(error?.response?.data);
        }
    }
    async initiateSingleTransfer(payload) {
        try {
            const token = await this.getAccessToken();
            const body = {
                amount: payload.amount,
                reference: payload.reference,
                narration: payload.narration,
                destinationBankCode: payload.destinationBankCode,
                destinationAccountNumber: payload.destinationAccountNumber,
                currency: payload.currency ?? 'NGN',
                sourceAccountNumber: payload.sourceAccountNumber ??
                    this.configService.get('MONNIFY_SOURCE_ACCOUNT_NUMBER'),
                destinationAccountName: payload.destinationAccountName,
                async: payload.async ?? false,
            };
            if (!body.sourceAccountNumber) {
                throw new common_1.BadRequestException('Monnify source account number is not configured. Please set MONNIFY_SOURCE_ACCOUNT_NUMBER in environment.');
            }
            const response = await this.httpService.post(`${this.BASE_URL}/api/v2/disbursements/single`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            if (!response.data.requestSuccessful) {
                throw new Error(`Monnify initiate transfer failed: ${response.data.responseMessage}`);
            }
            return response.data;
        }
        catch (error) {
            this.logger.error(`Failed to initiate single transfer`, error?.response?.data ?? error?.message);
            throw new common_1.BadRequestException(error?.response?.data ?? error?.message);
        }
    }
    async createTransaction(payload) {
        try {
            const token = await this.getAccessToken();
            const body = {
                amount: payload.amount,
                customerName: payload.customerName,
                customerEmail: payload.customerEmail,
                paymentReference: payload.paymentReference,
                paymentDescription: payload.paymentDescription,
                currencyCode: payload.currencyCode ?? 'NGN',
                contractCode: payload.contractCode ??
                    this.configService.get('MONNIFY_CONTRACT_CODE'),
                redirectUrl: payload.redirectUrl,
                paymentMethods: payload.paymentMethods ?? ['CARD', 'ACCOUNT_TRANSFER'],
                incomeSplitConfig: payload.incomeSplitConfig ?? [],
            };
            if (!body.contractCode) {
                throw new common_1.BadRequestException('Monnify contract code is not configured. Please set MONNIFY_CONTRACT_CODE in environment.');
            }
            const response = await this.httpService.post(`${this.BASE_URL}/merchant/transactions/init-transaction`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            if (!response.data.requestSuccessful) {
                throw new Error(`Monnify create transaction failed: ${response.data.responseMessage}`);
            }
            return response.data;
        }
        catch (error) {
            this.logger.error(`Failed to create transaction`, error?.response?.data ?? error?.message);
            throw new common_1.InternalServerErrorException(error?.response?.data ?? error?.message);
        }
    }
    async verifyBvn(payload) {
        try {
            const token = await this.getAccessToken();
            const response = await this.httpService.post(`${this.BASE_URL}/vas/bvn-details-match`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            return response.data;
        }
        catch (error) {
            throw new common_1.BadRequestException(error?.response?.data);
        }
    }
    async createReservedAccount(payload) {
        try {
            const token = await this.getAccessToken();
            const response = await this.httpService.post(`${this.BASE_URL}/bank-transfer/reserved-accounts`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            return response.data;
        }
        catch (error) {
            throw new common_1.BadRequestException(error?.response?.data);
        }
    }
};
exports.MonnifyService = MonnifyService;
exports.MonnifyService = MonnifyService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [config_1.ConfigService, http_client_1.HttpClient, cache_manager_1.Cache])
], MonnifyService);
//# sourceMappingURL=monnify.service.js.map