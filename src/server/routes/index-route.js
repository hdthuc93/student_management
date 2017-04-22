import express from 'express';
import userRoutes from './user-route';

const router = express.Router();

router.route('/').get((req, res) => {
    res.json({ success: true, mes: 'route' });
});

router.use('/user', userRoutes);

export default router;