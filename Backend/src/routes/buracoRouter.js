import express from 'express'
const router = express.Router()

import { retornarTodosBuracos, verificarCidade, reabrirtodosburacos , excluirTodosBuracos, fecharBuracoPorID, retornarEstadosBuracos} from '../controllers/buracoController.js';



router.get('/retornartodosburacos', retornarTodosBuracos)
router.get('/retornarestados', retornarEstadosBuracos)
router.get('/verificarCidade', verificarCidade)
router.put('/reabrirtodosburacos', reabrirtodosburacos)
router.delete('/excluirtodosburacos', excluirTodosBuracos)
router.put('/fecharBuracoPorID/:id', fecharBuracoPorID)



export default router;