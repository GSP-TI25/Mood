import { Router } from 'express';
import multer from 'multer';
import {
  getTeam,
  createTeamMember,
  updateTeamMember,
  toggleTeamStatus,
} from '../controllers/team.controller.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', getTeam);
router.post('/', upload.single('image_url'), createTeamMember);
router.put('/:id', upload.single('image_url'), updateTeamMember);
router.patch('/:id/status', toggleTeamStatus);

export default router;
