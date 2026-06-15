// backend/routes/projects.routes.js
import { Router } from 'express';
import multer from 'multer';
import { verifyToken } from '../middlewares/auth.middleware.js'; // 🌟 SEGURIDAD
import {
  getProjects,
  createProject,
  toggleProjectStatus,
  updateProject,
} from '../controllers/projects.controller.js';

const router = Router();

/**
 * 🌟 SEGURIDAD MULTER: Límite de 5MB y filtro exclusivo de imágenes.
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      cb(null, true);
    } else {
      cb(new Error('Formato de imagen no soportado.'), false);
    }
  },
});

// GET: La obtención de proyectos puede ser pública (para que se vean en la web)
router.get('/', getProjects);

// POST, PATCH, PUT: Todo esto es edición del CMS, DEBE estar protegido
router.post('/', verifyToken, upload.single('img_url'), createProject);
router.patch('/:id/status', verifyToken, toggleProjectStatus);
router.put('/:id', verifyToken, upload.single('img_url'), updateProject);

export default router;
