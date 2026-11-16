import { z } from 'zod';
export declare const AllowedBankAccountSchema: z.ZodObject<{
    accountNumber: z.ZodString;
    bankCode: z.ZodString;
}, z.core.$strip>;
export declare const AllowedPaymentSourcesSchema: z.ZodObject<{
    bvns: z.ZodOptional<z.ZodArray<z.ZodString>>;
    bankAccounts: z.ZodOptional<z.ZodArray<z.ZodObject<{
        accountNumber: z.ZodString;
        bankCode: z.ZodString;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const IncomeSplitConfigSchema: z.ZodObject<{
    subAccountCode: z.ZodString;
    feePercentage: z.ZodOptional<z.ZodNumber>;
    splitPercentage: z.ZodOptional<z.ZodNumber>;
    splitAmount: z.ZodOptional<z.ZodNumber>;
    feeBearer: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const CreateReservedAccountSchema: z.ZodObject<{
    accountReference: z.ZodString;
    accountName: z.ZodString;
    currencyCode: z.ZodDefault<z.ZodString>;
    contractCode: z.ZodString;
    customerEmail: z.ZodString;
    customerName: z.ZodString;
    bvn: z.ZodOptional<z.ZodString>;
    nin: z.ZodOptional<z.ZodString>;
    getAllAvailableBanks: z.ZodOptional<z.ZodBoolean>;
    preferredBanks: z.ZodOptional<z.ZodArray<z.ZodString>>;
    restrictPaymentSource: z.ZodOptional<z.ZodBoolean>;
    allowedPaymentSources: z.ZodOptional<z.ZodObject<{
        bvns: z.ZodOptional<z.ZodArray<z.ZodString>>;
        bankAccounts: z.ZodOptional<z.ZodArray<z.ZodObject<{
            accountNumber: z.ZodString;
            bankCode: z.ZodString;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
    incomeSplitConfig: z.ZodOptional<z.ZodArray<z.ZodObject<{
        subAccountCode: z.ZodString;
        feePercentage: z.ZodOptional<z.ZodNumber>;
        splitPercentage: z.ZodOptional<z.ZodNumber>;
        splitAmount: z.ZodOptional<z.ZodNumber>;
        feeBearer: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type CreateReservedAccountDto = z.infer<typeof CreateReservedAccountSchema>;
export type AllowedPaymentSources = z.infer<typeof AllowedPaymentSourcesSchema>;
export type AllowedBankAccount = z.infer<typeof AllowedBankAccountSchema>;
export type IncomeSplitConfig = z.infer<typeof IncomeSplitConfigSchema>;
export interface ReservedAccountBankDetails {
    bankCode: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
}
export interface MonnifyReservedAccountResponseBody {
    contractCode: string;
    accountReference: string;
    accountName: string;
    currencyCode: string;
    customerEmail: string;
    customerName: string;
    accounts: ReservedAccountBankDetails[];
    collectionChannel: string;
    reservationReference: string;
    reservedAccountType: string;
    status: string;
    createdOn: string;
    incomeSplitConfig?: IncomeSplitConfig[];
    restrictPaymentSource?: boolean;
}
