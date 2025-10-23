import { prisma } from "../../shared/prisma";
import { IJWTPayload } from "../../types/common";
import { v4 as uuidv4 } from 'uuid';
import { AppointmentStatus, Prisma, UserRole } from "@prisma/client";
import { stripe } from "../../utils/stripe";
import { calculatePagination, IOptions } from "../../utils/pagination";
import { ApiError } from "../../errors/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";


// CREATE APPOINTMENT SERVICE
export const createAppointmentService = async (user: IJWTPayload, payload: { doctorId: string, scheduleId: string }) => {
    const patientData = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });

    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            id: payload.doctorId,
            isDeleted: false
        }
    });

    const isBookedOrNot = await prisma.doctorSchedules.findFirstOrThrow({
        where: {
            doctorId: payload.doctorId,
            scheduleId: payload.scheduleId,
            isBooked: false
        }
    });

    const videoCallingId = uuidv4();

    const result = await prisma.$transaction(async (tnx) => {
        const appointmentData = await tnx.appointment.create({
            data: {
                patientId: patientData.id,
                doctorId: doctorData.id,
                scheduleId: payload.scheduleId,
                videoCallingId
            }
        })

        await tnx.doctorSchedules.update({
            where: {
                doctorId_scheduleId: {
                    doctorId: doctorData.id,
                    scheduleId: payload.scheduleId
                }
            },
            data: {
                isBooked: true
            }
        })

        const transactionId = uuidv4();

        const paymentData = await tnx.payment.create({
            data: {
                appointmentId: appointmentData.id,
                amount: doctorData.appointmentFee,
                transactionId
            }
        })

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            customer_email: user.email,
            line_items: [
                {
                    price_data: {
                        currency: "bdt",
                        product_data: {
                            name: `Appointment with ${doctorData.name}`,
                        },
                        unit_amount: doctorData.appointmentFee * 100,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                appointmentId: appointmentData.id,
                paymentId: paymentData.id
            },
            success_url: `https://www.programming-hero.com/`,
            cancel_url: `https://next.programming-hero.com/`,
        });

        return { paymentUrl: session.url };
    })

    return result;
};


// GET MY APPOINTMENT SERVICE
export const getMyAppointmentService = async (user: IJWTPayload, filters: any, options: IOptions) => {
    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
    const { ...filterData } = filters;

    const andConditions: Prisma.AppointmentWhereInput[] = [];

    if (user.role === UserRole.PATIENT) {
        andConditions.push({
            patient: {
                email: user.email
            }
        })
    }
    else if (user.role === UserRole.DOCTOR) {
        andConditions.push({
            doctor: {
                email: user.email
            }
        })
    }

    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map(key => ({
            [key]: {
                equals: (filterData as any)[key]
            }
        }))

        andConditions.push(...filterConditions)
    }

    const whereConditions: Prisma.AppointmentWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.appointment.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: user.role === UserRole.DOCTOR ?
            { patient: true } : { doctor: true }
    });

    const total = await prisma.appointment.count({
        where: whereConditions
    });

    return {
        meta: {
            total,
            limit,
            page
        },
        data: result
    }
};

// task get all data from db (appointment data) - admin

// UPDATE APPOINTMENT STATUS SERVICE
export const updateAppointmentStatusService = async (appointmentId: string, status: AppointmentStatus, user: IJWTPayload) => {
    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: appointmentId
        },
        include: {
            doctor: true
        }
    });

    if (user.role === UserRole.DOCTOR) {
        if (!(user.email === appointmentData.doctor.email))
            throw new ApiError(HTTP_STATUS.BAD_REQUEST, "This is not your appointment")
    };

    return await prisma.appointment.update({
        where: {
            id: appointmentId
        },
        data: {
            status
        }
    });
};