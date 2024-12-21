import express from 'express';
import { dashboard } from '../controllers/dashboardController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { addNewProperty } from "../controllers/propertyController.js";

const router = express.Router();

router.get('/dashboard', requireAuth, dashboard);
router.post("/add-property", requireAuth, addNewProperty);

export default router;