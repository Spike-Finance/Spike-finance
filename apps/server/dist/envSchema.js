"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseEnvSchema = void 0;
const zod_1 = require("zod");
exports.baseEnvSchema = zod_1.z.object({
    PORT: zod_1.z.string().default('8000'),
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']),
    JWT_SECRET: zod_1.z.string().min(20, 'Weak JWT_SECRET: Use at least 20 characters.'),
    MONNIFY_API_KEY: zod_1.z.string(),
    MONNIFY_SECRET_KEY: zod_1.z.string(),
    MONNIFY_SANDBOX_URL: zod_1.z.string(),
    MONNIFY_CONTRACT_CODE: zod_1.z.string(),
    MONNIFY_BUSINESS_CODE: zod_1.z.string(),
    MONNIFY_BASE_URL: zod_1.z.url(),
    RESEND_API_KEY: zod_1.z.string(),
});
//# sourceMappingURL=envSchema.js.map