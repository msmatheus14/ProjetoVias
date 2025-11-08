
import express from 'express'
const router = express.Router()

import { addRua, retornarRua, alterarBuracosPorRua } from '../controllers/ruaController.js';




router.post('/addRua', addRua)
router.get('/getruas', retornarRua)
router.put('/updateRuas', alterarBuracosPorRua)


export default router;