// backend/controllers/applications.controller.js
/*global process*/
import { pool } from '../config/db.js';
import nodemailer from 'nodemailer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'mood_cvs',
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );
    uploadStream.end(fileBuffer);
  });
};

/**
 * Recibe, procesa y almacena una nueva postulación de trabajo enviada desde el Frontend Público.
 */
export const submitApplication = async (req, res) => {
  try {
    const { jobId, name, email, phone, linkedin, github, behance, answers } =
      req.body;

    if (!req.file) {
      return res
        .status(400)
        .json({ message: 'El archivo del CV es requerido.' });
    }

    // 🌟 SEGURIDAD: Validación estricta para asegurar que es un PDF antes de procesar
    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({
        message:
          'Alerta de Seguridad: Sólo se permiten archivos en formato PDF.',
      });
    }

    const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
    const cvUrl = cloudinaryResult.secure_url;

    const insertQuery = `
      INSERT INTO applications 
      (job_id, name, email, phone, linkedin, github, behance, cv_url, answers) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING id
    `;

    await pool.query(insertQuery, [
      jobId,
      name,
      email,
      phone,
      linkedin || null,
      github || null,
      behance || null,
      cvUrl,
      answers,
    ]);

    const jobResult = await pool.query('SELECT title FROM jobs WHERE id = $1', [
      jobId,
    ]);
    const jobTitle =
      jobResult.rows.length > 0 ? jobResult.rows[0].title : 'la vacante';

    const mailOptions = {
      from: `"Equipo de Talento - GTH Mood" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `¡Recibimos tu postulación! 🚀 / Tu perfil ya está en nuestro radar`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; padding: 40px 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <div style="padding: 24px 32px; border-bottom: 1px solid #e2e8f0; text-align: left; background-color: #1a1a1a;">
              <img src="https://res.cloudinary.com/djsfjv4wf/image/upload/v1779822485/Logo_Mood_bwngjg.svg" alt="GTH Mood Logo" style="height: 45px; display: block; margin: auto;" />
            </div>
            <div style="padding: 32px; color: #334155; font-size: 16px; line-height: 1.6;">
              <p style="margin-top: 0;">Hola <strong>${name}</strong>,</p>
              <p>¡Qué buena vibra! Queríamos confirmarte que tu postulación para la posición de <strong>${jobTitle}</strong> ha llegado correctamente a nuestros servidores. Tu perfil y tu CV ya forman parte de nuestra base de talentos.</p>
              <p>En Mood nos encanta conectar con mentes creativas. Nuestro equipo de talento va a revisar tu propuesta con el ojo clínico que nos caracteriza. Nos tomamos el diseño y la estrategia muy en serio, por lo que solemos tomarnos un plazo de 7 a 10 días hábiles para evaluar cada portafolio y perfil. Si entramos en el mismo mood y tu perfil hace match con lo que buscamos, te escribiremos muy pronto.</p>
              <p style="margin-bottom: 0;">¡Te deseamos la mejor de las suertes en el proceso!</p>
            </div>
            <div style="background-color: #f8fafc; padding: 24px 32px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #64748b;">Conoce más sobre nuestra cultura y futuros proyectos:</p>
              <div style="margin-bottom: 16px;">
                <a href="https://linkedin.com/company/gthmood" style="color: #0f172a; text-decoration: none; font-size: 14px; font-weight: 600; margin: 0 8px; border-bottom: 1px solid #cbd5e1; padding-bottom: 2px;">LinkedIn</a>
                <span style="color: #cbd5e1;">|</span>
                <a href="https://instagram.com/gthmood" style="color: #0f172a; text-decoration: none; font-size: 14px; font-weight: 600; margin: 0 8px; border-bottom: 1px solid #cbd5e1; padding-bottom: 2px;">Instagram</a>
              </div>
              <p style="margin: 0; font-size: 13px; color: #94a3b8;">© ${new Date().getFullYear()} Mood Agencia. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(201).json({ message: 'Postulación procesada con éxito' });
  } catch (error) {
    console.error('Error al procesar la postulación:', error);
    res
      .status(500)
      .json({ message: 'Error interno del servidor al procesar los datos.' });
  }
};

/**
 * Obtiene todas las postulaciones. Uso exclusivo del CMS.
 */
export const getApplications = async (req, res) => {
  try {
    const query = `
      SELECT a.*, j.title as job_title 
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      ORDER BY a.created_at DESC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener postulaciones:', error);
    res
      .status(500)
      .json({ message: 'Error interno al cargar los postulantes' });
  }
};

/**
 * Actualiza el estado visual de seguimiento del candidato en el CMS.
 */
export const updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const query =
      'UPDATE applications SET status = $1 WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [status, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Postulación no encontrada.' });
    }

    res.json({
      message: 'Estado del candidato actualizado con éxito.',
      application: result.rows[0],
    });
  } catch (error) {
    console.error('Error al actualizar estado de la postulación:', error);
    res
      .status(500)
      .json({ message: 'Error interno al cambiar el estado del candidato.' });
  }
};
