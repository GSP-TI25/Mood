import express from 'express';
import { getCountries } from '../controllers/country.controller.js';

const router = express.Router();

// Ruta: GET /api/countries
router.get('/', getCountries);

export default router;
