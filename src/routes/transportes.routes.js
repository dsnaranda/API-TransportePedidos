const express = require('express');
const router = express.Router();

const TrasnporteController = require('../controllers/transportes.controller');
const UsuariosController = require('../controllers/usuarios.controller');

router.post('/save', UsuariosController.authMiddleware, TrasnporteController.saveTransporte);
router.get('/pendiente', UsuariosController.authMiddleware, TrasnporteController.getTransportesPendientes);
router.get('/facturado', UsuariosController.authMiddleware, TrasnporteController.getTransportesFacturados);
router.get('/no-facturado', UsuariosController.authMiddleware, TrasnporteController.getTransportesNoFacturados);
router.get('/usuario/:usuarioId', UsuariosController.authMiddleware, TrasnporteController.ingresadosPorUserID);
router.get('/semana/:semana', UsuariosController.authMiddleware, TrasnporteController.calcularGananciaPorSemana);
router.get('/factura/:id', UsuariosController.authMiddleware, TrasnporteController.generarFacturaPorId);

module.exports=router;