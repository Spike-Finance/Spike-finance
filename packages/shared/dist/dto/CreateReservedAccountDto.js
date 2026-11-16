"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateReservedAccountSchema = exports.IncomeSplitConfigSchema = exports.AllowedPaymentSourcesSchema = exports.AllowedBankAccountSchema = void 0;
const zod_1 = require("zod");
exports.AllowedBankAccountSchema = zod_1.z.object({
    accountNumber: zod_1.z.string(),
    bankCode: zod_1.z.string(),
});
exports.AllowedPaymentSourcesSchema = zod_1.z.object({
    bvns: zod_1.z.array(zod_1.z.string().length(11, 'BVN must be 11 digits long')).optional(),
    bankAccounts: zod_1.z.array(exports.AllowedBankAccountSchema).optional(),
});
exports.IncomeSplitConfigSchema = zod_1.z.object({
    subAccountCode: zod_1.z.string(),
    feePercentage: zod_1.z.number().min(0).max(100).optional(),
    splitPercentage: zod_1.z.number().min(0).max(100).optional(),
    splitAmount: zod_1.z.number().positive().optional(),
    feeBearer: zod_1.z.boolean().optional(),
});
exports.CreateReservedAccountSchema = zod_1.z.object({
    accountReference: zod_1.z.string().min(1, 'Account reference is required'),
    accountName: zod_1.z.string().min(1, 'Account name is required'),
    currencyCode: zod_1.z.string().default('NGN'),
    contractCode: zod_1.z.string().min(1, 'Contract code is required'),
    customerEmail: zod_1.z.string().email('Invalid customer email address'),
    customerName: zod_1.z.string().min(1, 'Customer name is required'),
    bvn: zod_1.z.string().length(11, 'BVN must be 11 digits long').optional(),
    nin: zod_1.z.string().length(11, 'NIN must be 11 digits long').optional(),
    getAllAvailableBanks: zod_1.z.boolean().optional(),
    preferredBanks: zod_1.z.array(zod_1.z.string()).optional(),
    restrictPaymentSource: zod_1.z.boolean().optional(),
    allowedPaymentSources: exports.AllowedPaymentSourcesSchema.optional(),
    incomeSplitConfig: zod_1.z.array(exports.IncomeSplitConfigSchema).optional(),
});
