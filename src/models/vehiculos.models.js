const mongoose = require('mongoose');
const { Schema } = mongoose;

const VehiculosSchema = new Schema({
    placavehiculo: { type: String, required: true, unique: true },
    honorarioConductor: { type: mongoose.Types.Decimal128, required: true },
    nombreConductor: { type: String, required: true },
});

module.exports = mongoose.model('Vehiculos', VehiculosSchema, 'vehiculos');
