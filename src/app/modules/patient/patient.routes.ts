import { Router } from 'express';
import { getAllPatient, getPatientById, softDeletePatient, updatePatient } from './patient.controller';
import { UserRole } from '@prisma/client';
import { checkAuth } from '../../middlewares/checkAuth';


// PATIENT ROUTES
export const PatientRoutes = Router()
    .get('/', getAllPatient)
    .get('/:id', getPatientById)
    .patch('/', checkAuth(UserRole.PATIENT), updatePatient)
    .delete('/soft/:id', softDeletePatient)