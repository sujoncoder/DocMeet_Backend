import { PaymentStatus, UserRole } from "@prisma/client";
import { IJWTPayload } from "../../types/common";
import { prisma } from "../../shared/prisma";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { ApiError } from "../../errors/ApiError";


// FETCH DASHBOARD META DATA SERVICE
export const fetchDashboardMetaDataService = async (user: IJWTPayload) => {
    let metadata;
    switch (user.role) {
        case UserRole.ADMIN:
            metadata = await getAdminMetaData();
            break;
        case UserRole.DOCTOR:
            metadata = await getDoctorMetaData(user);
            break;
        case UserRole.PATIENT:
            metadata = await getPatientMetaData(user);
            break;
        default:
            throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid user role!")
    };

    return metadata;
};


// GET DOCTOR META DATA
const getDoctorMetaData = async (user: IJWTPayload) => {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user?.email
        }
    });

    const appointmentCount = await prisma.appointment.count({
        where: {
            doctorId: doctorData.id
        }
    });

    const patientCount = await prisma.appointment.groupBy({
        by: ['patientId'],
        _count: {
            id: true
        }
    });

    const reviewCount = await prisma.review.count({
        where: {
            doctorId: doctorData.id
        }
    });

    const totalRevenue = await prisma.payment.aggregate({
        _sum: {
            amount: true
        },
        where: {
            appointment: {
                doctorId: doctorData.id
            },
            status: PaymentStatus.PAID
        }
    });

    const appointmentStatusDistribution = await prisma.appointment.groupBy({
        by: ['status'],
        _count: { id: true },
        where: {
            doctorId: doctorData.id
        }
    });

    const formattedAppointmentStatusDistribution = appointmentStatusDistribution.map(({ status, _count }) => ({
        status,
        count: Number(_count.id)
    }))

    return {
        appointmentCount,
        reviewCount,
        patientCount: patientCount.length,
        totalRevenue,
        formattedAppointmentStatusDistribution
    };
};


// GET PATIENT META DATA
const getPatientMetaData = async (user: IJWTPayload) => {
    const patientData = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user?.email
        }
    });

    const appointmentCount = await prisma.appointment.count({
        where: {
            patientId: patientData.id
        }
    });

    const prescriptionCount = await prisma.prescription.count({
        where: {
            patientId: patientData.id
        }
    });

    const reviewCount = await prisma.review.count({
        where: {
            patientId: patientData.id
        }
    });

    const appointmentStatusDistribution = await prisma.appointment.groupBy({
        by: ['status'],
        _count: { id: true },
        where: {
            patientId: patientData.id
        }
    });

    const formattedAppointmentStatusDistribution = appointmentStatusDistribution.map(({ status, _count }) => ({
        status,
        count: Number(_count.id)
    }));

    return {
        appointmentCount,
        prescriptionCount,
        reviewCount,
        formattedAppointmentStatusDistribution
    };
};


// GET ADMIN METADATA
const getAdminMetaData = async () => {
    const patientCount = await prisma.patient.count();
    const doctorCount = await prisma.doctor.count();
    const adminCount = await prisma.admin.count();
    const appointmentCount = await prisma.appointment.count()
    const paymentCount = await prisma.payment.count()

    const totalRevenue = await prisma.payment.aggregate({
        _sum: {
            amount: true
        },
        where: {
            status: PaymentStatus.PAID
        }
    })

    const barChartData = await getBarChartData();
    const pieChartData = await getPieChartData();

    return {
        patientCount,
        doctorCount,
        adminCount,
        appointmentCount,
        paymentCount,
        totalRevenue,
        barChartData,
        pieChartData
    };
};


// GET BAR CHART DATA
const getBarChartData = async () => {
    const appointmentCountPerMonth = await prisma.$queryRaw`
        SELECT DATE_TRUNC('month', "createdAt") AS month,
        CAST(COUNT(*) AS INTEGER) AS count
        FROM "appointments"
        GROUP BY month
        ORDER BY month ASC
    `
    return appointmentCountPerMonth
};


// GET PIE CHART DATA
const getPieChartData = async () => {
    const appointmentStatusDistribution = await prisma.appointment.groupBy({
        by: ['status'],
        _count: { id: true }
    });

    const formatedAppointmentStatusDistribution = appointmentStatusDistribution.map(({ status, _count }) => ({
        status,
        count: Number(_count.id)
    }));

    return formatedAppointmentStatusDistribution;
};