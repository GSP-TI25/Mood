import { Router } from 'express';
import { login, createFirstAdmin } from '../controllers/auth.controller.js';

const router = Router();

// Ruta pública para iniciar sesión
router.post('/login', login);

export default router;
