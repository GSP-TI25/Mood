// backend/config/db.js
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

/**
 * Configuración del Pool de conexiones a PostgreSQL.
 * Utiliza variables de entorno para evitar credenciales quemadas en el código.
 */
export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  // Configuraciones de seguridad para evitar fugas de memoria en la DB
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Listener de errores globales del Pool (evita que se caiga el servidor de Node)
pool.on('error', (err) => {
  console.error('Error inesperado en el pool de PostgreSQL:', err);
  process.exit(-1);
});

pool.connect((err) => {
  if (err) console.error('Error conectando a PostgreSQL:', err.stack);
  else console.log('✅ Conexión exitosa a PostgreSQL');
});
