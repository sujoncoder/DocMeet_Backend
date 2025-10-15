import { addMinutes, addHours, format } from "date-fns";
import { prisma } from "../../shared/prisma";
import { Prisma } from "@prisma/client";
import { IJWTPayload } from "../../types/common";
import { calculatePagination, IOptions } from "../../utils/pagination";


// CREATE SCHEDULE SERVICE
export const createScheduleService = async (payload: any) => {

    const { startTime, endTime, startDate, endDate } = payload;

    const intervalTime = 30;
    const schedules = [];

    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);

    while (currentDate <= lastDate) {
        const startDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, "yyyy-MM-dd")}`,
                    Number(startTime.split(":")[0]) // 11:00
                ),
                Number(startTime.split(":")[1])
            )
        )

        const endDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, "yyyy-MM-dd")}`,
                    Number(endTime.split(":")[0])
                ),
                Number(endTime.split(":")[1])
            )
        );

        while (startDateTime < endDateTime) {
            const slotStartDateTime = startDateTime;
            const slotEndDateTime = addMinutes(startDateTime, intervalTime);

            const scheduleData = {
                startDateTime: slotStartDateTime,
                endDateTime: slotEndDateTime
            };

            const existingSchedule = await prisma.schedule.findFirst({
                where: scheduleData
            });

            if (!existingSchedule) {
                const result = await prisma.schedule.create({
                    data: scheduleData
                });
                schedules.push(result)
            };

            slotStartDateTime.setMinutes(slotStartDateTime.getMinutes() + intervalTime);
        }
        currentDate.setDate(currentDate.getDate() + 1)
    };
    return schedules;
};


// SCHEDULE FOR DOCTOR SERVICE
export const schedulesForDoctorService = async (
    user: IJWTPayload,
    fillters: any,
    options: IOptions
) => {
    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
    const { startDateTime: filterStartDateTime, endDateTime: filterEndDateTime } = fillters;

    const andConditions: Prisma.ScheduleWhereInput[] = [];

    if (filterStartDateTime && filterEndDateTime) {
        andConditions.push({
            AND: [
                {
                    startDateTime: {
                        gte: filterStartDateTime
                    }
                },
                {
                    endDateTime: {
                        lte: filterEndDateTime
                    }
                }
            ]
        })
    }

    const whereConditions: Prisma.ScheduleWhereInput = andConditions.length > 0 ? {
        AND: andConditions
    } : {}


    const doctorSchedules = await prisma.doctorSchedules.findMany({
        where: {
            doctor: {
                email: user.email
            }
        },
        select: {
            scheduleId: true
        }
    });

    const doctorScheduleIds = doctorSchedules.map(schedule => schedule.scheduleId);

    const result = await prisma.schedule.findMany({
        where: {
            ...whereConditions,
            id: {
                notIn: doctorScheduleIds
            }
        },
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        }
    });

    const total = await prisma.schedule.count({
        where: {
            ...whereConditions,
            id: {
                notIn: doctorScheduleIds
            }
        }
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


// DELETE SCHEDULE SERVICE
export const deleteScheduleSerice = async (id: string) => {
    return await prisma.schedule.delete({
        where: {
            id
        }
    })
};