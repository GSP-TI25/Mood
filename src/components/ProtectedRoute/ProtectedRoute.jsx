import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    // Si no está logueado, lo pateamos al login
    return (
      <Navigate
        to='/cms/login'
        replace
      />
    );
  }

  // Si tiene permiso, renderizamos el componente hijo (Dashboard)
  return children;
};

export default ProtectedRoute;
