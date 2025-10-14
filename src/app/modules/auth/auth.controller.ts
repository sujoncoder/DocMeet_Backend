import { Request, Response } from "express";
import { HTTP_STATUS } from "../../constants/httpStatus";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { loginService } from "./auth.service";



// LOGIN CONTROLER
export const login = catchAsync(async (req: Request, res: Response) => {
    const result = await loginService(req.body);

    const { accessToken, refreshToken, needPasswordChange } = result;

    res.cookie("accessToken", accessToken, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60
    });

    res.cookie("refreshToken", refreshToken, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 90
    });

    sendResponse(res, {
        statusCode: HTTP_STATUS.OK,
        success: true,
        message: "Logged in successfully",
        data: {
            needPasswordChange
        }
    })
});