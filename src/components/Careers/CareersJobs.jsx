// src/components/Careers/CareersJobs.jsx
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Briefcase, Calendar, ChevronRight, MapPin } from "lucide-react";
import "./CareersJobs.scss";

/**
 * Sub-componente JobCardClipped.
 * Renderiza una tarjeta individual de trabajo.
 * Utiliza matemáticas para generar un "clip-path" dinámico que crea un recorte
 * (notch) en la esquina inferior derecha donde se asienta el botón de acción.
 * * @param {Object} props
 * @param {Object} props.job - Datos de la vacante de empleo.
 */
const JobCardClipped = ({ job }) => {
	const cardRef = useRef(null);
	const [size, setSize] = useState({ width: 0, height: 0 });

	// Recalcula el tamaño de la tarjeta cuando el DOM se pinta o redimensiona
	useLayoutEffect(() => {
		const element = cardRef.current;
		if (!element) return;

		const updateSize = () => {
			const rect = element.getBoundingClientRect();
			setSize({ width: rect.width, height: rect.height });
		};

		updateSize();
		const observer = new ResizeObserver(updateSize);
		observer.observe(element);

		return () => observer.disconnect();
	}, []);

	/**
	 * Genera dinámicamente un SVG path para el recorte inferior derecho.
	 * @param {number} w - Ancho de la tarjeta
	 * @param {number} h - Alto de la tarjeta
	 */
	const getDynamicPath = (w, h) => {
		if (w === 0 || h === 0) return "";

		const r = 16;
		const nw = 58;
		const nh = 58;
		const nr = 16;

		return `
      M ${r} 0
      L ${w - r} 0
      A ${r} ${r} 0 0 1 ${w} ${r}
      L ${w} ${h - nh - nr}
      A ${nr} ${nr} 0 0 1 ${w - nr} ${h - nh}
      L ${w - nw + nr} ${h - nh}
      A ${nr} ${nr} 0 0 0 ${w - nw} ${h - nh + nr}
      L ${w - nw} ${h - r}
      A ${r} ${r} 0 0 1 ${w - nw - r} ${h}
      L ${r} ${h}
      A ${r} ${r} 0 0 1 0 ${h - r}
      L 0 ${r}
      A ${r} ${r} 0 0 1 ${r} 0
      Z
    `
			.replace(/\s+/g, " ")
			.trim();
	};

	const dynamicClipPath = getDynamicPath(size.width, size.height);

	return (
		<div className='job-card' ref={cardRef}>
			<div
				className='job-card__clipped-bg'
				style={{
					clipPath: dynamicClipPath ? `path('${dynamicClipPath}')` : "none",
				}}
			>
				<div className='job-card__info'>
					<h3 className='job-card__name'>{job.title}</h3>
					<div className='job-card__meta'>
						<span className='job-card__role'>
							<Briefcase size={14} /> {job.type}
						</span>
						<span className='job-card__role'>
							<Calendar size={14} /> {job.date}
						</span>

						{/* Etiqueta de país (Oculta visualmente en CSS por defecto) */}
						<span className='job-card__role job-card__role--country-tag'>
							<MapPin size={14} /> {job.country}
						</span>
					</div>
				</div>
			</div>

			<Link
				to={`/trabaja_con_nosotros/${job.id}`}
				className='job-card__btn'
				aria-label={`Ver detalles del puesto ${job.title}`}
			>
				<ChevronRight size={22} strokeWidth={2.5} />
			</Link>
		</div>
	);
};

/**
 * Componente principal CareersJobs.
 * Obtiene las vacantes disponibles desde la API, filtra las activas
 * correspondientes a Perú, y las renderiza en una cuadrícula.
 */
const CareersJobs = () => {
	const { t } = useTranslation();
	const [jobsList, setJobsList] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	// Obtención de datos desde la API
	useEffect(() => {
		const fetchPublicJobs = async () => {
			try {
				const response = await fetch("http://localhost:5000/api/jobs");
				if (response.ok) {
					const data = await response.json();
					const activeJobs = data.filter((job) => job.is_active === true);
					setJobsList(activeJobs);
				}
			} catch (error) {
				console.error("Error al cargar las vacantes públicas:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchPublicJobs();
	}, []);

	const visibleJobs = jobsList.filter(
		(job) => job.country === "Peru" || job.country === "Perú",
	);

	return (
		<section className='careers-jobs'>
			<div className='careers-jobs__container'>
				<h2 className='careers-jobs__title'>{t("careers.jobs.title")}</h2>

				<div className='careers-jobs__grid'>
					{isLoading ? (
						<div className='careers-jobs__empty-state'>
							<p>Cargando vacantes disponibles...</p>
						</div>
					) : visibleJobs.length > 0 ? (
						visibleJobs.map((job) => <JobCardClipped key={job.id} job={job} />)
					) : (
						<div className='careers-jobs__empty-state'>
							<p>{t("careers.jobs.empty")}</p>
						</div>
					)}
				</div>
			</div>
		</section>
	);
};

export default CareersJobs;
