// backend/controllers/auth.controller.js
import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import process from 'process';

/**
 * Inicia la sesión de un usuario en el CMS.
 * Verifica la existencia del email, valida el hash de la contraseña y
 * genera un JSON Web Token (JWT) firmado.
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validación básica temprana para evitar consultas innecesarias a la BD
  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña requeridos' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [
      email.toLowerCase().trim(), // Normalización para evitar bypass
    ]);

    if (result.rows.length === 0) {
      // Mensaje genérico de seguridad (no revela si falló el correo o la contraseña)
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = result.rows[0];

    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Seguridad: Si no hay secreto JWT en producción, lanzamos error crítico
    if (!process.env.JWT_SECRET) {
      console.error('CRÍTICO: JWT_SECRET no definido en el archivo .env');
      return res
        .status(500)
        .json({ message: 'Error de configuración del servidor' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role_id: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: '8h' },
    );

    res.json({
      message: 'Autenticación exitosa',
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role_id: user.role_id,
        country: user.country,
        avatar_url: user.avatar_url,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
