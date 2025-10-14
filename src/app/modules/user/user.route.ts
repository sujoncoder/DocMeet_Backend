import { NextFunction, Request, Response, Router } from "express";
import { createAdmin, createDoctor, createPatient, getAllUser } from "./user.controller";
import { upload } from "../../utils/multerConfig";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "@prisma/client";
import { createAdminValidation, createDoctorValidation, createPatientValidation } from "./user.validation";


// USER ROUTES
export const userRoutes = Router()
    .get("/", checkAuth(UserRole.ADMIN), getAllUser)

    .post("/create-patient", upload.single("file"),
        (req: Request, res: Response, next: NextFunction) => {
            req.body = createPatientValidation.parse(JSON.parse(req.body.data))
            return createPatient(req, res, next)
        })

    .post("/create-admin", upload.single("file"),
        (req: Request, res: Response, next: NextFunction) => {
            req.body = createAdminValidation.parse(JSON.parse(req.body.data))
            return createAdmin(req, res, next)
        })


    .post("/create-doctor", checkAuth(UserRole.ADMIN), upload.single("file"),
        (req: Request, res: Response, next: NextFunction) => {
            req.body = createDoctorValidation.parse(JSON.parse(req.body.data))
            return createDoctor(req, res, next)
        })