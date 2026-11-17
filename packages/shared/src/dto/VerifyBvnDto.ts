import { z } from 'zod';

export const VerifyBVNSchema = z.object({
    bvn: z.string().length(11, 'BVN must be 11 digits long'),
    dateOfBirth: z.string('Date of Birth is required'),
    mobileNo: z.string('Mobile Number is required'),
    name: z.string('Name is required'),
})

export type VerifyBVNDto = z.infer<typeof VerifyBVNSchema>;