const express = require('express');
const router = express.Router();

const TrasnporteController = require('../controllers/transportes.controller');

router.post('/save', TrasnporteController.saveTransporte);
router.get('/pendiente', TrasnporteController.getTransportesPendientes);
router.get('/facturado', TrasnporteController.getTransportesFacturados);
router.get('/no-facturado', TrasnporteController.getTransportesNoFacturados);
router.get('/usuario/:usuarioId', TrasnporteController.ingresadosPorUserID);
router.get('/semana/:semana', TrasnporteController.calcularGananciaPorSemana);
router.get('/factura/:id', TrasnporteController.generarFacturaPorId);

module.exports=router;