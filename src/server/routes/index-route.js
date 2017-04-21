import userCtrl from '../controllers/user_controller';
import express from 'express';

const router = express.Router();

router.route('/').get((req, res) => {
    res.json({ success: true, mes: 'route' });
});

router.route('/register').post(userCtrl.register);

export default router;