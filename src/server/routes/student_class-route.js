import express from 'express';
import student_classCtrl from '../controllers/student_class-controller';
import validation from '../middlewares/validation'


const router = express.Router();

router.route('/addStu')
    .post(
        student_classCtrl.addInClass
    );

router.route('/delStu')
    .delete(
        student_classCtrl.delInClass
    );


export default router;