import express from 'express'
const router = express.Router();

import { addCidade } from '../controllers/cidadeController.js';


router.post('/addCidade', addCidade);

export default router;