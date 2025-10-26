import { Router } from 'express'
import { UserRole } from '@prisma/client';
import { checkAuth } from '../../middlewares/checkAuth';
import { createReview, getAllReviews } from './review.controller';


// REVIEW ROUTES
export const ReviewRoutes = Router()
    .get('/', getAllReviews)
    .post('/', checkAuth(UserRole.PATIENT), createReview)