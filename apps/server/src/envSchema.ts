import { z } from 'zod'


export const baseEnvSchema = z.object({
    PORT: z.string().default('8000'),
    NODE_ENV: z.enum(['development', 'production', 'test']),
    JWT_SECRET: z.string().min(20, 'Weak JWT_SECRET: Use at least 20 characters.'),
    MONNIFY_API_KEY: z.string(),
    MONNIFY_SECRET_KEY: z.string(),
    MONNIFY_SANDBOX_URL: z.string(),
    MONNIFY_CONTRACT_CODE: z.string(),
    MONNIFY_BUSINESS_CODE: z.string(),
    MONNIFY_BASE_URL: z.url(),
    RESEND_API_KEY: z.string(),
});