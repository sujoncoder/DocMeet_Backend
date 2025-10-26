import dotenv from "dotenv";


// CONFIG DOT-ENV
dotenv.config();

interface IEnvType {
    PORT: string;
    DATABASE_URL: string;
    NODE_ENV: "development" | "production";
    BCRYPT_SALT_ROUND: number;
    CLOUDINARY_CLOUD_NAME: string,
    CLOUDINARY_API_KEY: string,
    CLOUDINARY_API_SECRET: string
    JWT_ACCESS_SECRET: string;
    JWT_ACCESS_EXPIRES: string;
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXPIRES: string;
    OPENROUTER_API_KEY: string;
    STRIPE_SECRET_KEY: string;
    WEB_HOOK_SECRET: string;
    RESET_PASS_SECRET: string;
    RESET_PASS_TOKEN_EXPIRES_IN: string;
    RESET_PASS_LINK: string;
    SMTP_HOST: string;
    SMTP_PASS: string;
    SMTP_FROM_EMAIL: string;
};

// GET VALIDATED ENV FUNCTION
const getValidatedEnv = (): IEnvType => {

    const requiredKeys: string[] = [
        "PORT",
        "DATABASE_URL",
        "NODE_ENV",
        "BCRYPT_SALT_ROUND",
        "CLOUDINARY_CLOUD_NAME",
        "CLOUDINARY_API_KEY",
        "CLOUDINARY_API_SECRET",
        "JWT_ACCESS_SECRET",
        "JWT_ACCESS_EXPIRES",
        "JWT_REFRESH_SECRET",
        "JWT_REFRESH_EXPIRES",
        "OPENROUTER_API_KEY",
        "STRIPE_SECRET_KEY",
        "WEB_HOOK_SECRET",
        "RESET_PASS_SECRET",
        "RESET_PASS_TOKEN_EXPIRES_IN",
        "RESET_PASS_LINK",
        "SMTP_HOST",
        "SMTP_PASS",
        "SMTP_FROM_EMAIL"
    ];

    requiredKeys.forEach((key) => {
        if (!process.env[key]) {
            console.error(`❌ Missing environment variable: ${key}`);
            process.exit(1);
        };
    });

    return {
        PORT: process.env.PORT as string,
        DATABASE_URL: process.env.DATABASE_URL as string,
        NODE_ENV: process.env.NODE_ENV as "development" | "production",
        BCRYPT_SALT_ROUND: Number(process.env.BCRYPT_SALT_ROUND),
        CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
        CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
        CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
        JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
        JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
        OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY as string,
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
        WEB_HOOK_SECRET: process.env.WEB_HOOK_SECRET as string,
        RESET_PASS_SECRET: process.env.RESET_PASS_SECRET as string,
        RESET_PASS_TOKEN_EXPIRES_IN: process.env.RESET_PASS_TOKEN_EXPIRES_IN as string,
        RESET_PASS_LINK: process.env.RESET_PASS_LINK as string,
        SMTP_HOST: process.env.SMTP_HOST as string,
        SMTP_PASS: process.env.SMTP_PASS as string,
        SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL as string,
    };
};

export const SECRET = getValidatedEnv();