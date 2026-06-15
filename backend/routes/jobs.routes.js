// backend/routes/jobs.routes.js
import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js'; // 🌟 SEGURIDAD
import {
  getJobs,
  getJobById,
  createJob,
  toggleJobStatus,
  updateJob,
} from '../controllers/jobs.controller.js';

const router = Router();

// GET: Obtención de vacantes pública para que los candidatos las vean en la web
router.get('/', getJobs);
router.get('/:id', getJobById);

// POST, PATCH, PUT: Edición desde el CMS, protegidas
router.post('/', verifyToken, createJob);
router.patch('/:id/status', verifyToken, toggleJobStatus);
router.put('/:id', verifyToken, updateJob);

export default router;
