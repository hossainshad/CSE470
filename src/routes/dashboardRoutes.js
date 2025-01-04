import express from 'express';

import { requireAuth } from '../middlewares/authMiddleware.js';
import { addNewProperty } from "../controllers/propertyController.js";

import { addFlat } from '../controllers/flatController.js';
import { upload } from '../middlewares/uploadMiddleware.js'
import { dashboard, showOwnerInfo, manageProperty } from '../controllers/dashboardController.js';
const router = express.Router();

router.get('/dashboard', requireAuth, dashboard);
router.get('/owner-info', requireAuth, showOwnerInfo);
router.get('/owner/property/:p_id', manageProperty);
router.post("/add-property", requireAuth, addNewProperty);

router.post('/owner/property/:p_id/add-flat', requireAuth, upload, addFlat);
export default router;