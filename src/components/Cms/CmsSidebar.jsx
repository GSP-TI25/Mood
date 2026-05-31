import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
	Briefcase,
	LogOut,
	Users,
	Settings,
	User,
	FolderGit2,
	IdCard,
	LayoutDashboard,
} from "lucide-react"; // 🌟 Importamos LayoutDashboard
import logoMood from "../../assets/Logo_Mood.svg";
import "./CmsSidebar.scss";

const CmsSidebar = ({ activeTab, setActiveTab }) => {
	const { logout, user } = useContext(AuthContext);

	const isSuperAdmin = user?.role_name === "SuperAdmin" || user?.role_id === 1;

	return (
		<aside className='cms-sidebar-nav'>
			<div className='cms-sidebar-nav__brand'>
				<img
					src={logoMood}
					alt='Mood Agencia Logo'
					className='cms-sidebar-nav__logo'
				/>
			</div>

			<nav className='cms-sidebar-nav__menu'>
				{/* 🌟 NUEVO BOTÓN DE INICIO */}
				<button
					className={`cms-sidebar-nav__link ${activeTab === "inicio" ? "active" : ""}`}
					onClick={() => setActiveTab("inicio")}
				>
					<LayoutDashboard size={18} />
					Inicio
				</button>

				<button
					className={`cms-sidebar-nav__link ${activeTab === "vacantes" ? "active" : ""}`}
					onClick={() => setActiveTab("vacantes")}
				>
					<Briefcase size={18} />
					Vacantes
				</button>

				<button
					className={`cms-sidebar-nav__link ${activeTab === "postulantes" ? "active" : ""}`}
					onClick={() => setActiveTab("postulantes")}
				>
					<Users size={18} />
					Postulantes
				</button>

				<button
					className={`cms-sidebar-nav__link ${activeTab === "proyectos" ? "active" : ""}`}
					onClick={() => setActiveTab("proyectos")}
				>
					<FolderGit2 size={18} />
					Proyectos
				</button>

				<button
					className={`cms-sidebar-nav__link ${activeTab === "equipo" ? "active" : ""}`}
					onClick={() => setActiveTab("equipo")}
				>
					<IdCard size={18} />
					Equipo Mood
				</button>

				{isSuperAdmin && (
					<button
						className={`cms-sidebar-nav__link ${activeTab === "configuracion" ? "active" : ""}`}
						onClick={() => setActiveTab("configuracion")}
					>
						<Settings size={18} />
						Configuración
					</button>
				)}
			</nav>

			<div className='cms-sidebar-nav__footer'>
				<button
					className={`cms-sidebar-nav__link ${activeTab === "perfil" ? "active" : ""}`}
					onClick={() => setActiveTab("perfil")}
					style={{ marginBottom: "0.5rem" }}
				>
					<User size={18} />
					Mi Perfil
				</button>

				<button onClick={logout} className='cms-sidebar-nav__logout'>
					<LogOut size={18} />
					Cerrar Sesión
				</button>
			</div>
		</aside>
	);
};

export default CmsSidebar;
