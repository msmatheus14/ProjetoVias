import express from 'express';
import { returnQuantReport, scoreReport, historicoReport} from '../controllers/analiseController.js';

const router = express.Router();

router.get('/totalreport', returnQuantReport);
router.get('/scorevias', scoreReport);
router.get('/historico', historicoReport);

export default router;
