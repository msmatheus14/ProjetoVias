const express = require('express')
const router = express.Router()

const {retornarTodosBuracos, alterarStatusBuracoPorRua} = require('../controllers/buracoController')


router.get('/retornartodosburacos', retornarTodosBuracos)
router.put('/alterarstatus', alterarStatusBuracoPorRua)


module.exports = router