import express from 'express';
import { getRegisterPage, registerUser } from '../controllers/registerController.js';

const router = express.Router();

router.get('/register', getRegisterPage);
router.post('/register', registerUser);

export default router;
