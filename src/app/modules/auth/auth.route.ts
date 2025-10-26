import express, { Router } from 'express'
import { changePassword, forgotPassword, getMe, login, refreshToken, resetPassword } from './auth.controller';
import { UserRole } from '@prisma/client';
import { checkAuth } from '../../middlewares/checkAuth';


// AUTH ROUTES
export const AuthRoutes = Router()
    .get("/me", getMe)
    .post("/login", login)
    .post('/refresh-token', refreshToken)
    .post('/change-password', checkAuth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT), changePassword)
    .post('/forgot-password', forgotPassword)
    .post('/reset-password', resetPassword)