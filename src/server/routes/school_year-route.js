import express from 'express';
import schoolYearCtrl from '../controllers/school_year-controller';
import validation from '../middlewares/validation'


const router = express.Router();

router.route('/')
    .get(
        schoolYearCtrl.getSchoolYear
    )

export default router;