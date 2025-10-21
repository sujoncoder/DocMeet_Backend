import { Router, NextFunction, Request, Response } from 'express';
import { UserRole } from '@prisma/client';
import { upload } from '../../utils/multerConfig';
import { checkAuth } from '../../middlewares/checkAuth';
import { createSpecialties, deleteSpecialties, getAllSpecialties } from './specialties.controller';
import { createSpecialtiesZod } from './specialties.validation';


// SPECIALTIES ROUTES
export const specialtiesRoutes = Router()

    .get('/', getAllSpecialties)
    .post('/', upload.single('file'),
        (req: Request, res: Response, next: NextFunction) => {
            req.body = createSpecialtiesZod.parse(JSON.parse(req.body.data))
            return createSpecialties(req, res, next)
        }
    )

    .delete('/:id', checkAuth(UserRole.ADMIN, UserRole.ADMIN), deleteSpecialties)