// src/context/AuthContext.jsx
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Contexto de Autenticación.
 * Proporciona el estado global de la sesión y funciones para iniciar o
 * cerrar sesión en el sistema (CMS).
 */
export const AuthContext = createContext();

/**
 * Proveedor del contexto de autenticación.
 * Gestiona el estado de la sesión de forma síncrona utilizando `localStorage`
 * para garantizar la persistencia de datos entre recargas de la página.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes hijos envueltos por el proveedor.
 */
export const AuthProvider = ({ children }) => {
	const navigate = useNavigate();

	// Inicialización perezosa (lazy initialization) para leer el localStorage
	// una sola vez durante el primer renderizado.
	const [isAuthenticated, setIsAuthenticated] = useState(() => {
		return localStorage.getItem("cms_token") !== null;
	});

	const [user, setUser] = useState(() => {
		const savedUser = localStorage.getItem("cms_user");
		return savedUser ? JSON.parse(savedUser) : null;
	});

	/**
	 * Inicia la sesión del usuario.
	 * Guarda los datos en el almacenamiento local, reinicia la pestaña activa de
	 * navegación del CMS por defecto y redirige al dashboard.
	 * * @param {string} token - Token de autenticación (JWT/Session).
	 * @param {Object} userData - Información detallada del usuario logueado.
	 */
	const login = (token, userData) => {
		localStorage.setItem("cms_token", token);
		localStorage.setItem("cms_user", JSON.stringify(userData));
		localStorage.setItem("cms_active_tab", "inicio");

		setIsAuthenticated(true);
		setUser(userData);

		navigate("/cms/dashboard");
	};

	/**
	 * Cierra la sesión del usuario.
	 * Limpia las credenciales y configuraciones visuales almacenadas localmente,
	 * restablece el estado del contexto y redirige a la pantalla de inicio de sesión.
	 */
	const logout = () => {
		localStorage.removeItem("cms_token");
		localStorage.removeItem("cms_user");
		localStorage.removeItem("cms_active_tab");

		setIsAuthenticated(false);
		setUser(null);

		navigate("/cms/login");
	};

	return (
		<AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
