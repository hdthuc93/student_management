import express from 'express';
import studentCtrl from '../controllers/student-controller';
import validation from '../middlewares/validation'


const router = express.Router();

router.route('/create')
    .post(
        studentCtrl.create
    );


export default router;