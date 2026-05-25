import { Router } from 'express';
import {
  getJobs,
  getJobById,
  createJob,
} from '../controllers/jobs.controller.js';

const router = Router();

// GET: /api/jobs -> Devuelve todas las vacantes para la tabla principal
router.get('/', getJobs);

// GET: /api/jobs/:id -> Devuelve una vacante específica con todos sus detalles (JobDetail)
router.get('/:id', getJobById);

// POST: /api/jobs -> Crea una nueva vacante completa con detalles (CMS)
// ⚠️ Nota: En el próximo paso protegeremos esta ruta mediante un middleware para asegurar que solo RRHH publique
router.post('/', createJob);

export default router;
