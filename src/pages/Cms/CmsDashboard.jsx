import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './CmsDashboard.scss';

const CmsDashboard = () => {
  const { logout } = useContext(AuthContext);

  return (
    <div className='cms-dashboard'>
      <nav className='cms-dashboard__nav'>
        <h2>
          Dashboard <span>GTH</span>
        </h2>
        <button
          onClick={logout}
          className='cms-dashboard__logout'
        >
          Cerrar Sesión
        </button>
      </nav>

      <main className='cms-dashboard__content'>
        <header className='cms-dashboard__header'>
          <h1>Gestión de Vacantes</h1>
          <button className='cms-dashboard__add-btn'>+ Nueva Vacante</button>
        </header>

        <div className='cms-dashboard__board'>
          <p>La tabla de vacantes conectada a PostgreSQL irá aquí...</p>
        </div>
      </main>
    </div>
  );
};

export default CmsDashboard;
