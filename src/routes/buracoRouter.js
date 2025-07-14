import express from 'express'
const router = express.Router()

import { retornarTodosBuracos, verificarCidade } from '../controllers/buracoController.js';



router.get('/retornartodosburacos', retornarTodosBuracos)
router.get('/verificarCidade', verificarCidade)



export default router;