import express from 'express';
import userRoutes from './user-route';
import studentRoutes from './student-route';
import classRoutes from './class-route';
import student_classRoutes from './student_class-route';
import subjectRoutes from './subject-route';
import gradeRoutes from './grade-route';
import semesterRoutes from './semester-route';
import schoolYearRoutes from './school_year-route';
import auth from '../middlewares/authentication';
import { generateStudentID } from '../utilities/id_generates';
import commonObj from '../utilities/common_object';

const router = express.Router();

router.route('/')
    .get((req, res) => {
        
             res.status(200).json({ 
                success: true,
                mes: 'route', 
                quantity: commonObj 
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
router.use('/class', classRoutes);
router.use('/student_class', student_classRoutes);
router.use('/subject', subjectRoutes);
router.use('/school_year', schoolYearRoutes);
router.use('/grade', gradeRoutes);
router.use('/semester', semesterRoutes);

export default router;