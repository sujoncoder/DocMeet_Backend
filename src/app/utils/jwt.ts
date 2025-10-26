import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";


// GENERATE TOKEN
export const generateToken = (payload: any, secret: Secret, expiresIn: string) => {
    const token = jwt.sign(payload, secret, {
        algorithm: "HS256",
        expiresIn
    } as SignOptions
    );

    return token;
};


// VERIFY TOKEN
export const verifyToken = (token: string, secret: Secret) => {
    return jwt.verify(token, secret) as JwtPayload
};