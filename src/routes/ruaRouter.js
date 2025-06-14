

const express = require('express')
const router = express.Router()

const {addRua} = require('../controllers/ruaController')


router.post('/addRua', addRua)




module.exports = router