import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';

// Importamos nuestras rutas
import contactRoutes from './routes/contact.routes.js';
import countryRoutes from './routes/country.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares Globales
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    optionsSuccessStatus: 200,
  }),
);

// Montamos las rutas
app.use('/api/contacto', contactRoutes);
app.use('/api/countries', countryRoutes);

// Iniciamos el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor Backend corriendo en http://localhost:${PORT}`);
});
