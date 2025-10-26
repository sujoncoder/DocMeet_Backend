import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { userFilterableFields } from "./user.constant";
import { IJWTPayload } from "../../types/common";
import pick from "../../utils/pick";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { changeProfileStatusService, createAdminService, createDoctorService, createPatientService, getAllUserService, getMyProfileService, updateMyProfileService } from "./user.service";


// CREATE PATIENT CONTROLLER
export const createPatient = catchAsync(async (req: Request, res: Response) => {
    const result = await createPatientService(req);

    sendResponse(res, {
        statusCode: HTTP_STATUS.CREATED,
        success: true,
        message: "Patient created successfully!",
        data: result
    })
})


// CREATE ADMIN CONTROLLER
export const createAdmin = catchAsync(async (req: Request, res: Response) => {
    const result = await createAdminService(req);

    sendResponse(res, {
        statusCode: HTTP_STATUS.CREATED,
        success: true,
        message: "Admin Created successfuly!",
        data: result
    })
});


// CREATE DOCTOR CONTROLLER
export const createDoctor = catchAsync(async (req: Request, res: Response) => {
    const result = await createDoctorService(req);

    sendResponse(res, {
        statusCode: HTTP_STATUS.CREATED,
        success: true,
        message: "Doctor Created successfuly!",
        data: result
    })
});


// GET ALL USERS CONTROLLER
export const getAllUser = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, userFilterableFields) // searching , filtering
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]) // pagination and sorting

    const result = await getAllUserService(filters, options);

    sendResponse(res, {
        statusCode: HTTP_STATUS.OK,
        success: true,
        message: "User retrive successfully!",
        meta: result.meta,
        data: result.data
    })
})


// GET MY PROFILE CONTROLLER
export const getMyProfile = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;
    const result = await getMyProfileService(user as IJWTPayload);

    sendResponse(res, {
        statusCode: HTTP_STATUS.OK,
        success: true,
        message: "My profile data fetched!",
        data: result
    })
});


// CHANGE PROFILE STATUS CONTROLLER
export const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await changeProfileStatusService(id, req.body)

    sendResponse(res, {
        statusCode: HTTP_STATUS.OK,
        success: true,
        message: "Users profile status changed!",
        data: result
    })
});


// UPDATE MY PROFILE CONTROLLER
export const updateMyProfile = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;
    const result = await updateMyProfileService(user as IJWTPayload, req);

    sendResponse(res, {
        statusCode: HTTP_STATUS.OK,
        success: true,
        message: "My profile updated!",
        data: result
    })
});