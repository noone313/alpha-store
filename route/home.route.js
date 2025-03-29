import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { home } from '../controller/home.controller.js';
const homeRouter = Router();

homeRouter.get('/',verifyToken, home);

export { homeRouter };