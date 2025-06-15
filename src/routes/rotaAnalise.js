const express = require('express');
const router = express.Router();

const { returnQuantReport, scoreReport} = require('../controllers/analiseController');

router.get('/totalreport', returnQuantReport);
router.get('/scorevias', scoreReport)

module.exports = router;