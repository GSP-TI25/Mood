import { pool } from '../config/db.js';

export const getCountries = async (req, res) => {
  try {
    // Obtenemos el nombre y el código telefónico ordenados alfabéticamente
    const sqlQuery =
      'SELECT nicename, phonecode FROM country ORDER BY nicename ASC';
    const result = await pool.query(sqlQuery);

    // Formateamos los datos exactamente como los espera 'react-select'
    const formattedCountries = result.rows.map((country) => ({
      value: country.nicename,
      label: country.nicename,
      prefix: `+${country.phonecode} `,
    }));

    return res.status(200).json({ success: true, data: formattedCountries });
  } catch (error) {
    console.error('Error obteniendo países:', error);
    return res.status(500).json({ error: 'Error interno al obtener países.' });
  }
};
