const Vehiculos = require('../models/vehiculos.models'); 
const mongoose = require('mongoose');

const saveVehiculo = async (req, res) => {
    try {
        const { placavehiculo, honorarioConductor, nombreConductor } = req.body;
        const honorario = mongoose.Types.Decimal128.fromString(parseFloat(honorarioConductor).toFixed(2));

        const nuevoVehiculo = new Vehiculos({
            placavehiculo,
            honorarioConductor: honorario,
            nombreConductor
        });

        const vehiculoGuardado = await nuevoVehiculo.save();
        const vehiculoResponse = {
            ...vehiculoGuardado.toObject(),
            honorarioConductor: parseFloat(vehiculoGuardado.honorarioConductor.toString()) 
        };

        res.status(201).json(vehiculoResponse);
    } catch (error) {
        if (error.code === 11000) { 
            return res.status(400).json({ message: 'La placa del vehículo ya está registrada.' });
        }
        res.status(500).json({ message: 'Error al guardar el vehículo', error: error.message });
    }
};


module.exports = { saveVehiculo };
