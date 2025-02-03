const express = require('express');
const router = express.Router();

const VehiculosController = require('../controllers/vehiculos.controller');

router.post('/save', VehiculosController.saveVehiculo);

module.exports=router;