// src/components/Cms/JobsTable.jsx
import { useState } from 'react';
import { BanIcon, Edit, Undo2 } from 'lucide-react';
import './JobsTable.scss';

/**
 * Componente JobsTable.
 * Tabla de datos paginada para la gestión de vacantes laborales.
 *
 * @param {Object} props
 * @param {Array} props.jobs - Lista de vacantes a renderizar.
 * @param {Function} props.onToggleStatus - Callback ejecutado para activar/desactivar una vacante.
 * @param {Function} props.onEdit - Callback ejecutado al hacer clic en editar una vacante.
 */
const JobsTable = ({ jobs, onToggleStatus, onEdit }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastJob = currentPage * itemsPerPage;
  const indexOfFirstJob = indexOfLastJob - itemsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / itemsPerPage);

  /**
   * Formatea una cadena de fecha a un formato exacto DD/MM/YY HH:MM.
   * * @param {string} dateString - Cadena de texto con la fecha original.
   * @returns {string} Fecha formateada.
   */
  const formatExactDate = (dateString) => {
    if (!dateString) return '---';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  return (
    <div className='cms-table-wrapper'>
      <table className='cms-table'>
        <thead>
          <tr>
            <th>Puesto</th>
            <th>Modalidad</th>
            <th>País</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentJobs.length > 0 ? (
            currentJobs.map((job) => (
              <tr
                key={job.id}
                className={!job.is_active ? 'row--inactive' : ''}
              >
                <td className='font-medium'>{job.title}</td>
                <td>{job.type}</td>
                <td>{job.country}</td>
                <td>{formatExactDate(job.created_at)}</td>
                <td>
                  <span
                    className={`badge ${
                      job.is_active ? 'badge--active' : 'badge--inactive'
                    }`}
                  >
                    {job.is_active ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td>
                  <div className='table-actions'>
                    <button
                      className='btn-action btn--icon-only btn--edit'
                      onClick={() => onEdit(job)}
                      title='Editar vacante'
                    >
                      <Edit size={16} />
                    </button>

                    <button
                      className={`btn-action btn--icon-only ${
                        job.is_active ? 'btn--deactivate' : 'btn--activate'
                      }`}
                      onClick={() => onToggleStatus(job.id)}
                      title={
                        job.is_active
                          ? 'Dar de baja vacante'
                          : 'Activar vacante'
                      }
                    >
                      {job.is_active ? (
                        <BanIcon size={16} />
                      ) : (
                        <Undo2 size={16} />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan='6'
                className='cms-table__empty'
              >
                No hay vacantes publicadas en este momento.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className='cms-pagination'>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Anterior
          </button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default JobsTable;
