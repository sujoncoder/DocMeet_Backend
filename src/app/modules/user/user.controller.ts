import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { createAdminService, createDoctorService, createPatientService, getAllUserService } from "./user.service";
import { pick } from "../../utils/pick";
import { userFilterableFields } from "./user.constant";


// CREATE PARTIENT CONTROLLER
export const createPatient = catchAsync(async (req: Request, res: Response) => {
    const result = await createPatientService(req);
    sendResponse(res, {
        statusCode: HTTP_STATUS.CREATED,
        success: true,
        message: "Patient create successfully",
        data: result
    })
});


// CREATE ADMIN controller
export const createAdmin = catchAsync(async (req: Request, res: Response) => {
    const result = await createAdminService(req);
    sendResponse(res, {
        statusCode: HTTP_STATUS.CREATED,
        success: true,
        message: "Admin Created successfuly!",
        data: result
    })
});


// CREATE DOCTOR controller
export const createDoctor = catchAsync(async (req: Request, res: Response) => {
    const result = await createDoctorService(req);
    sendResponse(res, {
        statusCode: HTTP_STATUS.CREATED,
        success: true,
        message: "Doctor Created successfuly!",
        data: result
    })
});


// GET ALL USER CONTROLLER
export const getAllUser = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, userFilterableFields);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

    const result = await getAllUserService(filters, options);

    sendResponse(res, {
        statusCode: HTTP_STATUS.OK,
        success: true,
        message: "Users retrieved successfully",
        meta: result.meta,
        data: result.data
    })
});