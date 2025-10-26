import { Request } from "express";
import { prisma } from "../../shared/prisma";
import { Specialties } from "@prisma/client";
import { uploadToCloudinary } from "../../utils/multerConfig";


// CREATE SPECIALTY SERVICE
export const createSpecialtyService = async (req: Request) => {
    const file = req.file;

    if (file) {
        const uploadCloudinary = await uploadToCloudinary(file);
        req.body.icon = uploadCloudinary?.secure_url;
    };

    const result = await prisma.specialties.create({
        data: req.body
    });

    return result;
};


// GET ALL SPECIALTIES SERVICE
export const getAllSpecialtiesService = async (): Promise<Specialties[]> => {
    return await prisma.specialties.findMany();
};


// DELETE SPECIALTY SERVICE
export const deleteSpecialtyService = async (id: string): Promise<Specialties> => {
    const result = await prisma.specialties.delete({
        where: {
            id,
        },
    });
    return result;
};