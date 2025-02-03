const Usuarios = require('../models/usuarios.models');
const mongoose = require('mongoose');  
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const saveUsuario = async (req, res) => {
    try {
        const { nombre, tipo, CI, estado, clave } = req.body;

        // Verificar si el CI ya está registrado
        const usuarioExistente = await Usuarios.findOne({ CI });
        if (usuarioExistente) {
            return res.status(400).json({ message: 'El CI ya está registrado.' });
        }

        // Hashear la contraseña antes de guardarla
        const claveHasheada = await bcrypt.hash(clave, 10);

        const nuevoUsuario = new Usuarios({
            nombre,
            tipo,
            CI,
            estado: estado || 'contratado',
            clave: claveHasheada  
        });

        const usuarioGuardado = await nuevoUsuario.save();
        res.status(201).json(usuarioGuardado);
    } catch (error) {
        res.status(500).json({ message: 'Error al guardar el usuario', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { CI, clave } = req.body;

        // Buscar usuario por CI
        const usuario = await Usuarios.findOne({ CI });
        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // Comparar contraseña ingresada con la almacenada (encriptada)
        const claveValida = await bcrypt.compare(clave, usuario.clave);
        if (!claveValida) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        // Generar token JWT
        const token = jwt.sign(
            { usuarioId: usuario._id },  
            'tu_secreto_secreto',       
            { expiresIn: '1h' }      
        );

        res.status(200).json({ token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: "Acceso denegado. No hay token." });
    }

    try {
        const tokenLimpio = token.replace("Bearer ", ""); // Limpiar el token si viene con "Bearer"
        const decoded = jwt.verify(tokenLimpio, 'tu_secreto_secreto'); // Verificar el token
        req.usuarioId = decoded.usuarioId; // Guardar el usuarioId en la request
        next();
    } catch (error) {
        res.status(403).json({ error: "Token inválido." });
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

module.exports = { saveUsuario, cambiarEstado, login, authMiddleware };
