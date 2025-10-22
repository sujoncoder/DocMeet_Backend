import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { getAllDoctorsService } from "./doctor.service";
import { pick } from "../../utils/pick";
import { doctorFilterableFields } from "./doctor.constant";



// GET ALL DOCTORS CONTROLLER
export const getAllDoctors = catchAsync(async (req: Request, res: Response) => {
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const fillters = pick(req.query, doctorFilterableFields)

    const result = await getAllDoctorsService(fillters, options);


    sendResponse(res, {
        statusCode: HTTP_STATUS.OK,
        success: true,
        message: "Doctor fetched successfully!",
        data: result
    })
});