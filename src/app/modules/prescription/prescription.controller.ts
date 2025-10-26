import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { IJWTPayload } from "../../types/common";
import { createPrescriptionService, patientPrescriptionService } from "./prescription.service";
import sendResponse from "../../shared/sendResponse";
import { HTTP_STATUS } from "../../constants/httpStatus";
import pick from "../../utils/pick";


// CREATE PRESCRIPTION CONTROLLER
export const createPrescription = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;
    const result = await createPrescriptionService(user as IJWTPayload, req.body);

    sendResponse(res, {
        statusCode: HTTP_STATUS.CREATED,
        success: true,
        message: "prescription created successfully!",
        data: result
    });
});


// PATIENT PRESCRIPTION CONTROLLER
export const patientPrescription = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])
    const result = await patientPrescriptionService(user as IJWTPayload, options);

    sendResponse(res, {
        statusCode: HTTP_STATUS.OK,
        success: true,
        message: 'Prescription fetched successfully',
        meta: result.meta,
        data: result.data
    });
});