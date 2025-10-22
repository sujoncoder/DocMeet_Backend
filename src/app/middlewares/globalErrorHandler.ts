import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express"
import { HTTP_STATUS } from "../constants/httpStatus";


// GLOBAL ERROR HANDLER
const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err)
    let statusCode: number = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    let success = false;
    let message = err.message || "Something went wrong!";
    let error = err;

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            message = "Duplicate key error",
                error = err.meta,
                statusCode = HTTP_STATUS.CONFLICT
        }
        if (err.code === "P1000") {
            message = "Authentication failed against database server",
                error = err.meta,
                statusCode = HTTP_STATUS.BAD_GATEWAY
        }
        if (err.code === "P2003") {
            message = "Foreign key constraint failed",
                error = err.meta,
                statusCode = HTTP_STATUS.BAD_REQUEST
        }
        if (err.code === "P2025") {
            message = "Schedule not available",
                error = err.meta,
                statusCode = HTTP_STATUS.BAD_REQUEST
        }
    }

    else if (err instanceof Prisma.PrismaClientValidationError) {
        message = "Validation Error",
            error = err.message,
            statusCode = HTTP_STATUS.BAD_REQUEST
    }
    else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        message = "Unknown Prisma error occured!",
            error = err.message,
            statusCode = HTTP_STATUS.BAD_REQUEST
    }
    else if (err instanceof Prisma.PrismaClientInitializationError) {
        message = "Prisma client failed to initialize!",
            error = err.message,
            statusCode = HTTP_STATUS.BAD_REQUEST
    }

    res.status(statusCode).json({
        success,
        message,
        error
    })
};

export default globalErrorHandler;