import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { createAppointmentService, getMyAppointmentService, updateAppointmentStatusService } from "./appointment.service";
import sendResponse from "../../shared/sendResponse";
import { IJWTPayload } from "../../types/common";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { pick } from "../../utils/pick";



// CREATE APPOINTMENT CONTROLLER
export const createAppointment = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;
    const result = await createAppointmentService(user as IJWTPayload, req.body);

    sendResponse(res, {
        statusCode: HTTP_STATUS.CREATED,
        success: true,
        message: "Appointment created successfully!",
        data: result
    })
});


// GET MY APPOINTMENT CONTROLLER
export const getMyAppointment = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const fillters = pick(req.query, ["status", "paymentStatus"])
    const user = req.user;
    const result = await getMyAppointmentService(user as IJWTPayload, fillters, options);

    sendResponse(res, {
        statusCode: HTTP_STATUS.OK,
        success: true,
        message: "Appointment fetched successfully!",
        data: result
    })
});


// UPDATE APPOINTMENT STATUS CONTROLLER
export const updateAppointmentStatus = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const user = req.user;

    const result = await updateAppointmentStatusService(id, status, user as IJWTPayload);

    sendResponse(res, {
        statusCode: HTTP_STATUS.OK,
        success: true,
        message: "Appointment updated successfully!",
        data: result
    });
});