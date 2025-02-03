const mongoose = require('mongoose');
const { Schema } = mongoose;

const UsuariosSchema = new Schema({
    nombre: { type: String, required: true },
    tipo: { type: String, enum: ['administrador', 'cajero'], required: true },
    CI: { type: String, required: true, unique: true },
    estado: { type: String, enum: ['contratado', 'despedido'], required: true, default: 'contratado' }
});

module.exports = mongoose.model('Usuarios', UsuariosSchema, 'usuarios');  