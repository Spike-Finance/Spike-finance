import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpClient } from '@nestjs/http-client'
import { IMonnifyBank } from './models/MonnifyBanks';
import { IMonnifyValidatedBank } from './models/MonnifyValidatedBankDetails';
import { IMonnifyTransaction } from './models/MonnifyValidateTransaction';
import { CreateReservedAccountDto, VerifyBVNDto } from '@spike/shared'


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

@Injectable()
export class MonnifyService {
    private readonly BASE_URL;
    private readonly API_KEY;
    private readonly SECRET_KEY;
    private readonly SANDBOX_URL;
    private readonly CONTRACT_CODE;
    private readonly BUSINESS_CODE;
    private logger = new Logger('MONNIFY_SERVICE');

    // keys
    private TOKEN: string = 'TOKEN';
    private TTL: string = 'TTL';

    constructor(private readonly configService: ConfigService, private readonly httpService: HttpClient, @Inject(CACHE_MANAGER) private cacheManager: Cache) {
        this.API_KEY = this.configService.get<string>('MONNIFY_API_KEY');
        this.SECRET_KEY = this.configService.get<string>('MONNIFY_SECRET_KEY');
        this.SANDBOX_URL = this.configService.get<string>('MONNIFY_SANDBOX_URL');
        this.CONTRACT_CODE = this.configService.get<string>('MONNIFY_CONTRACT_CODE');
        this.BUSINESS_CODE = this.configService.get<string>('MONNIFY_BUSINESS_CODE');
        this.BASE_URL = this.configService.get<string>('MONNIFY_SANDBOX_URL');
    }

    private generateBase64Code() {
        this.logger.debug(`API KEY -> ${this.API_KEY}`);
        this.logger.debug(`SECRET KEY -> ${this.SECRET_KEY}`);
        const code = Buffer.from(`${this.API_KEY}:${this.SECRET_KEY}`).toString('base64');
        this.logger.debug(`Base64 Code generated -> ${code}`);
        return code;
    }


    public async login(): Promise<MonnifyAuthResponse> {
        try {
            const token = this.generateBase64Code();
            this.logger.error(`TOKEN-> ${token}`)
            const response = await this.httpService.post(`${this.BASE_URL}/auth/login`, {
                headers: {
                    'Authorization': `Basic ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data as MonnifyAuthResponse;
        } catch (error) {
            this.logger.error(error);
            throw new UnauthorizedException(`Login Failed`, error);
        }
    }

    private async getAccessToken(): Promise<string> {
        try {
            // Check if we have a valid token
            let accessToken: string | undefined = await this.cacheManager.get(this.TOKEN);
            const ttl: string | undefined = await this.cacheManager.get(this.TTL);
            if (accessToken && ttl && Date.now() < parseInt(ttl)) {
                this.logger.debug('CACHED TOKEN', accessToken);
                return accessToken;
            }

            // Generate base64 credentials
            const base64Credentials = this.generateBase64Code();
            this.logger.debug('BASE64 STRING => ', base64Credentials);

            // Make request to Monnify authentication endpoint
            const response = await this.httpService.post<MonnifyAuthResponse>(
                `${this.BASE_URL}/auth/login`,
                {
                    headers: {
                        Authorization: `Basic ${base64Credentials}`,
                        'Content-Type': 'application/json',
                    },
                },
            );

            if (!response.data.requestSuccessful) {
                throw new Error(
                    `Monnify authentication failed: ${response.data.responseMessage}`,
                );
            }

            this.logger.log(response?.data);

            // Store token and calculate expiration time
            this.cacheManager.set(
                this.TOKEN,
                response?.data?.responseBody?.accessToken,
            );
            this.cacheManager.set(
                this.TTL,
                Date.now() + response?.data?.responseBody?.expiresIn * 1000,
            );
            accessToken = response?.data?.responseBody?.accessToken;

            // Set up token expiration cleanup
            setTimeout(() => {
                this.clearAccessToken();
            }, response.data.responseBody.expiresIn * 1000);

            return accessToken;
        } catch (error) {
            this.logger.error(`Failed to get Monnify access token: ${error.message}`);
            throw error;
        }
    }

    /**
     * Clear the stored access token
     */
    private clearAccessToken(): void {
        this.cacheManager.del(this.TOKEN);
        this.cacheManager.del(this.TTL);
    }

    public async getBanks(): Promise<MonnifyResponse<IMonnifyBank[]>> {
        try {
            const token = await this.getAccessToken();
            const response = await this.httpService.get<MonnifyResponse<IMonnifyBank[]>>(
                `${this.BASE_URL}/banks`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                },
            );

            if (!response.data.requestSuccessful) {
                throw new Error(
                    `Monnify authentication failed: ${response.data.responseMessage}`,
                );
            }

            return response.data;
        } catch (error) {
            this.logger.error(`Failed to get banks: ${error?.response?.data}`);
            throw new BadRequestException(error?.response?.data);
        }
    }

    public async validateBank({
        accountNumber,
        bankCode,
    }: {
        accountNumber: string;
        bankCode: string;
    }): Promise<MonnifyResponse<IMonnifyValidatedBank>> {
        try {
            const token = await this.getAccessToken();
            const response = await this.httpService.get<MonnifyResponse<IMonnifyValidatedBank>>(
                `${this.BASE_URL}/disbursements/account/validate?accountNumber=${accountNumber}&bankCode=${bankCode}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                },
            );

            if (!response.data.requestSuccessful) {
                throw new Error(
                    `Monnify authentication failed: ${response.data.responseMessage}`,
                );
            }

            return response.data;
        } catch (error) {
            this.logger.error(
                `Failed to validate bank details`,
                error?.response?.data,
            );
            throw new BadRequestException(error?.response?.data);
        }
    }

    public async validateTransaction(
        reference: string,
    ): Promise<MonnifyResponse<IMonnifyTransaction>> {
        try {
            const token = await this.getAccessToken();
            const response = await this.httpService.get<MonnifyResponse<IMonnifyTransaction>>(
                `${this.BASE_URL}/transaction/${reference}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                },
            );

            this.logger.error(response);

            if (!response.data.requestSuccessful) {
                throw new BadRequestException(
                    `Monnify authentication failed: ${response.data.responseMessage}`,
                );
            }

            return response.data;
        } catch (error) {
            this.logger.error(
                `Failed to validate transaction`,
                error?.response?.data,
            );
            throw new BadRequestException(error?.response?.data);
        }
    }

    public async initiateSingleTransfer(payload: {
        amount: number;
        reference: string;
        narration: string;
        destinationBankCode: string;
        destinationAccountNumber: string;
        currency?: 'NGN';
        sourceAccountNumber?: string;
        destinationAccountName: string;
        async?: boolean;
    }): Promise<MonnifyResponse<unknown>> {
        try {
            const token = await this.getAccessToken();
            const body = {
                amount: payload.amount,
                reference: payload.reference,
                narration: payload.narration,
                destinationBankCode: payload.destinationBankCode,
                destinationAccountNumber: payload.destinationAccountNumber,
                currency: payload.currency ?? 'NGN',
                sourceAccountNumber:
                    payload.sourceAccountNumber ??
                    this.configService.get<string>('MONNIFY_SOURCE_ACCOUNT_NUMBER'),
                destinationAccountName: payload.destinationAccountName,
                async: payload.async ?? false,
            };

            if (!body.sourceAccountNumber) {
                throw new BadRequestException(
                    'Monnify source account number is not configured. Please set MONNIFY_SOURCE_ACCOUNT_NUMBER in environment.',
                );
            }

            const response = await this.httpService.post<MonnifyResponse<unknown>>(
                `${this.BASE_URL}/api/v2/disbursements/single`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body)
                },
            );

            if (!response.data.requestSuccessful) {
                throw new Error(
                    `Monnify initiate transfer failed: ${response.data.responseMessage}`,
                );
            }

            return response.data;
        } catch (error) {
            this.logger.error(
                `Failed to initiate single transfer`,
                error?.response?.data ?? error?.message,
            );
            throw new BadRequestException(error?.response?.data ?? error?.message);
        }
    }

    public async createTransaction(payload: {
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
    }): Promise<
        MonnifyResponse<{
            transactionReference: string;
            paymentReference: string;
            merchantName: string;
            apiKey: string;
            enabledPaymentMethod: string[];
            checkoutUrl: string;
        }>
    > {
        try {
            const token = await this.getAccessToken();
            const body = {
                amount: payload.amount,
                customerName: payload.customerName,
                customerEmail: payload.customerEmail,
                paymentReference: payload.paymentReference,
                paymentDescription: payload.paymentDescription,
                currencyCode: payload.currencyCode ?? 'NGN',
                contractCode:
                    payload.contractCode ??
                    this.configService.get<string>('MONNIFY_CONTRACT_CODE'),
                redirectUrl: payload.redirectUrl,
                paymentMethods: payload.paymentMethods ?? ['CARD', 'ACCOUNT_TRANSFER'],
                incomeSplitConfig: payload.incomeSplitConfig ?? [],
            };

            if (!body.contractCode) {
                throw new BadRequestException(
                    'Monnify contract code is not configured. Please set MONNIFY_CONTRACT_CODE in environment.',
                );
            }

            const response = await this.httpService.post<
                MonnifyResponse<{
                    transactionReference: string;
                    paymentReference: string;
                    merchantName: string;
                    apiKey: string;
                    enabledPaymentMethod: string[];
                    checkoutUrl: string;
                }>
            >(`${this.BASE_URL}/merchant/transactions/init-transaction`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });

            if (!response.data.requestSuccessful) {
                throw new Error(
                    `Monnify create transaction failed: ${response.data.responseMessage}`,
                );
            }

            return response.data;
        } catch (error) {
            this.logger.error(
                `Failed to create transaction`,
                error?.response?.data ?? error?.message,
            );
            throw new InternalServerErrorException(
                error?.response?.data ?? error?.message,
            );
        }
    }

    async verifyBvn(payload: VerifyBVNDto) {
        try {
            const token = await this.getAccessToken();
            const response = await this.httpService.post(
                `${this.BASE_URL}/vas/bvn-details-match`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                }
            );

            return response.data;

        } catch (error) {
            throw new BadRequestException(error?.response?.data);
        }
    }

    async createReservedAccount(payload: CreateReservedAccountDto) {
        try {
            const token = await this.getAccessToken();
            const response = await this.httpService.post(
                `${this.BASE_URL}/bank-transfer/reserved-accounts`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                }
            );

            return response.data;

        } catch (error) {
            throw new BadRequestException(error?.response?.data);
        }
    }
}


// miracle id => 69beab2b7e91a2634fd80866

// {
//   _id: ObjectId('6af0dd0d1feb55866bf0b121'),
//   feedBack: 'This is a great work.',
//   score: NumberInt('95'),
//   challengeID: '6ad9cd9f9fb7608dab78629d',
//   submissionID: '6ae77fcd9fb7608dab7de907',
//   taskID: '6ada0cb49fb7608dab786c89',
//   owner: '69beab2b7e91a2634fd80866',
//   markedBy: ObjectId('6ad93a4d9fb7608dab785b69'),
//   deletedAt: null,
//   createdAt: ISODate('2026-11-08T01:15:01.971Z'),
//   updatedAt: ISODate('2026-11-08T01:15:01.971Z'),
//   __v: NumberInt('0')
// }