const express = require('express');
const router = express.Router();

const {addCidade} = require('../controllers/cidadeController');

router.post('/addCidade', addCidade);

module.exports = router;