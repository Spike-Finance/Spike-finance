import { z } from 'zod';

export const AllowedBankAccountSchema = z.object({
    accountNumber: z.string(),
    bankCode: z.string(),
});

export const AllowedPaymentSourcesSchema = z.object({
    bvns: z.array(z.string().length(11, 'BVN must be 11 digits long')).optional(),
    bankAccounts: z.array(AllowedBankAccountSchema).optional(),
});

export const IncomeSplitConfigSchema = z.object({
    subAccountCode: z.string(),
    feePercentage: z.number().min(0).max(100).optional(),
    splitPercentage: z.number().min(0).max(100).optional(),
    splitAmount: z.number().positive().optional(),
    feeBearer: z.boolean().optional(),
});

export const CreateReservedAccountSchema = z.object({
    accountReference: z.string().min(1, 'Account reference is required'),
    accountName: z.string().min(1, 'Account name is required'),
    currencyCode: z.string().default('NGN'),
    contractCode: z.string().min(1, 'Contract code is required'),
    customerEmail: z.string().email('Invalid customer email address'),
    customerName: z.string().min(1, 'Customer name is required'),
    bvn: z.string().length(11, 'BVN must be 11 digits long').optional(),
    nin: z.string().length(11, 'NIN must be 11 digits long').optional(),
    getAllAvailableBanks: z.boolean().optional(),
    preferredBanks: z.array(z.string()).optional(),
    restrictPaymentSource: z.boolean().optional(),
    allowedPaymentSources: AllowedPaymentSourcesSchema.optional(),
    incomeSplitConfig: z.array(IncomeSplitConfigSchema).optional(),
});

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

