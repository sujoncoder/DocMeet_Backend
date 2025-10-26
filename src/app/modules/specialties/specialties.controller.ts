import { Request, Response } from "express";
import { createSpecialtyService, deleteSpecialtyService, getAllSpecialtiesService } from "./specialties.service";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { HTTP_STATUS } from "../../constants/httpStatus";


// CREATE SPECIALTIES CONTROLLER
export const createSpecialty = catchAsync(async (req: Request, res: Response) => {
    const result = await createSpecialtyService(req);

    sendResponse(res, {
        statusCode: HTTP_STATUS.OK,
        success: true,
        message: "Specialties created successfully!",
        data: result
    });
});


// GET ALL SPECIALTIES CONTROLLER
export const getAllSpecialties = catchAsync(async (req: Request, res: Response) => {
    const result = await getAllSpecialtiesService();

    sendResponse(res, {
        statusCode: HTTP_STATUS.OK,
        success: true,
        message: 'Specialties data fetched successfully',
        data: result,
    });
});


// 
export const deleteSpecialty = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await deleteSpecialtyService(id);

    sendResponse(res, {
        statusCode: HTTP_STATUS.OK,
        success: true,
        message: 'Specialty deleted successfully',
        data: result,
    });
});