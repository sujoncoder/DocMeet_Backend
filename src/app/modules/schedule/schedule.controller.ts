import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { IJWTPayload } from "../../types/common";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { createScheduleService, deleteScheduleSerice, schedulesForDoctorService } from "./schedule.service";
import { pick } from "../../utils/pick";


// CREATE SCHEDULE CONTROLLER
export const createSchedule = catchAsync(async (req: Request, res: Response) => {
    const result = await createScheduleService(req.body);

    sendResponse(res, {
        statusCode: HTTP_STATUS.CREATED,
        success: true,
        message: "Schedule created successfully!",
        data: result
    })
});


// SCHEDULE FOR DOCTOR CONTROLLER
export const schedulesForDoctor = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const fillters = pick(req.query, ["startDateTime", "endDateTime"])

    const user = req.user;
    const result = await schedulesForDoctorService(user as IJWTPayload, fillters, options);

    sendResponse(res, {
        statusCode: HTTP_STATUS.OK,
        success: true,
        message: "Schedule fetched successfully!",
        meta: result.meta,
        data: result.data
    })
});


// DELETE SCHEDULE CONTROLLER
export const deleteSchedule = catchAsync(async (req: Request, res: Response) => {
    const result = await deleteScheduleSerice(req.params.id);

    sendResponse(res, {
        statusCode: HTTP_STATUS.OK,
        success: true,
        message: "Schedule deleted successfully!",
        data: result
    });
});