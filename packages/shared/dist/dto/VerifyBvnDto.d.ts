import { z } from 'zod';
export declare const VerifyBVNSchema: z.ZodObject<{
    bvn: z.ZodString;
    dateOfBirth: z.ZodString;
    mobileNo: z.ZodString;
    name: z.ZodString;
}, z.core.$strip>;
export type VerifyBVNDto = z.infer<typeof VerifyBVNSchema>;
