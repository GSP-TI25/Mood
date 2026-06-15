// src/components/Careers/JobDetail.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Briefcase, Calendar, ArrowLeft, Send, MapPin } from "lucide-react";
import "./JobDetail.scss";

/**
 * Componente JobDetail.
 * Renderiza los detalles completos de una vacante específica obtenida desde la API.
 * Administra los estados de carga y error, y genera dinámicamente un esquema
 * JSON-LD para mejorar el SEO y permitir la indexación en Google Jobs.
 */
const JobDetail = () => {
	const { jobId } = useParams();
	const [job, setJob] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		const fetchJobDetails = async () => {
			try {
				const response = await fetch(`http://localhost:5000/api/jobs/${jobId}`);
				if (response.ok) {
					const data = await response.json();
					setJob(data);
				} else {
					setError(true);
				}
			} catch (error) {
				console.error("Error al cargar los detalles del puesto:", error);
				setError(true);
			} finally {
				setIsLoading(false);
			}
		};

		fetchJobDetails();
	}, [jobId]);

	if (isLoading) {
		return (
			<main className='job-detail-layout'>
				<div className='job-detail-loading'>
					<div className='spinner'></div>
					<p>Cargando información de la vacante...</p>
				</div>
			</main>
		);
	}

	if (error || !job) {
		return (
			<main className='job-detail-layout'>
				<div className='job-detail-error'>
					<h2>Vacante no encontrada o inactiva</h2>
					<p>
						Es posible que esta posición ya haya sido cubierta o el enlace sea
						incorrecto.
					</p>
					<Link to='/trabaja_con_nosotros' className='job-detail-error__btn'>
						Ver vacantes disponibles
					</Link>
				</div>
			</main>
		);
	}

	/**
	 * Estructuración del Schema Markup para Google Jobs (SEO).
	 */
	const jobSchema = {
		"@context": "https://schema.org/",
		"@type": "JobPosting",
		title: job.title,
		description: `
      <p>${job.description || ""}</p>
      ${job.responsibilities?.length ? `<h3>Responsabilidades:</h3><ul>${job.responsibilities.map((r) => `<li>${r}</li>`).join("")}</ul>` : ""}
      ${job.requirements?.length ? `<h3>Requisitos:</h3><ul>${job.requirements.map((r) => `<li>${r}</li>`).join("")}</ul>` : ""}
    `,
		identifier: {
			"@type": "PropertyValue",
			name: "Mood",
			value: job.id,
		},
		datePosted: job.created_at || new Date().toISOString(),
		validThrough: "2026-12-31T00:00",
		employmentType:
			job.type === "Full-time"
				? "FULL_TIME"
				: job.type === "Part-time"
					? "PART_TIME"
					: job.type === "Freelance"
						? "CONTRACTOR"
						: "OTHER",
		hiringOrganization: {
			"@type": "Organization",
			name: "Mood",
			sameAs: "https://www.mood.pe/",
			logo: "https://www.mood.pe/Logo_Mood.svg",
		},
		jobLocation: {
			"@type": "Place",
			address: {
				"@type": "PostalAddress",
				addressCountry:
					job.country === "Peru" || job.country === "Perú" ? "PE" : "CO",
			},
		},
	};

	return (
		<main className='job-detail-layout'>
			{/* Inyección del Schema Markup en el DOM */}
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema) }}
			/>

			<div className='job-detail-wrapper'>
				<Link to='/trabaja_con_nosotros' className='job-detail__back-link'>
					<ArrowLeft size={16} /> Volver a posiciones
				</Link>

				<article className='job-detail-card'>
					<header className='job-detail-card__header'>
						<h1 className='job-detail-card__title'>{job.title}</h1>

						<div className='job-detail-card__badges'>
							<span className='job-badge'>
								<Briefcase size={14} /> {job.type}
							</span>
							<span className='job-badge'>
								<MapPin size={14} /> {job.country}
							</span>
							<span className='job-badge job-badge--secondary'>
								<Calendar size={14} /> Fecha Publicación: {job.date}
							</span>
						</div>
					</header>

					<div className='job-detail-card__content'>
						{job.description && (
							<section className='content-section'>
								<h2>Acerca del rol</h2>
								<p>{job.description}</p>
							</section>
						)}

						{job.responsibilities && job.responsibilities.length > 0 && (
							<section className='content-section'>
								<h2>¿Qué harás?</h2>
								<ul className='custom-list'>
									{job.responsibilities.map((item, index) => (
										<li key={index}>{item}</li>
									))}
								</ul>
							</section>
						)}

						{job.requirements && job.requirements.length > 0 && (
							<section className='content-section'>
								<h2>¿Qué buscamos?</h2>
								<ul className='custom-list'>
									{job.requirements.map((item, index) => (
										<li key={index}>{item}</li>
									))}
								</ul>
							</section>
						)}

						{job.benefits && job.benefits.length > 0 && (
							<section className='content-section'>
								<h2>Beneficios Mood</h2>
								<ul className='custom-list'>
									{job.benefits.map((item, index) => (
										<li key={index}>{item}</li>
									))}
								</ul>
							</section>
						)}
					</div>

					<footer className='job-detail-card__footer'>
						<div className='footer-content'>
							<div>
								<h3>¿Listo para unirte al equipo?</h3>
								<p>Completa el formulario y cuéntanos sobre ti.</p>
							</div>
							<Link
								to={`/trabaja_con_nosotros/${job.id}/postular`}
								className='btn-apply'
							>
								Completar formulario <Send size={16} />
							</Link>
						</div>
					</footer>
				</article>
			</div>
		</main>
	);
};

export default JobDetail;
