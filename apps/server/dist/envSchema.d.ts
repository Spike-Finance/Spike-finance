import { z } from 'zod';
export declare const baseEnvSchema: z.ZodObject<{
    PORT: z.ZodDefault<z.ZodString>;
    NODE_ENV: z.ZodEnum<{
        development: "development";
        production: "production";
        test: "test";
    }>;
    JWT_SECRET: z.ZodString;
    MONNIFY_API_KEY: z.ZodString;
    MONNIFY_SECRET_KEY: z.ZodString;
    MONNIFY_SANDBOX_URL: z.ZodString;
    MONNIFY_CONTRACT_CODE: z.ZodString;
    MONNIFY_BUSINESS_CODE: z.ZodString;
    MONNIFY_BASE_URL: z.ZodURL;
    RESEND_API_KEY: z.ZodString;
}, z.core.$strip>;
