// src/components/ProtectedRoute/ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

/**
 * Componente ProtectedRoute (Route Guard).
 * Envuelve las rutas privadas de la aplicación (como el CMS o el Dashboard)
 * verificando el estado de autenticación del usuario a través del AuthContext.
 * Si el usuario no está autenticado, lo redirige automáticamente a la vista de inicio de sesión.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Los componentes hijos (la ruta protegida) a renderizar.
 */
const ProtectedRoute = ({ children }) => {
	const { isAuthenticated } = useContext(AuthContext);

	if (!isAuthenticated) {
		return <Navigate to='/cms/login' replace />;
	}

	return children;
};

export default ProtectedRoute;
