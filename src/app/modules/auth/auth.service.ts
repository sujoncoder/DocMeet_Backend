import { UserStatus } from "@prisma/client";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import { prisma } from "../../shared/prisma";
import { ApiError } from "../../errors/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { SECRET } from "../../config/env";
import { generateToken } from "../../utils/jwt";


// LOGIN SERVICE
export const loginService = async (payload: { email: string, password: string }) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    })

    const isCorrectPassword = await bcrypt.compare(payload.password, user.password);

    if (!isCorrectPassword) {
        throw new ApiError(HTTP_STATUS.BAD_GATEWAY, "Password is incorrect")
    };

    const accessToken = generateToken({ email: user.email, role: user.role }, SECRET.JWT_ACCESS_SECRET, SECRET.JWT_ACCESS_EXPIRES)


    const refreshToken = generateToken({ email: user.email, role: user.role }, SECRET.JWT_REFRESH_SECRET, SECRET.JWT_REFRESH_EXPIRES)

    return {
        accessToken,
        refreshToken,
        needPasswordChange: user.needPasswordChange
    }

};