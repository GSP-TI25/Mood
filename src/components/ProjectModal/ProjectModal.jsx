// src/components/ProjectModal/ProjectModal.jsx
import { X, ExternalLink } from "lucide-react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import "./ProjectModal.scss";

/**
 * Componente ProjectModal.
 * Renderiza un modal superpuesto (usando React Portals) para mostrar los detalles
 * de un proyecto específico. Soporta renderizado dinámico de Imágenes o Videos
 * dependiendo de la extensión del archivo multimedia.
 * * @param {Object} props
 * @param {Object|null} props.project - Objeto con los datos del proyecto a mostrar. Si es null, el modal no se renderiza.
 * @param {Function} props.onClose - Función que maneja el cierre del modal.
 */
const ProjectModal = ({ project, onClose }) => {
	const { t } = useTranslation();

	if (!project) return null;

	// Detección de formato multimedia (Video vs Imagen) basado en la extensión de la URL
	const isVideo = project.img && project.img.match(/\.(mp4|webm|mov|ogg)$/i);

	return createPortal(
		<div className='project-modal'>
			<div className='project-modal__overlay' onClick={onClose}></div>

			<div className='project-modal__content'>
				<button
					className='project-modal__close'
					onClick={onClose}
					aria-label={t("projectModal.closeAria")}
				>
					<X size={24} />
				</button>

				<div className='project-modal__image-wrapper'>
					{/* Renderizado condicional del asset principal */}
					{isVideo ? (
						<video
							src={project.img}
							controls
							autoPlay
							muted
							loop
							style={{ width: "100%", height: "100%", objectFit: "contain" }}
						/>
					) : (
						<img
							src={project.img}
							alt={project.title}
							crossOrigin='anonymous'
							referrerPolicy='no-referrer'
						/>
					)}
				</div>

				<div className='project-modal__info'>
					<span className='project-modal__badge'>
						{project.categoryTranslated || project.category}
					</span>
					<h3 className='project-modal__title'>{project.title}</h3>

					<div className='project-modal__meta'>
						<p>
							<strong>{t("projectModal.client")}</strong> {project.client}
						</p>
						<p>
							<strong>{t("projectModal.date")}</strong> {project.date}
						</p>
					</div>

					<p className='project-modal__desc'>{project.description}</p>

					<a
						href={project.url || "#"}
						target='_blank'
						rel='noopener noreferrer'
						className='project-modal__btn'
					>
						<span>{t("projectModal.btnView")}</span> <ExternalLink size={18} />
					</a>
				</div>
			</div>
		</div>,
		document.body,
	);
};

export default ProjectModal;
