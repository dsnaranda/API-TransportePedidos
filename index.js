const express = require('express');
const mongoose = require('mongoose');
const tarifasRoutes = require('./src/routes/tarifas.routes');
const usuariosRoutes = require('./src/routes/usuarios.routes');
const vehiculosRoutes = require('./src/routes/vehiculos.routes');
const transportesRoutes = require('./src/routes/transportes.routes');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.use('/tarifas', tarifasRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/vehiculos', vehiculosRoutes);
app.use('/transportes', transportesRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conexión a MongoDB exitosa'))
  .catch((err) => console.error('Error al conectar a MongoDB:', err));

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`)
})