"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyBVNSchema = void 0;
const zod_1 = require("zod");
exports.VerifyBVNSchema = zod_1.z.object({
    bvn: zod_1.z.string().length(11, 'BVN must be 11 digits long'),
    dateOfBirth: zod_1.z.string('Date of Birth is required'),
    mobileNo: zod_1.z.string('Mobile Number is required'),
    name: zod_1.z.string('Name is required'),
});
