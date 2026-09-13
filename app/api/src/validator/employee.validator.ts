import { z } from "zod"


export const employeeValidator = z.object({
    userId: z.string().uuid(),
    firstName: z.string().min(2).max(100).trim(),
    lastName: z.string().min(1).max(100).trim(),
    phone: z.string().max(20).optional(),
    departmentId: z.string().uuid().optional(),
    designation: z.string().max(100).optional(),
    managerId: z.string().uuid().optional(),
    salaryBasic: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
    joiningDate: z.string().date().optional(), 
    status: z.enum(["active", "inactive", "terminated"]).default("active"),
})