// backend/routes/users.routes.js
import { Router } from 'express';
import multer from 'multer';
import { verifyToken } from '../middlewares/auth.middleware.js'; // 🌟 SEGURIDAD
import {
  getUsers,
  createUser,
  getRoles,
  updateUser,
  updateProfile,
} from '../controllers/users.controller.js';

const router = Router();

/**
 * 🌟 SEGURIDAD MULTER: Límite de 5MB y filtro exclusivo de imágenes.
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
  fileFilter: (req, file, cb) => {
    // Expresión regular para validar el Mimetype de la imagen
    if (file.mimetype.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      cb(null, true);
    } else {
      cb(new Error('Formato no soportado. Sólo JPG, PNG y WEBP.'), false);
    }
  },
});

// Todas estas rutas ahora requieren estar logueado (verifyToken)
router.get('/', verifyToken, getUsers);
router.post('/', verifyToken, createUser);
router.put('/profile/:id', verifyToken, upload.single('avatar'), updateProfile);
router.put('/:id', verifyToken, updateUser);
router.get('/roles', verifyToken, getRoles);

export default router;
