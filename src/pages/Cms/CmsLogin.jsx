// src/pages/Cms/CmsLogin.jsx
import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Mail, Lock, ArrowRight, LoaderCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import './CmsLogin.scss';

import logo from '../../assets/Logo_Mood.svg';

/**
 * Componente CmsLogin.
 * Interfaz de inicio de sesión para los administradores.
 * Envía las credenciales al backend y maneja las respuestas de seguridad (bloqueos por Rate Limit,
 * credenciales inválidas o éxito).
 */
const CmsLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      toast.warning('Por favor, ingresa tus credenciales.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), password }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        toast.success('Bienvenido al panel de control');
        login(data.token, data.user);
      } else if (response.status === 429) {
        // Manejo específico del error de Rate Limit configurado en el servidor
        toast.error('Cuenta bloqueada temporalmente por demasiados intentos.');
        setIsLoading(false);
      } else {
        toast.error(data.message || 'Credenciales inválidas');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      toast.error('Error al conectar con el servidor.');
      setIsLoading(false);
    }
  };

  return (
    <div className='cms-login-container'>
      <div className='login-box'>
        <div className='login-brand-panel'>
          <div className='brand-content'>
            <span className='brand-badge'>Plataforma Centralizada</span>
            <h1>
              Gestión <br />
              Inteligente <br />
              del Talento
            </h1>
            <p>
              El sistema integral más eficiente para el control y administración
              de recursos humanos en <strong>Mood</strong>.
            </p>
          </div>

          <div className='circle-decoration circle-1'></div>
          <div className='circle-decoration circle-2'></div>
        </div>

        <div className='login-form-panel'>
          <div className='form-wrapper'>
            <div className='form-header'>
              <div className='logo-container'>
                <img
                  src={logo}
                  alt='Mood Logo'
                />
              </div>
              <h2>Panel de Control</h2>
              <p className='subtitle'>Inicio de Sesión</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={`modern-input-group ${email ? 'has-value' : ''}`}>
                <div className='input-content'>
                  <label>Correo Electrónico</label>
                  <input
                    type='email'
                    placeholder='rrhh@mood.com'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    autoComplete='email'
                  />
                </div>
                <div className='icon-container'>
                  <Mail size={18} />
                </div>
              </div>

              <div
                className={`modern-input-group ${password ? 'has-value' : ''}`}
              >
                <div className='input-content'>
                  <label>Contraseña</label>
                  <input
                    type='password'
                    placeholder='Mínimo 8 caracteres'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    autoComplete='current-password'
                  />
                </div>
                <div className='icon-container'>
                  <Lock size={18} />
                </div>
              </div>

              <div className='form-actions'>
                <button
                  type='submit'
                  disabled={isLoading}
                  className={`btn-ingresar ${isLoading ? 'loading' : ''}`}
                >
                  {isLoading ? (
                    <>
                      <LoaderCircle
                        className='spinner-icon'
                        size={20}
                      />
                      <span>Ingresando</span>
                    </>
                  ) : (
                    <>
                      <span>Ingresar</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className='footer-copy'>
              @ Copyright {new Date().getFullYear()}, Mood - Todos los derechos
              reservados.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CmsLogin;
