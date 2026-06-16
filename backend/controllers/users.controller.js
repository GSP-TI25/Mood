// backend/controllers/users.controller.js
import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';
import process from 'process';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getUsers = async (req, res) => {
  try {
    const query = `
      SELECT 
        u.id, u.email, u.first_name, u.last_name, u.country, u.created_at, u.updated_at, u.avatar_url, u.is_active,
        r.name as role_name,
        r.id as role_id,
        c.first_name as creator_name
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      LEFT JOIN users c ON u.created_by = c.id
      ORDER BY u.created_at DESC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error interno al cargar los usuarios.' });
  }
};

export const createUser = async (req, res) => {
  const {
    email,
    password,
    first_name,
    last_name,
    country,
    role_id,
    created_by,
  } = req.body;

  try {
    const userExists = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email],
    );
    if (userExists.rows.length > 0) {
      return res
        .status(400)
        .json({ message: 'Este correo electrónico ya está registrado.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const insertQuery = `
      INSERT INTO users (email, password_hash, first_name, last_name, country, role_id, created_by, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, true) 
      RETURNING id, email, first_name, last_name
    `;

    const result = await pool.query(insertQuery, [
      email,
      hashedPassword,
      first_name,
      last_name,
      country,
      role_id,
      created_by || null,
    ]);

    res
      .status(201)
      .json({ message: 'Usuario creado con éxito.', user: result.rows[0] });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ message: 'Error interno al crear el usuario.' });
  }
};

export const getRoles = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name FROM roles ORDER BY id ASC',
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener roles:', error);
    res.status(500).json({ message: 'Error interno al cargar los roles.' });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, country, role_id, password, updated_by } =
    req.body;

  try {
    let updateQuery = `
      UPDATE users 
      SET first_name = $1, last_name = $2, country = $3, role_id = $4, updated_by = $5, updated_at = CURRENT_TIMESTAMP
    `;
    let values = [first_name, last_name, country, role_id, updated_by || null];

    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateQuery += `, password_hash = $6 WHERE id = $7 RETURNING id`;
      values.push(hashedPassword, id);
    } else {
      updateQuery += ` WHERE id = $6 RETURNING id`;
      values.push(id);
    }

    const result = await pool.query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.json({ message: 'Usuario actualizado con éxito.' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res
      .status(500)
      .json({ message: 'Error interno al actualizar el usuario.' });
  }
};

export const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, country, password } = req.body;

  try {
    let avatarUrl = null;

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;

      const uploadResult = await cloudinary.uploader.upload(dataURI, {
        folder: 'mood_avatars',
      });
      avatarUrl = uploadResult.secure_url;
    }

    let query = `UPDATE users SET first_name = $1, last_name = $2, country = $3, updated_at = CURRENT_TIMESTAMP`;
    let values = [first_name, last_name, country];
    let queryIndex = 4;

    if (avatarUrl) {
      query += `, avatar_url = $${queryIndex}`;
      values.push(avatarUrl);
      queryIndex++;
    }

    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      query += `, password_hash = $${queryIndex}`;
      values.push(hashedPassword);
      queryIndex++;
    }

    query += ` WHERE id = $${queryIndex} RETURNING id, first_name, last_name, email, country, role_id, avatar_url`;
    values.push(id);

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({
      success: true,
      message: 'Perfil actualizado correctamente',
      user: result.rows[0],
    });
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * 🌟 NUEVO: Activa o desactiva (da de baja) a un usuario del CMS.
 * Requiere que la tabla `users` tenga una columna `is_active` (boolean, default true).
 */
export const toggleUserStatus = async (req, res) => {
  const { id } = req.params;

  try {
    // Evitar que el SuperAdmin principal (ID 1) se desactive a sí mismo por error
    if (parseInt(id) === 1) {
      return res
        .status(403)
        .json({ message: 'El usuario principal no puede ser dado de baja.' });
    }

    const user = await pool.query('SELECT is_active FROM users WHERE id = $1', [
      id,
    ]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const newStatus = !user.rows[0].is_active;

    await pool.query(
      'UPDATE users SET is_active = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newStatus, id],
    );

    res.json({
      message: newStatus ? 'Usuario reactivado' : 'Usuario dado de baja',
      is_active: newStatus,
    });
  } catch (error) {
    console.error('Error al cambiar el estado del usuario:', error);
    res
      .status(500)
      .json({ message: 'Error al actualizar el estado del usuario.' });
  }
};
