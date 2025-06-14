const express = require('express');
const router = express.Router();

const { returnQuantReport } = require('../controllers/analiseController');

router.get('/totalreport', returnQuantReport);

module.exports = router;