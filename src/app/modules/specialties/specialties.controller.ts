import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { createSpecialtiesService, deleteSpecialtiesService, getAllSpecialtiesService } from "./specialties.service";
import { HTTP_STATUS } from "../../constants/httpStatus";


// CREATE SPECIALTIES CONTROLLER
export const createSpecialties = catchAsync(async (req: Request, res: Response) => {
    const result = await createSpecialtiesService(req);

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


// DELETE SPECIALTIES CONTROLLER
export const deleteSpecialties = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await deleteSpecialtiesService(id);
    sendResponse(res, {
        statusCode: HTTP_STATUS.OK,
        success: true,
        message: 'Specialty deleted successfully',
        data: result,
    });
});