const mongoose = require('mongoose');
const { Schema } = mongoose; 

const TarifasSchema = new Schema({
    destino: { type: String, required: true },
    capacidad: { type: String, required: true, enum: [ 
        "2000", "2700", "3000", "4000", "5000", "6000", "7000",
        "Trailer F-40", "Trailer F-50", "Trailer F-53"
    ] }, 
    tarifa: { type: mongoose.Types.Decimal128, required: true },
});

module.exports = mongoose.model('Tarifas', TarifasSchema, 'tarifas');  