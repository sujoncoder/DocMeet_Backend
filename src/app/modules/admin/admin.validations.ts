import { z } from "zod";


// ADMIN UPDATE VALIDATION SCHEMA
export const adminUpdateSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        contactNumber: z.string().optional()
    })
});