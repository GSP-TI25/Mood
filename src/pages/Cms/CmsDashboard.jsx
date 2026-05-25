import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import JobForm from '../Cms/JobForm';
import { Briefcase, LogOut, Plus } from 'lucide-react'; // Íconos estilo shadcn
import './CmsDashboard.scss';

const CmsDashboard = () => {
  const { logout } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchJobs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/jobs');
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Error al cargar vacantes:', error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Bloquear el scroll del fondo cuando el panel de formulario está abierto
  useEffect(() => {
    if (isFormOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFormOpen]);

  const handleSuccess = () => {
    setIsFormOpen(false);
    fetchJobs();
  };

  return (
    <div className='cms-layout'>
      {/* --- SIDEBAR DE NAVEGACIÓN (Izquierda) --- */}
      <aside className='cms-sidebar-nav'>
        <div className='cms-sidebar-nav__brand'>
          GTH <span>Mood</span>
        </div>

        <nav className='cms-sidebar-nav__menu'>
          {/* Botón activo simulando la página actual */}
          <button className='cms-sidebar-nav__link active'>
            <Briefcase size={18} />
            Vacantes
          </button>
          {/* Aquí podrías agregar más páginas en el futuro (Usuarios, Postulantes, etc.) */}
        </nav>

        <div className='cms-sidebar-nav__footer'>
          <button
            onClick={logout}
            className='cms-sidebar-nav__logout'
          >
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* --- CONTENIDO PRINCIPAL (Derecha) --- */}
      <main className='cms-main-content'>
        <header className='cms-main-content__header'>
          <div>
            <h1>Gestión de Vacantes</h1>
            <p>Administra los puestos de trabajo disponibles en la agencia.</p>
          </div>
          <button
            className='cms-btn-primary'
            onClick={() => setIsFormOpen(true)}
          >
            <Plus
              size={16}
              strokeWidth={3}
            />{' '}
            Nueva Vacante
          </button>
        </header>

        {/* TABLA ESTILO SHADCN (Bordes sutiles, sin sombras pesadas) */}
        <div className='cms-table-wrapper'>
          <table className='cms-table'>
            <thead>
              <tr>
                <th>Puesto</th>
                <th>Modalidad</th>
                <th>País</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <tr key={job.id}>
                    <td className='font-medium'>{job.title}</td>
                    <td>{job.type}</td>
                    <td>{job.country}</td>
                    <td>
                      <span
                        className={`badge ${job.is_active ? 'badge--active' : 'badge--inactive'}`}
                      >
                        {job.is_active ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan='4'
                    style={{
                      textAlign: 'center',
                      padding: '3rem',
                      color: '#64748b',
                    }}
                  >
                    No hay vacantes publicadas en este momento.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* --- PANEL DE FORMULARIO (Sheet derecho estilo shadcn) --- */}
      {isFormOpen && (
        <div
          className='cms-sheet-overlay'
          onClick={() => setIsFormOpen(false)}
        >
          <div
            className='cms-sheet-content'
            onClick={(e) => e.stopPropagation()}
          >
            <JobForm
              onSubmitSuccess={handleSuccess}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CmsDashboard;
