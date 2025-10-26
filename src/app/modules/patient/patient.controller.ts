import { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync';
import { patientFilterableFields } from './patient.constant';
import sendResponse from '../../shared/sendResponse';
import { IJWTPayload } from '../../types/common';
import pick from '../../utils/pick';
import { HTTP_STATUS } from '../../constants/httpStatus';
import { getAllPatiendService, getPatientByIdService, softDeletePatientService, updatePatientService } from './patient.service';


// GET ALL PATIEND CONTROLLER
export const getAllPatient = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, patientFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await getAllPatiendService(filters, options);

    sendResponse(res, {
        statusCode: HTTP_STATUS.OK,
        success: true,
        message: 'Patient retrieval successfully',
        meta: result.meta,
        data: result.data,
    });
});


// GET PATIEND BY ID CONTROLLER
export const getPatientById = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params;
    const result = await getPatientByIdService(id);

    sendResponse(res, {
        statusCode: HTTP_STATUS.OK,
        success: true,
        message: 'Patient retrieval successfully',
        data: result,
    });
});


// SOFT DELETE PATIENT CONTROLLER
export const softDeletePatient = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await softDeletePatientService(id);

    sendResponse(res, {
        statusCode: HTTP_STATUS.OK,
        success: true,
        message: 'Patient soft deleted successfully',
        data: result,
    });
});


// UPDATE PATIEND CONTROLLER
export const updatePatient = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;
    const result = await updatePatientService(user as IJWTPayload, req.body);

    sendResponse(res, {
        statusCode: HTTP_STATUS.OK,
        success: true,
        message: 'Patient updated successfully',
        data: result,
    });
});