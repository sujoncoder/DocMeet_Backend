import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { IJWTPayload } from "../../types/common";
import { scheduleFilterableFields } from "./doctorSchedule.constant";
import pick from "../../utils/pick";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { createDoctorScheduleService, deleteScheduleService, getAllScheduleService, getMyScheduleService } from "./doctorSchedule.service";


// CREATE DOCTOR SCHEDULE CONTROLLER
export const createDoctorSchedule = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;
    const result = await createDoctorScheduleService(user as IJWTPayload, req.body);

    sendResponse(res, {
        statusCode: HTTP_STATUS.CREATED,
        success: true,
        message: "Doctor Schedule created successfully!",
        data: result
    })
});


// GET MY SCHEDULE CONTROLLER
export const getMySchedule = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const filters = pick(req.query, ['startDate', 'endDate', 'isBooked']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const user = req.user;
    const result = await getMyScheduleService(filters, options, user as IJWTPayload);

    sendResponse(res, {
        statusCode: HTTP_STATUS.OK,
        success: true,
        message: "My Schedule fetched successfully!",
        data: result
    });
});


// DELETE SCHEDULE CONTROLLER
export const deleteSchedule = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;
    const { id } = req.params;
    const result = await deleteScheduleService(user as IJWTPayload, id);

    sendResponse(res, {
        statusCode: HTTP_STATUS.OK,
        success: true,
        message: "My Schedule deleted successfully!",
        data: result
    });
});


// GET ALL SCHEDULE CONTROLLER
export const getAllSchedule = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, scheduleFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await getAllScheduleService(filters, options);

    sendResponse(res, {
        statusCode: HTTP_STATUS.OK,
        success: true,
        message: 'Doctor Schedule retrieval successfully',
        meta: result.meta,
        data: result.data,
    });
});