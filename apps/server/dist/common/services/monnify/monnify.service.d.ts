import { Cache } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { HttpClient } from '@nestjs/http-client';
import { IMonnifyBank } from './models/MonnifyBanks';
import { IMonnifyValidatedBank } from './models/MonnifyValidatedBankDetails';
import { IMonnifyTransaction } from './models/MonnifyValidateTransaction';
import { CreateReservedAccountDto, VerifyBVNDto } from '@spike/shared';
export interface MonnifyResponse<T> {
    requestSuccessful: boolean;
    responseMessage: string;
    responseCode: string;
    responseBody: T;
}
export interface MonnifyAuthResponse {
    requestSuccessful: boolean;
    responseMessage: string;
    responseCode: string;
    responseBody: {
        accessToken: string;
        expiresIn: number;
    };
}
export declare class MonnifyService {
    private readonly configService;
    private readonly httpService;
    private cacheManager;
    private readonly BASE_URL;
    private readonly API_KEY;
    private readonly SECRET_KEY;
    private readonly SANDBOX_URL;
    private readonly CONTRACT_CODE;
    private readonly BUSINESS_CODE;
    private logger;
    private TOKEN;
    private TTL;
    constructor(configService: ConfigService, httpService: HttpClient, cacheManager: Cache);
    private generateBase64Code;
    login(): Promise<MonnifyAuthResponse>;
    private getAccessToken;
    private clearAccessToken;
    getBanks(): Promise<MonnifyResponse<IMonnifyBank[]>>;
    validateBank({ accountNumber, bankCode, }: {
        accountNumber: string;
        bankCode: string;
    }): Promise<MonnifyResponse<IMonnifyValidatedBank>>;
    validateTransaction(reference: string): Promise<MonnifyResponse<IMonnifyTransaction>>;
    initiateSingleTransfer(payload: {
        amount: number;
        reference: string;
        narration: string;
        destinationBankCode: string;
        destinationAccountNumber: string;
        currency?: 'NGN';
        sourceAccountNumber?: string;
        destinationAccountName: string;
        async?: boolean;
    }): Promise<MonnifyResponse<unknown>>;
    createTransaction(payload: {
        amount: number;
        customerName: string;
        customerEmail: string;
        paymentReference: string;
        paymentDescription: string;
        currencyCode?: string;
        contractCode?: string;
        redirectUrl?: string;
        paymentMethods?: string[];
        incomeSplitConfig?: Array<{
            subAccountCode: string;
            feePercentage?: number;
            splitAmount?: number;
            feeBearer?: boolean;
        }>;
    }): Promise<MonnifyResponse<{
        transactionReference: string;
        paymentReference: string;
        merchantName: string;
        apiKey: string;
        enabledPaymentMethod: string[];
        checkoutUrl: string;
    }>>;
    verifyBvn(payload: VerifyBVNDto): Promise<unknown>;
    createReservedAccount(payload: CreateReservedAccountDto): Promise<unknown>;
}
