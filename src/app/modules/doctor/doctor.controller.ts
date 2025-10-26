import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { doctorFilterableFields } from "./doctor.constant";
import pick from "../../utils/pick";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { deleteDoctorService, getAISuggestionService, getAllDoctorService, getDoctorByIdService, softDeleteService, updateDoctorService } from "./doctor.service";


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


// UPDATE DOCTOR SERVICE CONTROLLER
export const updateDoctor = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await updateDoctorService(id, req.body);

    sendResponse(res, {
        statusCode: HTTP_STATUS.OK,
        success: true,
        message: "Doctor updated successfully!",
        data: result
    });
});


// GET DOCTOR BY ID CONTROLLER
export const getDoctorById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await getDoctorByIdService(id);

    sendResponse(res, {
        statusCode: HTTP_STATUS.OK,
        success: true,
        message: 'Doctor retrieval successfully',
        data: result,
    });
});


// DELETE DOCTOR CONTROLLER
export const deleteDoctor = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await deleteDoctorService(id);

    sendResponse(res, {
        statusCode: HTTP_STATUS.OK,
        success: true,
        message: 'Doctor deleted successfully',
        data: result,
    });
});


// SOFT DELETE CONTROLLER
export const softDelete = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await softDeleteService(id);

    sendResponse(res, {
        statusCode: HTTP_STATUS.OK,
        success: true,
        message: 'Doctor soft deleted successfully',
        data: result,
    });
});


// GET AI SUGGESTION CONTROLLER
export const getAISuggestion = catchAsync(async (req: Request, res: Response) => {
    const result = await getAISuggestionService(req.body);

    sendResponse(res, {
        statusCode: HTTP_STATUS.OK,
        success: true,
        message: 'AI suggestions fetched successfully',
        data: result,
    });
});