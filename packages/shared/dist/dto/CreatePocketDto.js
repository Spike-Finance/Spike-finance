"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePocketSchema = void 0;
const zod_1 = require("zod");
exports.CreatePocketSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, 'Name must be at least 3 characters long'),
    type: zod_1.z.enum(['LOCKED', 'TARGET', 'FLEXIBLE']),
    targetAmount: zod_1.z.number().multipleOf(0.01).optional(),
});
