import { Request } from "express";
import { prisma } from "../../shared/prisma";
import { uploadToCloudinary } from "../../utils/multerConfig";
import { Specialties } from "@prisma/client";


// CREATE SPECIALTIES SERVICE
export const createSpecialtiesService = async (req: Request) => {
    const file = req.file;
    if (file) {
        const upload = await uploadToCloudinary(file);
        req.body.icon = upload?.secure_url;
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


// DELETE SPECIALTIES SERVICE
export const deleteSpecialtiesService = async (id: string): Promise<Specialties> => {
    const result = await prisma.specialties.delete({
        where: {
            id,
        },
    });
    return result;
};