import express from 'express'
const router = express.Router()

import { recebimentoReport } from '../controllers/recebimentoController.js';




router.post('/report', recebimentoReport)

export default router;