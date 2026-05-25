import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Al cargar la app, revisamos si ya hay un token guardado (sesión activa)
  useEffect(() => {
    const token = localStorage.getItem('cms_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('cms_token', token);
    setIsAuthenticated(true);
    navigate('/cms/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('cms_token');
    setIsAuthenticated(false);
    navigate('/cms/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
