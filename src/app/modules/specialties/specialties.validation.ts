import { z } from "zod";


// CREATE SPECIALTIES VALIDATION ZOD SCHEMA
export const CreateSpecialtiesSchema = z.object({
    title: z.string({
        error: "Title is required!"
    })
});