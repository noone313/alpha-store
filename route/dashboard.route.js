import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { dashboard } from '../controller/dashboard.controller.js';
const dashboardRouter = Router();


dashboardRouter.get("/dashboard",verifyToken,dashboard);

export { dashboardRouter };