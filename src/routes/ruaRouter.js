

const express = require('express')
const router = express.Router()

const {addRua, retornarRua, alterarBuracosPorRua} = require('../controllers/ruaController')


router.post('/addRua', addRua)
router.get('/getruas', retornarRua)
router.put('/updateRuas', alterarBuracosPorRua)


module.exports = router