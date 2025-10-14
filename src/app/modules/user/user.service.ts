import { Request } from "express";
import bcrypt from "bcryptjs";
import { Admin, Doctor, Prisma, UserRole } from "@prisma/client";
import { SECRET } from "../../config/env";
import { prisma } from "../../shared/prisma";
import { calculatePagination, IOptions } from "../../utils/pagination";
import { userSearchableFields } from "./user.constant";
import { uploadToCloudinary } from "../../utils/multerConfig";



// CREATE PARTIENT SERVICE
export const createPatientService = async (req: Request) => {

    if (req.file) {
        const uploadResult = await uploadToCloudinary(req.file)
        req.body.patient.profilePhoto = uploadResult?.secure_url;
    };

    const hashPassword = await bcrypt.hash(req.body.password, SECRET.BCRYPT_SALT_ROUND);

    const result = await prisma.$transaction(async (tnx) => {
        await tnx.user.create({
            data: {
                email: req.body.patient.email,
                password: hashPassword
            }
        });
        return await tnx.patient.create({
            data: req.body.patient
        })
    })

    return result;
};


// CREATE ADMIN SERVICE
export const createAdminService = async (req: Request): Promise<Admin> => {

    const file = req.file;

    if (file) {
        const uploadResult = await uploadToCloudinary(file);
        req.body.admin.profilePhoto = uploadResult?.secure_url
    }

    const hashedPassword: string = await bcrypt.hash(req.body.password, 10)

    const userData = {
        email: req.body.admin.email,
        password: hashedPassword,
        role: UserRole.ADMIN
    };

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdAdminData = await transactionClient.admin.create({
            data: req.body.admin
        });

        return createdAdminData;
    });

    return result;
};


// CREATE DOCTOR SERVICE
export const createDoctorService = async (req: Request): Promise<Doctor> => {

    const file = req.file;

    if (file) {
        const uploadResult = await uploadToCloudinary(file);
        req.body.doctor.profilePhoto = uploadResult?.secure_url
    };
    const hashedPassword: string = await bcrypt.hash(req.body.password, 10)

    const userData = {
        email: req.body.doctor.email,
        password: hashedPassword,
        role: UserRole.DOCTOR
    };

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdDoctorData = await transactionClient.doctor.create({
            data: req.body.doctor
        });

        return createdDoctorData;
    });

    return result;
};


// GET ALL USER SERVICE
export const getAllUserService = async (params: any, options: IOptions) => {
    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
    const { searchTerm, ...filterData } = params;

    const andConditions: Prisma.UserWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: userSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive"
                }
            }))
        })
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        })
    }

    const whereConditions: Prisma.UserWhereInput = andConditions.length > 0 ? {
        AND: andConditions
    } : {}

    const result = await prisma.user.findMany({
        skip,
        take: limit,

        where: whereConditions,
        orderBy: {
            [sortBy]: sortOrder
        }
    });

    const total = await prisma.user.count({
        where: whereConditions
    });
    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };
};