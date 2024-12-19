import express from 'express';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();
const homepage= (req, res) => {
    const user = req.session.user;
    res.render('homepage', {user});
};
router.get('/homepage', requireAuth, homepage);

export default router;
