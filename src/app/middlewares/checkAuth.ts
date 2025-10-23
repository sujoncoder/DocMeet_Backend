import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

import { SECRET } from "../config/env";
import { verifyToken } from "../utils/jwt";
import { ApiError } from "../errors/ApiError";


// CHECK AUTH MIDDLEWARE
export const checkAuth = (...roles: string[]) => async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            throw new ApiError(403, "No token received!");
        };

        const verifiedToken = verifyToken(token, SECRET.JWT_ACCESS_SECRET) as JwtPayload;

        if (roles.length && !roles.includes(verifiedToken.role)) {
            throw new ApiError(403, "You are not permitted to access this route!");
        };

        req.user = verifiedToken;
        next();
    } catch (error) {
        next(error);
    }
};