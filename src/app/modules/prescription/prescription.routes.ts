import express from 'express';
import { UserRole } from '@prisma/client';
import { checkAuth } from '../../middlewares/checkAuth';
import { createPrescription, patientPrescription } from './prescription.controller';


// PRESCRIPTION ROUTES
export const PrescriptionRoutes = express.Router()
    .get('/my-prescription', checkAuth(UserRole.PATIENT), patientPrescription)
    .post("/", checkAuth(UserRole.DOCTOR), createPrescription)