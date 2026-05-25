import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './CmsLogin.scss';

const CmsLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Por favor, ingresa tus credenciales.');
      return;
    }

    try {
      // Petición real al backend
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Si PostgreSQL y Node dicen que todo está bien, guardamos el token real
        login(data.token);
      } else {
        // Si la contraseña es incorrecta, mostramos el error del backend
        alert(data.message || 'Credenciales inválidas');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      alert(
        'Error al conectar con el servidor. Verifica que el backend esté encendido.',
      );
    }
  };

  return (
    <main className='cms-login'>
      <div className='cms-login__container'>
        <div className='cms-login__card'>
          <div className='cms-login__header'>
            <h2>
              GTH <span>Mood</span>
            </h2>
            <p>Acceso exclusivo para Gestión de Talento</p>
          </div>
          <form
            className='cms-login__form'
            onSubmit={handleSubmit}
          >
            <div className='cms-login__group'>
              <label>Correo electrónico</label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='rrhh@mood.com'
                required
              />
            </div>
            <div className='cms-login__group'>
              <label>Contraseña</label>
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='••••••••'
                required
              />
            </div>
            <button
              type='submit'
              className='cms-login__btn'
            >
              Ingresar al Panel
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default CmsLogin;
