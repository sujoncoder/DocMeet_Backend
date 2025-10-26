import { Router } from 'express';
import { fetchDashboardMetaData } from './meta.controller';
import { UserRole } from '@prisma/client';
import { checkAuth } from '../../middlewares/checkAuth';


// META ROUTES
export const MetaRoutes = Router()
    .get('/', checkAuth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT), fetchDashboardMetaData);