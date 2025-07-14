import express from 'express';
import { returnQuantReport, scoreReport } from '../controllers/analiseController.js';

const router = express.Router();

router.get('/totalreport', returnQuantReport);
router.get('/scorevias', scoreReport);

export default router;
