import express from 'express'
const router = express.Router()

import { retornarTodosBuracos, verificarCidade, reabrirtodosburacos , excluirTodosBuracos, fecharBuracoPorID} from '../controllers/buracoController.js';



router.get('/retornartodosburacos', retornarTodosBuracos)
router.get('/verificarCidade', verificarCidade)
router.put('/reabrirtodosburacos', reabrirtodosburacos)
router.delete('/excluirtodosburacos', excluirTodosBuracos)
router.put('/fecharBuracoPorID/:id', fecharBuracoPorID)



export default router;