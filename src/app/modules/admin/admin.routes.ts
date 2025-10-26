import { Router } from 'express';
import { UserRole } from '@prisma/client';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { adminUpdateSchema } from './admin.validations';
import { AdminController } from './admin.controller';


// ADMIN ROUTES
export const AdminRoutes = Router()
    .get('/', checkAuth(UserRole.ADMIN), AdminController.getAllFromDB)
    .get('/:id', checkAuth(UserRole.ADMIN), AdminController.getByIdFromDB)
    .patch('/:id', checkAuth(UserRole.ADMIN), validateRequest(adminUpdateSchema), AdminController.updateIntoDB)
    .delete('/:id', checkAuth(UserRole.ADMIN), AdminController.deleteFromDB)
    .delete('/soft/:id', checkAuth(UserRole.ADMIN), AdminController.softDeleteFromDB)