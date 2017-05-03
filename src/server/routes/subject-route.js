import express from 'express';
import subjectCtrl from '../controllers/subject-controller';
import validation from '../middlewares/validation'


const router = express.Router();

router.route('/score')
    .post(
        subjectCtrl.addScores
    );


export default router;