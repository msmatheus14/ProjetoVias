const express = require('express')
const router = express.Router()
const recebimentoController = require('../controllers/recebimentoController')


router.post('/report', recebimentoController.recebimentoReport)

module.exports = router