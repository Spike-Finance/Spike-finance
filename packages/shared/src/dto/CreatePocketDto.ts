import { z } from 'zod';

export const CreatePocketSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters long'),
    type: z.enum(['LOCKED', 'TARGET', 'FLEXIBLE']),
    targetAmount: z.number().multipleOf(0.01).optional(),
})

export type CReatePocketDto = z.infer<typeof CreatePocketSchema>;