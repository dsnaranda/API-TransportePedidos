const mongoose = require('mongoose');
const { Schema } = mongoose;

const TransporteSchema = new Schema({
    semana: { type: String, required: true }, // Semana para identificar el periodo
    fecha: { type: Date, default: Date.now }, // Fecha de ingreso del registro
    origen: { type: String, required: true }, // Origen (puede ser cualquier string)
    destino: { type: String, required: true }, // Destino que se comparará con la tarifa
    capacidad: { type: String, required: true }, // Capacidad que se comparará con la tarifa
    precioReal: { type: mongoose.Types.Decimal128, required: true }, // Precio real de la tarifa
    precioTRANSPALFRA: { type: mongoose.Types.Decimal128, required: true }, // Precio con el descuento del 8%
    viaticos: { type: mongoose.Types.Decimal128, required: true }, // Viáticos, no pueden ser mayores que precioTRANSPALFRA
    detallesDestino: { type: String }, // Detalles del destino (opcional)
    cusodioaestiba: { type: String }, // Cusodioaestiba (opcional)
    guia: { type: String, required: true }, // Una o varias guías separadas por "-"
    leyenda: { type: String, required: true }, // Leyenda generada automáticamente
    ingresadoPor: { type: Schema.Types.ObjectId, ref: 'Usuarios', required: true }, // ID del usuario que ingresó el registro
    observacion: { type: String }, // Observación (opcional)
    estado: { type: String, enum: ['Facturado', 'No facturado', 'Pendiente'], required: true }, // Estado del registro
    vehiculo: { type: String, required: true }, // Placa del vehículo (debe existir en la colección Vehículos)
    //precioFinal: { type: mongoose.Types.Decimal128, required: true }, // Precio final después de los honorarios del conductor
});

module.exports = mongoose.model('Transporte', TransporteSchema, 'transportes');
