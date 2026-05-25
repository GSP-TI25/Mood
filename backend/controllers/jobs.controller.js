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

// --- OBTENER UN TRABAJO POR ID (Para la vista de JobDetail.jsx) ---
export const getJobById = async (req, res) => {
  const { id } = req.params;

  try {
    // Hacemos un JOIN para traer la info básica y los detalles al mismo tiempo
    const result = await pool.query(
      `SELECT j.*, d.description, d.responsibilities, d.requirements, d.benefits 
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

// --- CREAR UN NUEVO TRABAJO (CON SUS DETALLES PARA EL CMS) ---
export const createJob = async (req, res) => {
  const {
    title,
    category,
    type,
    country,
    date, // Info Básica (Tabla: jobs)
    description,
    responsibilities,
    requirements,
    benefits, // Info Detallada (Tabla: job_details)
  } = req.body;

  // Iniciamos una conexión especial para hacer una "transacción"
  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // Iniciar transacción

    // 1. Insertar en la tabla principal (jobs)
    const jobResult = await client.query(
      `INSERT INTO jobs (title, category, type, country, date) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [title, category, type, country, date],
    );

    const newJobId = jobResult.rows[0].id; // El ID recién generado

    // 2. Insertar en la tabla secundaria (job_details) usando el ID anterior
    // PostgreSQL maneja los arrays nativamente, así que pasamos las listas directo
    await client.query(
      `INSERT INTO job_details (job_id, description, responsibilities, requirements, benefits) 
       VALUES ($1, $2, $3, $4, $5)`,
      [newJobId, description, responsibilities, requirements, benefits],
    );

    await client.query('COMMIT'); // Guardar los cambios definitivamente en ambas tablas

    res.status(201).json({
      message: 'Vacante y detalles publicados exitosamente',
      id: newJobId,
    });
  } catch (error) {
    await client.query('ROLLBACK'); // Si algo falla, revertimos todo para no dejar datos a medias
    console.error('Error al crear trabajo completo:', error);
    res
      .status(500)
      .json({ message: 'Error al guardar la vacante y sus detalles' });
  } finally {
    client.release(); // Liberar la conexión a la base de datos
  }
};
