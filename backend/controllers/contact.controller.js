import { pool } from "../config/db.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import process from "process";

dotenv.config();

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

export const submitContact = async (req, res) => {
	const { nombre, correo, celular, pais, mensaje, idioma } = req.body;

	if (!nombre || !correo || !celular || !pais || !mensaje) {
		return res.status(400).json({ error: "Todos los campos son requeridos." });
	}

	const idiomaGuardado = idioma || "ES";

	try {
		const sqlQuery = `
      INSERT INTO mensajes_contacto (nombre, correo, celular, pais, mensaje, idioma)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
    `;
		const values = [nombre, correo, celular, pais, mensaje, idiomaGuardado];
		const result = await pool.query(sqlQuery, values);
		const nuevoId = result.rows[0].id;

		// --- DISEÑO HTML INSPIRADO EN SHADCN/UI ---
		const mailOptions = {
			from: `"Mood Web" <${process.env.EMAIL_USER}>`,
			to: process.env.EMAIL_DESTINATION,
			cc: "tecnologia@mood.pe",
			subject: `¡Nuevo Lead Mood! - ${nombre}`,
			html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #fafafa; color: #09090b; padding: 20px 0; margin: 0; line-height: 1.5;">
          
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);">
            
            <div style="padding: 24px; border-bottom: 1px solid #e4e4e7; background-color: #ffffff;">
              <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #09090b; display: flex; align-items: center;">
                ¡Nuevo Lead desde la Web (Mood)! 😏
              </h2>
              <p style="margin: 4px 0 0 0; font-size: 14px; color: #71717a;">
                Un usuario acaba de enviar un mensaje a través del formulario de contacto.
              </p>
            </div>

            <div style="padding: 24px;">
              <h3 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 500; color: #71717a; text-transform: uppercase; letter-spacing: 0.05em;">
                Detalles del Contacto
              </h3>
              
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tbody>
                  <tr style="border-bottom: 1px solid #f4f4f5;">
                    <td style="padding: 12px 0; font-weight: 500; color: #09090b; width: 35%;">Nombre</td>
                    <td style="padding: 12px 0; color: #3f3f46;">${nombre}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f4f4f5;">
                    <td style="padding: 12px 0; font-weight: 500; color: #09090b;">Correo electrónico</td>
                    <td style="padding: 12px 0;">
                      <a href="mailto:${correo}" style="color: #2563eb; text-decoration: none;">${correo}</a>
                    </td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f4f4f5;">
                    <td style="padding: 12px 0; font-weight: 500; color: #09090b;">Celular</td>
                    <td style="padding: 12px 0; color: #3f3f46;">${celular}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f4f4f5;">
                    <td style="padding: 12px 0; font-weight: 500; color: #09090b;">País</td>
                    <td style="padding: 12px 0; color: #3f3f46;">${pais}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; font-weight: 500; color: #09090b;">Idioma de Navegación</td>
                    <td style="padding: 12px 0; color: #3f3f46;">
                      <span style="display: inline-block; padding: 2px 8px; border-radius: 9999px; background-color: #f4f4f5; font-size: 12px; font-weight: 500;">
                        ${idiomaGuardado.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style="padding: 0 24px 24px 24px;">
              <h3 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 500; color: #71717a; text-transform: uppercase; letter-spacing: 0.05em;">
                Mensaje
              </h3>
              <div style="background-color: #f4f4f5; border: 1px solid #e4e4e7; border-radius: 6px; padding: 16px; font-size: 14px; color: #27272a; white-space: pre-wrap;">${mensaje}</div>
            </div>

            <div style="padding: 16px 24px; background-color: #f8fafc; border-top: 1px solid #e4e4e7; font-size: 12px; color: #a1a1aa; text-align: center;">
              Este es un correo automático generado por el servidor. | Registro DB ID: #${nuevoId}
            </div>

          </div>
        </body>
        </html>
      `,
		};

		await transporter.sendMail(mailOptions);

		return res
			.status(201)
			.json({ success: true, message: "Mensaje procesado.", id: nuevoId });
	} catch (error) {
		console.error("Error al procesar el lead:", error);
		return res
			.status(500)
			.json({ error: "Error interno al procesar el mensaje." });
	}
};
