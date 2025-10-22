import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { doctorFilterableFields } from "./doctor.constant";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { pick } from "../../utils/pick";
import { getAllDoctorService, updateDoctorService } from "./doctor.service";


// GET ALL DOCTOR CONTROLLER
export const getAllDoctor = catchAsync(async (req: Request, res: Response) => {
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const fillters = pick(req.query, doctorFilterableFields)

    const result = await getAllDoctorService(fillters, options);

    sendResponse(res, {
        statusCode: HTTP_STATUS.OK,
        success: true,
        message: "Doctor fetched successfully!",
        meta: result.meta,
        data: result.data
    })
});


// UPDATE DOCTOR CONTROLLER
export const updateDoctor = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await updateDoctorService(id, req.body);

    sendResponse(res, {
        statusCode: HTTP_STATUS.OK,
        success: true,
        message: "Doctor updated successfully!",
        data: result
    })
});