import express from 'express'
const router = express.Router();

import { addCidade, verificarCidadePorRua} from '../controllers/cidadeController.js';


router.post('/addCidade', addCidade);
router.put('/verificarCidadePorRua', verificarCidadePorRua);

export default router;