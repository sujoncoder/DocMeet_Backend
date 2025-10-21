import { z } from "zod";


// CREATE SPECIALTIES ZOD VALIDATION SCHEMA
export const createSpecialtiesZod = z.object({
    title: z.string({
        error: "Title is required!"
    })
});