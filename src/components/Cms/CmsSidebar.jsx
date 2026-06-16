// src/components/Cms/CmsSidebar.jsx
import { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
	Briefcase,
	Users,
	FolderGit2,
	IdCard,
	Settings,
	LayoutDashboard,
	LogOut,
	ChevronRight,
	ChevronLeft,
	Menu,
	CircleUser,
	UserCircle,
} from "lucide-react";
import logoMood from "../../assets/Logo_Mood.svg";
import sidebarData from "../../data/cmsSidebar.json";
import "./CmsSidebar.scss";

/**
 * Diccionario para mapear los strings del JSON con los componentes de Lucide.
 */
const ICON_MAP = {
	LayoutDashboard,
	Briefcase,
	Users,
	FolderGit2,
	IdCard,
	Settings,
};

/**
 * Componente CmsSidebar.
 * Menú lateral de navegación del panel de control (CMS).
 * Maneja el estado de colapso, el menú del usuario actual y renderiza
 * dinámicamente las opciones basadas en `cmsSidebar.json` y el rol del usuario.
 *
 * @param {Object} props
 * @param {string} props.activeTab - Identificador de la pestaña activa actual.
 * @param {Function} props.setActiveTab - Función para cambiar la pestaña activa.
 */
const CmsSidebar = ({ activeTab, setActiveTab }) => {
	const { user, logout } = useContext(AuthContext);
	const [isOpen, setIsOpen] = useState(window.innerWidth > 768);
	const [showUserMenu, setShowUserMenu] = useState(false);
	const menuRef = useRef(null);

	const isSuperAdmin = user?.role_name === "SuperAdmin" || user?.role_id === 1;
	const currentYear = new Date().getFullYear();

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setShowUserMenu(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		const handleResize = () => setIsOpen(window.innerWidth > 768);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const toggleSidebar = () => setIsOpen(!isOpen);

	const handleTabClick = (tabName) => {
		setActiveTab(tabName);
		if (window.innerWidth <= 768) setIsOpen(false);
	};

	const getAvatarUrl = (url) => {
		if (!url) return null;
		return url.startsWith("http")
			? url
			: `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${url}`;
	};

	const avatarUrl = getAvatarUrl(user?.avatar_url);

	// Filtramos las opciones del menú basadas en los permisos del usuario
	const visibleMenuItems = sidebarData.filter(
		(item) => !item.adminOnly || isSuperAdmin,
	);

	return (
		<>
			<button
				className={`cms-mobile-hamburger ${isOpen ? "hidden" : ""}`}
				onClick={toggleSidebar}
			>
				<Menu size={20} />
			</button>

			{isOpen && (
				<div className='cms-mobile-overlay' onClick={toggleSidebar}></div>
			)}

			<aside className={`cms-sidebar ${isOpen ? "open" : "collapsed"}`}>
				<button className='toggle-btn' onClick={toggleSidebar}>
					{isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
				</button>

				<div className='logo-container'>
					<img src={logoMood} alt='Mood Logo' />
				</div>

				<nav>
					{visibleMenuItems.map((item) => {
						const IconComponent = ICON_MAP[item.icon];
						return (
							<button
								key={item.id}
								onClick={() => handleTabClick(item.id)}
								className={`nav-item ${activeTab === item.id ? "active" : ""}`}
								title={!isOpen ? item.name : ""}
							>
								<div className='icon-wrapper'>
									{IconComponent && <IconComponent size={16} />}
								</div>
								<span className='label'>{item.name}</span>
							</button>
						);
					})}
				</nav>

				<div className='footer-actions'>
					<div className='user-menu-container' ref={menuRef}>
						<div
							className={`user-mini-card ${showUserMenu ? "active" : ""}`}
							onClick={() => setShowUserMenu(!showUserMenu)}
							title={!isOpen ? "Opciones de Usuario" : ""}
						>
							<div className='avatar'>
								{avatarUrl ? (
									<img src={avatarUrl} alt='Avatar' />
								) : (
									<CircleUser size={20} />
								)}
							</div>
							<div className='info'>
								<span className='name'>{user?.first_name || "Admin"}</span>
								<span className='email' title={user?.email}>
									{user?.email || "Usuario de Mood"}
								</span>
							</div>
						</div>

						{showUserMenu && (
							<div className='user-dropdown'>
								<button
									className='dropdown-item'
									onClick={() => {
										handleTabClick("perfil");
										setShowUserMenu(false);
									}}
								>
									<UserCircle size={16} /> Mi Perfil
								</button>
								<div className='dropdown-divider'></div>
								<button
									className='dropdown-item logout'
									onClick={() => logout()}
								>
									<LogOut size={16} /> Cerrar Sesión
								</button>
							</div>
						)}
					</div>
					<p className='copyright'>© {currentYear} Mood</p>
				</div>
			</aside>
		</>
	);
};

export default CmsSidebar;
