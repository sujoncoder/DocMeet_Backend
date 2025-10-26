import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { IJWTPayload } from "../../types/common";
import sendResponse from "../../shared/sendResponse";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { fetchDashboardMetaDataService } from "./meta.service";


// FETCH DASHBOARD META DATA CONTROLLER
export const fetchDashboardMetaData = catchAsync(async (req: Request & { user?: IJWTPayload }, res: Response) => {

    const user = req.user;
    const result = await fetchDashboardMetaDataService(user as IJWTPayload);

    sendResponse(res, {
        statusCode: HTTP_STATUS.OK,
        success: true,
        message: "Meta data retrival successfully!",
        data: result
    });
});