// backend/middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';
import process from 'process';

/**
 * Middleware para proteger rutas de la API.
 * Verifica que la petición contenga un Token JWT válido en los Headers de Autorización.
 */
export const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');

  // Si no hay token, denegamos el acceso inmediatamente
  if (!token) {
    return res
      .status(403)
      .json({ message: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    // El token suele venir como "Bearer <token>", así que lo limpiamos
    const cleanToken = token.startsWith('Bearer ')
      ? token.slice(7, token.length)
      : token;

    // Verificamos el token con la firma segura del entorno
    const verified = jwt.verify(cleanToken, process.env.JWT_SECRET);

    // Guardamos los datos del usuario decodificados en la request para su uso en los controladores
    req.user = verified;

    // Todo bien, pasa al controlador
    next();
  } catch (error) {
    console.error('Error de verificación de token:', error.message);
    res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};
