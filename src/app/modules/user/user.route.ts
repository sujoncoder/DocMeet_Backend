import { NextFunction, Request, Response, Router } from 'express';
import { UserRole } from '@prisma/client';
import { checkAuth } from '../../middlewares/checkAuth';
import { upload } from '../../utils/multerConfig';
import { changeProfileStatus, createAdmin, createDoctor, createPatient, getAllUser, getMyProfile, updateMyProfile } from './user.controller';
import { createAdminSchema, createDoctorSchema, createPatientSchema } from './user.validation';


// USER ROUTES
export const UserRoutes = Router()
    .get("/", checkAuth(UserRole.ADMIN), getAllUser)
    .get('/me', checkAuth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT), getMyProfile)
    .post(
        "/create-patient",
        upload.single('file'),
        (req: Request, res: Response, next: NextFunction) => {
            req.body = createPatientSchema.parse(JSON.parse(req.body.data))
            return createPatient(req, res, next)
        })

    .post(
        "/create-admin",
        checkAuth(UserRole.ADMIN),
        upload.single('file'),
        (req: Request, res: Response, next: NextFunction) => {
            req.body = createAdminSchema.parse(JSON.parse(req.body.data))
            return createAdmin(req, res, next)
        })
    .post(
        "/create-doctor",
        checkAuth(UserRole.ADMIN),
        upload.single('file'),
        (req: Request, res: Response, next: NextFunction) => {
            console.log(JSON.parse(req.body.data))
            req.body = createDoctorSchema.parse(JSON.parse(req.body.data))
            return createDoctor(req, res, next)
        })

    .patch('/:id/status', checkAuth(UserRole.ADMIN), changeProfileStatus)
    .patch(
        "/update-my-profile",
        checkAuth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
        upload.single('file'),
        (req: Request, res: Response, next: NextFunction) => {
            req.body = JSON.parse(req.body.data)
            return updateMyProfile(req, res, next)
        })