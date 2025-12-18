const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

// Configuración de Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Conectado"))
    .catch(err => console.log("Error de conexión:", err));

// IMPORTANTE: Definición de rutas (Solo una vez cada una)
app.use('/api/auth', require('./routes/authRoutes')); 
app.use('/api/tasks', require('./routes/taskRoutes'));

// Ruta de prueba para verificar que el backend responde
app.get('/', (req, res) => {
    res.send("API funcionando correctamente");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));