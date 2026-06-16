// backend/routes/users.routes.js
import { Router } from 'express';
import multer from 'multer';
import { verifyToken } from '../middlewares/auth.middleware.js';
import {
  getUsers,
  createUser,
  getRoles,
  updateUser,
  updateProfile,
  toggleUserStatus,
} from '../controllers/users.controller.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      cb(null, true);
    } else {
      cb(new Error('Formato no soportado. Sólo JPG, PNG y WEBP.'), false);
    }
  },
});

router.get('/', verifyToken, getUsers);
router.post('/', verifyToken, createUser);
router.put('/profile/:id', verifyToken, upload.single('avatar'), updateProfile);
router.put('/:id', verifyToken, updateUser);
router.patch('/:id/status', verifyToken, toggleUserStatus);
router.get('/roles', verifyToken, getRoles);

export default router;
