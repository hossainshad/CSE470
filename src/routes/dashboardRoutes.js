import express from 'express';
import { dashboard } from '../controllers/dashboardController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', requireAuth, dashboard);

export default router;
