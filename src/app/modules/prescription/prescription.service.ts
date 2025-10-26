import { AppointmentStatus, PaymentStatus, Prescription, UserRole } from "@prisma/client";
import { IJWTPayload } from "../../types/common";
import { prisma } from "../../shared/prisma";
import { ApiError } from "../../errors/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";
import calculatePagination, { IOptions } from "../../utils/pagination";


// CREATE PRESCRIPTION SERVICE
export const createPrescriptionService = async (user: IJWTPayload, payload: Partial<Prescription>) => {
    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: payload.appointmentId,
            status: AppointmentStatus.COMPLETED,
            paymentStatus: PaymentStatus.PAID
        },
        include: {
            doctor: true
        }
    });

    if (user.role === UserRole.DOCTOR) {
        if (!(user.email === appointmentData.doctor.email))
            throw new ApiError(HTTP_STATUS.BAD_REQUEST, "This is not your appointment")
    };

    const result = await prisma.prescription.create({
        data: {
            appointmentId: appointmentData.id,
            doctorId: appointmentData.doctorId,
            patientId: appointmentData.patientId,
            instructions: payload.instructions as string,
            followUpDate: payload.followUpDate || null
        },
        include: {
            patient: true
        }
    });

    return result;
};


// PATIENT PRESCRIPTION SERVICE
export const patientPrescriptionService = async (user: IJWTPayload, options: IOptions) => {
    const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);

    const result = await prisma.prescription.findMany({
        where: {
            patient: {
                email: user.email
            }
        },
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            doctor: true,
            patient: true,
            appointment: true
        }
    });

    const total = await prisma.prescription.count({
        where: {
            patient: {
                email: user.email
            }
        }
    });

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    };
};