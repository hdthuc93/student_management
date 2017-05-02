import express from 'express';
import userRoutes from './user-route';
import studentRoutes from './student-route';
import student_classRoutes from './student_class-route';
import auth from '../middlewares/authentication';

const router = express.Router();

router.route('/')
    .get((req, res) => {
        res.status(200).json({ success: true, mes: 'route' });
    })
    .post(auth.authenToken, (req, res) => {
        res.status(200).json({
            success: true, 
            message: 'Authentication successfully'
        })
    });

router.use('/user', userRoutes);
router.use('/student', studentRoutes);
router.use('/student_class', student_classRoutes);

export default router;