import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './CmsLogin.scss';

const CmsLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    // ⚠️ TODO: Aquí luego haremos el fetch a PostgreSQL/Node.js
    // Por ahora, simulamos un login exitoso si llenan los campos
    if (email && password) {
      const fakeToken = 'abc.123.xyz'; // Simulamos un JWT
      login(fakeToken);
    } else {
      alert('Por favor, ingresa tus credenciales.');
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
