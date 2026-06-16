// src/pages/Cms/Views/CmsHome/CmsHome.jsx
import { useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import {
	Briefcase,
	Users,
	FolderGit2,
	IdCard,
	Settings,
	User,
} from "lucide-react";
import "./CmsHome.scss";

/**
 * Componente CmsHome.
 * Vista principal del dashboard con los accesos directos a los módulos.
 */
const CmsHome = ({ setActiveTab }) => {
	const { user } = useContext(AuthContext);
	const isSuperAdmin = user?.role_name === "SuperAdmin" || user?.role_id === 1;

	return (
		<div className='cms-home-view'>
			<header className='cms-home-header'>
				<h1>¡Hola, {user?.first_name || "Admin"}!</h1>
				<p>
					Bienvenido al Panel de Control de Mood. ¿Qué te gustaría gestionar
					hoy?
				</p>
			</header>

			<div className='cms-home-grid'>
				<div className='cms-home-card' onClick={() => setActiveTab("vacantes")}>
					<div className='cms-home-card__icon bg-blue'>
						<Briefcase size={25} />
					</div>
					<div className='cms-home-card__info'>
						<h3>Gestión de Vacantes</h3>
						<p>Crea, edita o pausa las ofertas de empleo de la agencia.</p>
					</div>
				</div>

				<div
					className='cms-home-card'
					onClick={() => setActiveTab("postulantes")}
				>
					<div className='cms-home-card__icon bg-purple'>
						<Users size={25} />
					</div>
					<div className='cms-home-card__info'>
						<h3>Base de Postulantes</h3>
						<p>Revisa CVs, portafolios y respuestas de los candidatos.</p>
					</div>
				</div>

				<div
					className='cms-home-card'
					onClick={() => setActiveTab("proyectos")}
				>
					<div className='cms-home-card__icon bg-pink'>
						<FolderGit2 size={25} />
					</div>
					<div className='cms-home-card__info'>
						<h3>Proyectos (MoodPrint)</h3>
						<p>Sube imágenes o videos de casos de éxito y campañas.</p>
					</div>
				</div>

				<div className='cms-home-card' onClick={() => setActiveTab("equipo")}>
					<div className='cms-home-card__icon bg-emerald'>
						<IdCard size={25} />
					</div>
					<div className='cms-home-card__info'>
						<h3>Equipo Mood</h3>
						<p>Administra perfiles de líderes y miembros de la agencia.</p>
					</div>
				</div>

				<div className='cms-home-card' onClick={() => setActiveTab("perfil")}>
					<div className='cms-home-card__icon bg-orange'>
						<User size={25} />
					</div>
					<div className='cms-home-card__info'>
						<h3>Mi Perfil</h3>
						<p>Actualiza tu información personal, foto y contraseña.</p>
					</div>
				</div>

				{isSuperAdmin && (
					<div
						className='cms-home-card'
						onClick={() => setActiveTab("configuracion")}
					>
						<div className='cms-home-card__icon bg-slate'>
							<Settings size={25} />
						</div>
						<div className='cms-home-card__info'>
							<h3>Configuración</h3>
							<p>Administra accesos y permisos de otros usuarios del CMS.</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default CmsHome;
