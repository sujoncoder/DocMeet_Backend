import { NextFunction, Request, Response } from "express"
import { HTTP_STATUS } from "../constants/httpStatus";


// NOT FOUND MIDDLEWARE
const notFound = (req: Request, res: Response, next: NextFunction) => {
    res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: "API NOT FOUND!",
        error: {
            path: req.originalUrl,
            message: "Your requested path is not found!"
        }
    })
};

export default notFound;