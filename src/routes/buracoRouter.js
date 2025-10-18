import express from 'express'
const router = express.Router()

import { retornarTodosBuracos, verificarCidade, reabrirtodosburacos  } from '../controllers/buracoController.js';



router.get('/retornartodosburacos', retornarTodosBuracos)
router.get('/verificarCidade', verificarCidade)
router.put('/reabrirtodosburacos', reabrirtodosburacos)



export default router;