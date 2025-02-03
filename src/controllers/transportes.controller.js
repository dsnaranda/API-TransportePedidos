const Transporte = require('../models/transportes.models');
const Tarifas = require('../models/tarifas.models');
const Vehiculos = require('../models/vehiculos.models');
const Usuarios = require('../models/usuarios.models');
const mongoose = require('mongoose');

const saveTransporte = async (req, res) => {
    try {
        const {
            semana,
            origen,
            destino,
            capacidad,
            viaticos,
            detallesDestino,
            cusodioaestiba,
            guia,
            ingresadoPor,
            observacion,
            estado,
            vehiculo,
        } = req.body;

        // Validar que el destino y capacidad existan en la colección tarifas
        const tarifa = await Tarifas.findOne({ destino, capacidad });
        if (!tarifa) {
            return res.status(400).json({ message: 'Destino y capacidad no coinciden con las tarifas disponibles' });
        }

        // Verificar que el usuario que ingresa el registro exista
        const usuario = await Usuarios.findById(ingresadoPor);
        if (!usuario) {
            return res.status(400).json({ message: 'El usuario que ingresa el registro no existe' });
        }

        // Verificar que el vehículo exista
        const vehiculoData = await Vehiculos.findOne({ placavehiculo: vehiculo });
        if (!vehiculoData) {
            return res.status(400).json({ message: 'El vehículo no está registrado' });
        }

        // Obtener el precio real de la tarifa
        const precioReal = tarifa.tarifa;

        // Calcular el precioTRANSPALFRA (descuento del 8%) y redondear a dos decimales
        const precioTRANSPALFRA = parseFloat((precioReal * 0.92).toFixed(2));

        // Validar que los viáticos no sean mayores que el precioTRANSPALFRA ni negativos
        if (viaticos < 0 || viaticos > precioTRANSPALFRA) {
            return res.status(400).json({ message: 'Los viáticos no pueden ser mayores que el precioTRANSPALFRA ni negativos' });
        }

        // Generar la leyenda con las guías
        const leyenda = `1 viaja a ${destino} G# ${guia}`;

        // Obtener los honorarios del conductor del vehículo y convertir a número
        const honorarioConductor = parseFloat(vehiculoData.honorarioConductor.toString()).toFixed(2);

        // const precioFinal = parseFloat((precioTRANSPALFRA - honorarioConductor).toFixed(2));

        // Crear el nuevo registro de transporte
        const nuevoTransporte = new Transporte({
            semana,
            fecha: new Date(),
            origen,
            destino,
            capacidad,
            precioReal,
            precioTRANSPALFRA: mongoose.Types.Decimal128.fromString(precioTRANSPALFRA.toString()),
            viaticos,
            detallesDestino,
            cusodioaestiba,
            guia,
            leyenda,
            ingresadoPor,
            observacion,
            estado,
            vehiculo,
            // precioFinal: mongoose.Types.Decimal128.fromString(precioFinal.toString())
        });

        // Guardar el registro en la base de datos
        const transporteGuardado = await nuevoTransporte.save();
        res.status(201).json(transporteGuardado);

    } catch (error) {
        res.status(500).json({ message: 'Error al guardar el registro de transporte', error: error.message });
    }
};

// Obtener transportes con estado "Pendiente"
const getTransportesPendientes = async (req, res) => {
    try {
        const transportes = await Transporte.find({ estado: 'Pendiente' });
        res.status(200).json(transportes);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los transportes pendientes', error: error.message });
    }
};

// Obtener transportes con estado "Facturado"
const getTransportesFacturados = async (req, res) => {
    try {
        const transportes = await Transporte.find({ estado: 'Facturado' });
        res.status(200).json(transportes);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los transportes facturados', error: error.message });
    }
};

// Obtener transportes con estado "No facturado"
const getTransportesNoFacturados = async (req, res) => {
    try {
        const transportes = await Transporte.find({ estado: 'No facturado' });
        res.status(200).json(transportes);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los transportes no facturados', error: error.message });
    }
};

// Método para obtener transportes de un usuario
const ingresadosPorUserID = async (req, res) => {
    try {
        const usuarioId = req.params.usuarioId;
        const usuario = await Usuarios.findById(usuarioId);

        if (!usuario) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        const transportes = await Transporte.find({ ingresadoPor: usuarioId });
        res.status(200).json({
            usuario: {
                nombre: usuario.nombre,
                tipo: usuario.tipo
            },
            transportes
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los transportes', error: error.message });
    }
};

const calcularGananciaPorSemana = async (req, res) => {
    try {
        let semana = req.params.semana;  

        // Convertir 'semana-1' a 'Semana 1'
        semana = semana.replace('semana-', 'Semana ');

        // Obtener todos los transportes de esa semana
        const transportes = await Transporte.find({ semana });

        // Variables para los detalles
        let totalViaticos = 0;
        let totalHonorariosConductor = 0;
        let detallesTransportes = [];
        let utilidadTotal = 0; 
        let gananciaTotalSemana = 0; 

    
        for (const transporte of transportes) {
            const precioTRANSPALFRA = parseFloat(transporte.precioTRANSPALFRA.toString());
            const viaticos = parseFloat(transporte.viaticos) || 0;  
            const vehiculo = await Vehiculos.findOne({ placavehiculo: transporte.vehiculo });

            const honorarioConductor = vehiculo ? parseFloat(vehiculo.honorarioConductor.toString()) : 0;

            totalViaticos += viaticos;
            totalHonorariosConductor += honorarioConductor;

            // Detalles de cada transporte
            detallesTransportes.push({
                guia: transporte.guia,
                precioTRANSPALFRA,
                viaticos,
                honorarioConductor,
                precioFinal: precioTRANSPALFRA - viaticos - honorarioConductor
            });

            // Sumar la utilidad total (precioTRANSPALFRA - viaticos)
            utilidadTotal += precioTRANSPALFRA - viaticos;

            // Sumar la ganancia total de la semana (precioTRANSPALFRA - viaticos - honorarios del conductor)
            gananciaTotalSemana += precioTRANSPALFRA - viaticos - honorarioConductor;
        }

        res.status(200).json({
            semana,
            utilidadTotal: utilidadTotal.toFixed(2),  
            gananciaTotalSemana: gananciaTotalSemana.toFixed(2), 
            totalTransportes: transportes.length,
            totalViaticos: totalViaticos.toFixed(2),  
            totalHonorariosConductor: totalHonorariosConductor.toFixed(2),  
            detallesTransportes
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al calcular la ganancia', error: error.message });
    }
};

const generarFacturaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar el transporte por su ID
        const transporte = await Transporte.findById(id);
        if (!transporte) {
            return res.status(404).json({ message: 'Transporte no encontrado' });
        }

        // Buscar el vehículo para obtener su honorario
        const vehiculo = await Vehiculos.findOne({ placavehiculo: transporte.vehiculo });
        const honorarioConductor = vehiculo ? parseFloat(vehiculo.honorarioConductor.toString()) : 0;

        // Calcular precio final
        const precioTRANSPALFRA = parseFloat(transporte.precioTRANSPALFRA.toString());
        const viaticos = parseFloat(transporte.viaticos) || 0;
        const precioFinal = precioTRANSPALFRA - viaticos - honorarioConductor;

        // Formatear los valores a dos decimales
        const factura = {
            destino: transporte.destino,
            guia: transporte.guia,
            precioFinal: precioFinal.toFixed(2)
        };

        res.status(200).json(factura);
    } catch (error) {
        res.status(500).json({ message: 'Error al generar la factura', error: error.message });
    }
};

module.exports = {
    saveTransporte,
    getTransportesPendientes,
    getTransportesFacturados,
    getTransportesNoFacturados,
    ingresadosPorUserID,
    calcularGananciaPorSemana,
    generarFacturaPorId
};