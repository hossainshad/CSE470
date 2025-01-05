import express from 'express';
import {
    getMaintenanceRequests,
    submitMaintenanceRequest,
    approveMaintenanceRequest,
    declineMaintenanceRequest,
    markMaintenanceCompleted
} from '../controllers/maintenanceController.js';

const router = express.Router();

router.get('/maintenance', getMaintenanceRequests);
router.get('/maintenance-requests', getMaintenanceRequests);
router.post('/submit-maintenance-request', submitMaintenanceRequest);
router.post('/maintenance/approve/:requestId', approveMaintenanceRequest);
router.post('/maintenance/decline/:requestId', declineMaintenanceRequest);
router.post('/maintenance/completed/:requestId', markMaintenanceCompleted);

export default router;
