require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const faqRoutes = require('./routes/faqRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Conectar DB
connectDB();

// Rutas
app.use('/api/faqs', faqRoutes);

// Root endpoint opcional
app.get('/', (req, res) => {
  res.send('📡 API funcionando correctamente');
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
