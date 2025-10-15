import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { IJWTPayload } from "../../types/common";
import { createDoctorScheduleService } from "./doctorSchedule.service";


// CREATE DOCTOR SCHEDULE CINTROLLER
export const createDoctorSchedule = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;
    const result = await createDoctorScheduleService(user as IJWTPayload, req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Doctor Schedule created successfully!",
        data: result
    })
});