import { NextFunction, Request, Response, Router } from 'express';
import { createSpecialty, deleteSpecialty, getAllSpecialties } from './specialties.controller';
import { CreateSpecialtiesSchema } from './specialties.validation';
import { UserRole } from '@prisma/client';
import { checkAuth } from '../../middlewares/checkAuth';
import { upload } from '../../utils/multerConfig';


// SPECIALTIES ROUTES
export const SpecialtiesRoutes = Router()
    .get('/', getAllSpecialties)
    .post('/', upload.single('file'),
        (req: Request, res: Response, next: NextFunction) => {
            req.body = CreateSpecialtiesSchema.parse(JSON.parse(req.body.data))
            return createSpecialty(req, res, next)
        })
    .delete('/:id', checkAuth(UserRole.ADMIN, UserRole.ADMIN), deleteSpecialty)