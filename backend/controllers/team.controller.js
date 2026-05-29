import { pool } from '../config/db.js';
import { v2 as cloudinary } from 'cloudinary';

// --- OBTENER TODO EL EQUIPO ---
export const getTeam = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM team ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener equipo:', error);
    res.status(500).json({ message: 'Error interno' });
  }
};

// --- CREAR MIEMBRO DEL EQUIPO ---
export const createTeamMember = async (req, res) => {
  const { name, role_key, linkedin } = req.body;
  try {
    let imgUrl = null;

    // Si se subió imagen, va para líderes
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
      const uploadResult = await cloudinary.uploader.upload(dataURI, {
        folder: 'mood_team',
      });
      imgUrl = uploadResult.secure_url;
    }

    const result = await pool.query(
      `INSERT INTO team (name, role_key, linkedin, image_url) VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, role_key, linkedin || null, imgUrl],
    );

    res.status(201).json({ message: 'Miembro creado', member: result.rows[0] });
  } catch (error) {
    console.error('Error al crear miembro:', error);
    res.status(500).json({ message: 'Error al crear miembro' });
  }
};

// --- ACTUALIZAR MIEMBRO ---
export const updateTeamMember = async (req, res) => {
  const { id } = req.params;
  const { name, role_key, linkedin } = req.body;

  try {
    let query = `UPDATE team SET name = $1, role_key = $2, linkedin = $3`;
    let values = [name, role_key, linkedin || null];
    let queryIndex = 4;

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
      const uploadResult = await cloudinary.uploader.upload(dataURI, {
        folder: 'mood_team',
      });

      query += `, image_url = $${queryIndex}`;
      values.push(uploadResult.secure_url);
      queryIndex++;
    }

    query += ` WHERE id = $${queryIndex} RETURNING *`;
    values.push(id);

    const result = await pool.query(query, values);
    res.json({ message: 'Miembro actualizado', member: result.rows[0] });
  } catch (error) {
    console.error('Error al actualizar miembro:', error);
    res.status(500).json({ message: 'Error al actualizar' });
  }
};

// --- CAMBIAR ESTADO ---
export const toggleTeamStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const member = await pool.query(
      'SELECT is_active FROM team WHERE id = $1',
      [id],
    );
    const newStatus = !member.rows[0].is_active;
    await pool.query('UPDATE team SET is_active = $1 WHERE id = $2', [
      newStatus,
      id,
    ]);
    res.json({ message: 'Estado actualizado', is_active: newStatus });
  } catch (error) {
    res.status(500).json({ message: 'Error al cambiar estado' });
  }
};
