import express from 'express';
import rateLimit from 'express-rate-limit';
import { submitContact } from '../controllers/contact.controller.js';

const router = express.Router();

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 15,
  message: { error: 'Demasiados intentos. Por favor, intenta más tarde.' },
});

// Ruta: POST /api/contacto
router.post('/', apiLimiter, submitContact);

export default router;
