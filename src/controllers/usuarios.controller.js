const Usuarios = require('../models/usuarios.models');
const mongoose = require('mongoose');  

const saveUsuario = async (req, res) => {
    try {
        const { nombre, tipo, CI, estado } = req.body;
        const nuevoUsuario = new Usuarios({
            nombre,
            tipo,
            CI,
            estado: estado || 'contratado' 
        });
        const usuarioGuardado = await nuevoUsuario.save();
        res.status(201).json(usuarioGuardado);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'El CI ya está registrado.' });
        }
        res.status(500).json({ message: 'Error al guardar el usuario', error: error.message });
    }
};

const cambiarEstado = async (req, res) => {
    try {
        const { id } = req.params; 
        const usuario = await Usuarios.findById(id);

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const nuevoEstado = usuario.estado === 'contratado' ? 'despedido' : 'contratado';
        usuario.estado = nuevoEstado;
        await usuario.save();

        res.status(200).json({ message: `Estado del usuario actualizado a ${nuevoEstado}`, usuario });
    } catch (error) {
        res.status(500).json({ message: 'Error al alternar el estado del usuario', error: error.message });
    }
};

module.exports = { saveUsuario, cambiarEstado };