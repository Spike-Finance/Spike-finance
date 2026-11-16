import { z } from 'zod';
export declare const CreatePocketSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodEnum<{
        LOCKED: "LOCKED";
        TARGET: "TARGET";
        FLEXIBLE: "FLEXIBLE";
    }>;
    targetAmount: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type CReatePocketDto = z.infer<typeof CreatePocketSchema>;
