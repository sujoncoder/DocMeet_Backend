import { Request, Response } from "express";
import { createReviewService, getAllReviewsService } from "./review.service";
import { IJWTPayload } from "../../types/common";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { reviewFilterableFields } from "./review.constant";
import pick from "../../utils/pick";
import { HTTP_STATUS } from "../../constants/httpStatus";


// CREATE REVIEW CONTROLLER
export const createReview = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {
    const user = req.user;
    const result = await createReviewService(user as IJWTPayload, req.body);

    sendResponse(res, {
        statusCode: HTTP_STATUS.OK,
        success: true,
        message: 'Review created successfully',
        data: result,
    });
});


// GET ALL REVIEWS CONTROLLER
export const getAllReviews = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, reviewFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await getAllReviewsService(filters, options);

    sendResponse(res, {
        statusCode: HTTP_STATUS.OK,
        success: true,
        message: 'Reviews retrieval successfully',
        meta: result.meta,
        data: result.data,
    });
});