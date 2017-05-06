import express from 'express';
import subjectCtrl from '../controllers/subject-controller';
import validation from '../middlewares/validation'


const router = express.Router();

router.route('/score')
    .get(
        subjectCtrl.getScores
    )
    .post(
        subjectCtrl.addScores
    );


export default router;