import { UserStatus } from "@prisma/client"
import { prisma } from "../../shared/prisma"
import bcrypt from "bcryptjs";
import { Secret } from 'jsonwebtoken'
import config from "../../../config";
import emailSender from "./emailSender";
import { ApiError } from "../../errors/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { generateToken, verifyToken } from "../../utils/jwt";


// LOGIN SERVICE
export const loginService = async (payload: { email: string, password: string }) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    });

    const isCorrectPassword = await bcrypt.compare(payload.password, user.password);
    if (!isCorrectPassword) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Password is incorrect!")
    };

    const accessToken = generateToken({ email: user.email, role: user.role }, config.jwt.jwt_secret as Secret, "1h");

    const refreshToken = generateToken({ email: user.email, role: user.role }, config.jwt.refresh_token_secret as Secret, "90d");

    return {
        accessToken,
        refreshToken,
        needPasswordChange: user.needPasswordChange
    };
};


// REFRESH TOKEN SERVICE
export const refreshTokenService = async (token: string) => {
    let decodedData;
    try {
        decodedData = verifyToken(token, config.jwt.refresh_token_secret as Secret);
    }
    catch (err) {
        throw new Error("You are not authorized!")
    };

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: UserStatus.ACTIVE
        }
    });

    const accessToken = generateToken({
        email: userData.email,
        role: userData.role
    },
        config.jwt.jwt_secret as Secret,
        config.jwt.expires_in as string
    );

    return {
        accessToken,
        needPasswordChange: userData.needPasswordChange
    };
};


// CHANGE PASSWORD SERVICE
export const changePasswordService = async (user: any, payload: any) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: UserStatus.ACTIVE
        }
    });

    const isCorrectPassword: boolean = await bcrypt.compare(payload.oldPassword, userData.password);

    if (!isCorrectPassword) {
        throw new Error("Password incorrect!")
    };

    const hashedPassword: string = await bcrypt.hash(payload.newPassword, Number(config.salt_round));

    await prisma.user.update({
        where: {
            email: userData.email
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false
        }
    });

    return {
        message: "Password changed successfully!"
    };
};


// FORGOT PASSWORD SERVICE
export const forgotPasswordService = async (payload: { email: string }) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    });

    const resetPassToken = generateToken(
        { email: userData.email, role: userData.role },
        config.jwt.reset_pass_secret as Secret,
        config.jwt.reset_pass_token_expires_in as string
    );

    const resetPassLink = config.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`

    await emailSender(
        userData.email,
        `
        <div>
            <p>Dear User,</p>
            <p>Your password reset link 
                <a href=${resetPassLink}>
                    <button>
                        Reset Password
                    </button>
                </a>
            </p>

        </div>
        `
    )
};


// RESET PASSWORD SERVICE
export const resetPasswordService = async (token: string, payload: { id: string, password: string }) => {

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            id: payload.id,
            status: UserStatus.ACTIVE
        }
    });

    const isValidToken = verifyToken(token, config.jwt.reset_pass_secret as Secret);

    if (!isValidToken) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, "Forbidden!")
    };

    const password = await bcrypt.hash(payload.password, Number(config.salt_round));

    await prisma.user.update({
        where: {
            id: payload.id
        },
        data: {
            password
        }
    })
};


// GET ME SERVICE
export const getMeService = async (session: any) => {
    const accessToken = session.accessToken;
    const decodedData = verifyToken(accessToken, config.jwt.jwt_secret as Secret);

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: UserStatus.ACTIVE
        }
    });

    const { id, email, role, needPasswordChange, status } = userData;

    return {
        id,
        email,
        role,
        needPasswordChange,
        status
    };
};