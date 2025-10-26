import z from "zod";

// CREATE DOCTOR SCHEDULE SCHEMA ZOD VALIDATION
export const createDoctorScheduleSchema = z.object({
    body: z.object({
        scheduleIds: z.array(z.string())
    })
});