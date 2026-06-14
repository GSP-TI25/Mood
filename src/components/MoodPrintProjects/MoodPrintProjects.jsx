// src/components/MoodPrintProjects/MoodPrintProjects.jsx
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import FadeContent from "../FadeContent/FadeContent";
import Masonry from "../Masonry/Masonry";
import ProjectModal from "../ProjectModal/ProjectModal";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./MoodPrintProjects.scss";

gsap.registerPlugin(ScrollTrigger);

/**
 * Componente MoodPrintProjects.
 * Gestiona la visualización del portafolio utilizando una cuadrícula tipo Masonry.
 * Obtiene los proyectos dinámicamente desde la API, aplica filtros por categoría
 * y maneja la recalibración de GSAP ScrollTrigger al cambiar las dimensiones del DOM.
 * * @param {Object} props
 * @param {string} props.selectedCategory - Categoría activa para filtrar los proyectos.
 */
const MoodPrintProjects = ({ selectedCategory }) => {
	const { t } = useTranslation();
	const [selectedProject, setSelectedProject] = useState(null);
	const [projectsData, setProjectsData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	// Carga de datos desde la API
	useEffect(() => {
		const fetchProjects = async () => {
			try {
				const response = await fetch("http://localhost:5000/api/projects");
				const data = await response.json();

				// Filtrar proyectos activos y mapear las propiedades requeridas por el componente Masonry
				const activeProjects = data
					.filter((project) => project.is_active)
					.map((project) => ({
						...project,
						img: project.img_url,
						height: Math.floor(Math.random() * (800 - 500 + 1)) + 500, // Altura aleatoria para efecto Masonry
						url: project.project_url || "#",
					}));

				setProjectsData(activeProjects);
			} catch (error) {
				console.error("Error al cargar proyectos desde la BD:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchProjects();
	}, []);

	// Lógica de filtrado y traducción de la categoría
	const baseFilteredProjects =
		selectedCategory === "Todos"
			? projectsData
			: projectsData.filter((project) => project.category === selectedCategory);

	const filteredProjects = baseFilteredProjects.map((project) => ({
		...project,
		title: project.title,
		description: project.description || "Sin descripción detallada.",
		categoryTranslated:
			t(`moodPrintHero.categories.${project.category}`) || project.category,
	}));

	// Bloqueo de scroll global cuando el modal está abierto
	useEffect(() => {
		if (selectedProject) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [selectedProject]);

	// Observer para recalcular dimensiones de GSAP ScrollTrigger al cambiar la altura del grid
	useEffect(() => {
		let resizeObserver;

		const safeRefresh = () => {
			setTimeout(() => {
				ScrollTrigger.refresh();
			}, 100);
		};

		const gridContainer = document.querySelector(".mood-projects__grid");

		if (gridContainer && !isLoading) {
			resizeObserver = new ResizeObserver(() => {
				safeRefresh();
			});
			resizeObserver.observe(gridContainer);
		}

		safeRefresh();

		return () => {
			if (resizeObserver) resizeObserver.disconnect();
			ScrollTrigger.refresh();
		};
	}, [selectedCategory, isLoading]);

	return (
		<section className='mood-projects'>
			<div className='mood-projects__container'>
				{/* Cabecera de Categoría */}
				<div className='mood-projects__header'>
					<FadeContent
						key={selectedCategory}
						duration={0.8}
						delay={0.1}
						direction='bottom'
					>
						<h2 className='mood-projects__title'>
							{t(`moodPrintProjects.categoryInfo.${selectedCategory}.title`)}
						</h2>
						<p className='mood-projects__description'>
							{t(`moodPrintProjects.categoryInfo.${selectedCategory}.desc`)}
						</p>
					</FadeContent>
				</div>

				{/* Cuadrícula de Proyectos */}
				<div className='mood-projects__grid'>
					{isLoading ? (
						<p
							style={{ textAlign: "center", marginTop: "4rem", color: "gray" }}
						>
							Cargando proyectos espectaculares...
						</p>
					) : filteredProjects.length > 0 ? (
						<Masonry
							key={selectedCategory}
							items={filteredProjects}
							ease='power3.out'
							duration={0.8}
							stagger={0.08}
							animateFrom='bottom'
							scaleOnHover={true}
							hoverScale={0.96}
							blurToFocus={true}
							colorShiftOnHover={false}
							onItemClick={(project) => setSelectedProject(project)}
						/>
					) : (
						<p
							style={{ textAlign: "center", marginTop: "4rem", color: "gray" }}
						>
							{t("moodPrintProjects.emptyState")}
						</p>
					)}
				</div>
			</div>

			{/* Modal de Detalle */}
			<ProjectModal
				project={selectedProject}
				onClose={() => setSelectedProject(null)}
			/>
		</section>
	);
};

export default MoodPrintProjects;
