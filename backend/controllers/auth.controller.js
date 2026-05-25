import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// --- INICIO DE SESIÓN ---
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Buscamos si el usuario existe
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = result.rows[0];

    // 2. Comparamos la contraseña enviada con el hash de la base de datos
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // 3. Si todo es correcto, generamos el Token (Pase VIP válido por 8 horas)
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'mood_secreto_super_seguro_2026',
      { expiresIn: '8h' },
    );

    res.json({
      message: 'Autenticación exitosa',
      token,
      user: { email: user.email },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// --- RUTA TEMPORAL PARA CREAR AL PRIMER ADMIN ---
// ⚠️ Nota: Deberás borrar esta función después de crear tu usuario por seguridad.
export const createFirstAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Encriptamos la contraseña con 10 rondas de sal
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2)',
      [email, hashedPassword],
    );

    res.status(201).json({
      message: 'Administrador creado con éxito. ¡Ya puedes borrar esta ruta!',
    });
  } catch (error) {
    console.error('Error al crear admin:', error);
    res.status(500).json({
      message: 'Error al crear el usuario. ¿Quizás el email ya existe?',
    });
  }
};
