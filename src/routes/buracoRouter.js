const express = require('express')
const router = express.Router()

const {retornarTodosBuracos, verificarCidade} = require('../controllers/buracoController')


router.get('/retornartodosburacos', retornarTodosBuracos)
router.get('/verificarCidade', verificarCidade)



module.exports = router