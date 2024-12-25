import express from 'express';
import { dashboard } from '../controllers/dashboardController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { addNewProperty } from "../controllers/propertyController.js";
import { manageProperty } from '../controllers/dashboardController.js';


const router = express.Router();

router.get('/dashboard', requireAuth, dashboard);
router.get('/owner/property/:p_id', manageProperty);
router.post("/add-property", requireAuth, addNewProperty);

export default router;