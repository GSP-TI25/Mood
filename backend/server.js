// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import process from 'process';

import contactRoutes from './routes/contact.routes.js';
import countryRoutes from './routes/country.routes.js';
import authRoutes from './routes/auth.routes.js';
import jobsRoutes from './routes/jobs.routes.js';
import applicationsRoutes from './routes/applications.routes.js';
import usersRoutes from './routes/users.routes.js';
import projectsRoutes from './routes/projects.routes.js';
import teamRoutes from './routes/team.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/**
 * 1. Middlewares de Seguridad Global
 */
// Helmet oculta cabeceras HTTP que revelan que usas Express y bloquea ataques XSS/Clickjacking
app.use(helmet());

// Limitamos el cuerpo del JSON a 50kb para evitar sobrecarga de RAM por ataques DoS
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

// Configuración estricta de CORS
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'https://www.mood.pe', // Añade tu dominio de producción aquí
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('No permitido por la política CORS'));
      }
    },
    optionsSuccessStatus: 200,
  }),
);

/**
 * 2. Rate Limiters (Prevención de Fuerza Bruta y DoS)
 */
// Límite general para toda la API (100 peticiones cada 15 minutos por IP)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    message:
      'Demasiadas peticiones desde esta IP, por favor intenta más tarde.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', generalLimiter);

// Límite estricto SOLO para el Login (Previene que adivinen contraseñas)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message:
      'Demasiados intentos de inicio de sesión. Cuenta bloqueada temporalmente por 15 minutos.',
  },
});

/**
 * 3. Montaje de Rutas
 */
app.use('/api/contacto', contactRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/auth', loginLimiter, authRoutes); // Aplicamos el limitador estricto aquí
app.use('/api/jobs', jobsRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/team', teamRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor Backend corriendo en el puerto ${PORT}`);
});
