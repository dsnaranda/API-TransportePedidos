const express = require('express');
const router = express.Router();

const UsuariosController = require('../controllers/usuarios.controller');

router.post('/saveUser', UsuariosController.saveUsuario);
router.put('/cambiarEstado/:id', UsuariosController.cambiarEstado);

module.exports=router;