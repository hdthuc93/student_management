import express from 'express';
import userRoutes from './user-route';
import studentRoutes from './student-route';
import student_classRoutes from './student_class-route';
import subjectRoutes from './subject-route';
import schoolYearRoutes from './school_year-route';
import auth from '../middlewares/authentication';
import { generateStudentID } from '../utilities/id_generates';

const router = express.Router();

router.route('/')
    .get((req, res) => {
        generateStudentID()
        .then((result) => {
             res.status(200).json({ 
                success: true,
                mes: 'route', 
                quantity: result 
            });
        });
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
router.use('/subject', subjectRoutes);
router.use('/school_year', schoolYearRoutes);

export default router;