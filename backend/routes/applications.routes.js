import { Router } from "express";
import multer from "multer";
import {
	submitApplication,
	getApplications,
	updateApplicationStatus,
} from "../controllers/applications.controller.js";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Rutas
router.post("/", upload.single("cv"), submitApplication);
router.get("/", getApplications);
router.patch("/:id/status", updateApplicationStatus); // 🌟 NUEVO

export default router;
