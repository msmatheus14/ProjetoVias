const express = require('express')
const router = express.Router()

const {retornarTodosBuracos} = require('../controllers/buracoController')


router.get('/retornartodosburacos', retornarTodosBuracos)


module.exports = router