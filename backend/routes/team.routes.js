// backend/routes/team.routes.js
import { Router } from 'express';
import multer from 'multer';
import { verifyToken } from '../middlewares/auth.middleware.js';
import {
  getTeam,
  createTeamMember,
  updateTeamMember,
  toggleTeamStatus,
} from '../controllers/team.controller.js';

const router = Router();

/**
 * SEGURIDAD MULTER: Límite de 5MB y filtro exclusivo de imágenes.
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      cb(null, true);
    } else {
      cb(
        new Error('Formato de imagen no soportado. Sólo JPG, PNG y WEBP.'),
        false,
      );
    }
  },
});

// GET: La obtención del equipo es pública (Para la sección "ADN Mood")
router.get('/', getTeam);

// POST, PUT, PATCH: Edición desde el CMS, REQUIEREN TOKEN
router.post('/', verifyToken, upload.single('image_url'), createTeamMember);
router.put('/:id', verifyToken, upload.single('image_url'), updateTeamMember);
router.patch('/:id/status', verifyToken, toggleTeamStatus);

export default router;
