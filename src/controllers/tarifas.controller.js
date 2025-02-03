const Tarifas = require('../models/tarifas.models');
const mongoose = require('mongoose');  

const saveTarifa = async (req, res) => {
    try {
        const { destino, capacidad, tarifa } = req.body;

        const capacidadesValidas = [
            "2000", "2700", "3000", "4000", "5000", "6000", "7000",
            "Trailer F-40", "Trailer F-50", "Trailer F-53"
        ];

        if (!capacidadesValidas.includes(capacidad)) {
            return res.status(400).json({ message: 'Capacidad no válida' });
        }

        const nuevaTarifa = new Tarifas({
            destino,
            capacidad,
            tarifa: mongoose.Types.Decimal128.fromString(parseFloat(tarifa).toFixed(2)), 
        });

        const tarifaGuardada = await nuevaTarifa.save();
        const tarifaFormateada = tarifaGuardada.tarifa.toString();
        res.status(201).json({
            ...tarifaGuardada.toObject(),
            tarifa: parseFloat(tarifaFormateada)
        });

    } catch (error) {
        res.status(500).json({ message: 'Error al guardar la tarifa', error: error.message });
    }
};

module.exports = { saveTarifa };
