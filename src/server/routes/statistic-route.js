import express from 'express';
import statisticCtrl from '../controllers/statistic-controller';
import validation from '../middlewares/validation'


const router = express.Router();

router.route('/semester')
    .get(
        statisticCtrl.getSemesterStatistic
    );

router.route('/subject')
    .get(
        statisticCtrl.getSubjectStatistic
    );

export default router;