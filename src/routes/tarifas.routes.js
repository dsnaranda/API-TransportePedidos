const express = require('express');
const router = express.Router();

const tarifasController = require('../controllers/tarifas.controller');

router.post('/save', tarifasController.saveTarifa);

module.exports=router;