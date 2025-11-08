import express from 'express'
const router = express.Router()

import { addUsuario, retornarUsuarios, validarUsuario } from '../controllers/usuarioController.js';

router.post('/addUsuario', addUsuario)
router.get('/retornarUsuarios', retornarUsuarios)
router.post('/validarUsuario', validarUsuario)

export default router;  