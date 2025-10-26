import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { changePasswordService, forgotPasswordService, getMeService, loginService, refreshTokenService, resetPasswordService } from "./auth.service";


// LOGIN CONTROLLER
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
        message: "User loggedin successfully!",
        data: {
            needPasswordChange
        }
    });
});


// REFRESH TOKEN CONTROLLER
export const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    const result = await refreshTokenService(refreshToken);
    res.cookie("accessToken", result.accessToken, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60,
    });

    sendResponse(res, {
        statusCode: HTTP_STATUS.OK,
        success: true,
        message: "Access token genereated successfully!",
        data: {
            message: "Access token genereated successfully!",
        },
    });
});


// CHANGE PASSWORD CONTROLLER
export const changePassword = catchAsync(
    async (req: Request & { user?: any }, res: Response) => {
        const user = req.user;
        const result = await changePasswordService(user, req.body);

        sendResponse(res, {
            statusCode: HTTP_STATUS.OK,
            success: true,
            message: "Password Changed successfully",
            data: result,
        });
    }
);


// FORGOT PASSWORD CONTROLLER
export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
    await forgotPasswordService(req.body);

    sendResponse(res, {
        statusCode: HTTP_STATUS.OK,
        success: true,
        message: "Check your email!",
        data: null,
    });
});


// RESET PASSWORD CONTROLLER
export const resetPassword = catchAsync(async (req: Request, res: Response) => {
    const token = req.headers.authorization || "";

    await resetPasswordService(token, req.body);

    sendResponse(res, {
        statusCode: HTTP_STATUS.OK,
        success: true,
        message: "Password Reset!",
        data: null,
    });
});


// GET ME CONTROLLER
export const getMe = catchAsync(async (req: Request, res: Response) => {
    const userSession = req.cookies;
    const result = await getMeService(userSession);

    sendResponse(res, {
        statusCode: HTTP_STATUS.OK,
        success: true,
        message: "User retrive successfully!",
        data: result,
    });
});