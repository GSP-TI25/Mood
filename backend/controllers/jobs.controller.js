import { pool } from '../config/db.js';

// --- OBTENER TODOS LOS TRABAJOS (Para la web pública y el Dashboard) ---
export const getJobs = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM jobs ORDER BY created_at DESC',
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener trabajos:', error);
    res
      .status(500)
      .json({ message: 'Error interno del servidor al obtener vacantes' });
  }
};

// --- OBTENER UN TRABAJO POR ID (Con las preguntas incluidas) ---
export const getJobById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT j.*, d.description, d.responsibilities, d.requirements, d.benefits, d.questions 
       FROM jobs j 
       LEFT JOIN job_details d ON j.id = d.job_id 
       WHERE j.id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Vacante no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener detalles del trabajo:', error);
    res.status(500).json({ message: 'Error al obtener la vacante' });
  }
};

// --- CREAR UN NUEVO TRABAJO (Con sus detalles y preguntas filtro) ---
export const createJob = async (req, res) => {
  const {
    title,
    category,
    type,
    country,
    date,
    description,
    responsibilities,
    requirements,
    benefits,
    questions, // <--- Recibimos el arreglo de preguntas filtro del Paso 2
  } = req.body;

  // Iniciamos una transacción para guardar en las 2 tablas al mismo tiempo
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Insertar en jobs (Tabla principal)
    const jobResult = await client.query(
      `INSERT INTO jobs (title, category, type, country, date) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [title, category, type, country, date],
    );

    const newJobId = jobResult.rows[0].id;

    // 2. Insertar en job_details (Incluyendo la columna de preguntas en formato JSON stringificado)
    await client.query(
      `INSERT INTO job_details (job_id, description, responsibilities, requirements, benefits, questions) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        newJobId,
        description,
        responsibilities,
        requirements,
        benefits,
        JSON.stringify(questions || []), // Convertimos el arreglo de React a JSON de PostgreSQL
      ],
    );

    await client.query('COMMIT');
    res.status(201).json({
      message: 'Vacante y preguntas publicadas con éxito',
      id: newJobId,
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al crear trabajo completo con preguntas:', error);
    res
      .status(500)
      .json({ message: 'Error al guardar la vacante y sus componentes' });
  } finally {
    client.release();
  }
};
