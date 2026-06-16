// src/components/Cms/ProjectsTable.jsx
import { useState } from 'react';
import { Power, PowerOff, Edit } from 'lucide-react';
import './ProjectsTable.scss';

/**
 * Extrae la URL de un frame (miniatura) si el archivo subido es un video en Cloudinary.
 * @param {string} url - URL original del archivo (imagen o video).
 * @returns {string} URL transformada a formato .jpg si era video, o la original si era imagen.
 */
const getThumbnailUrl = (url) => {
  if (!url) return '';
  if (url.match(/\.(mp4|webm|mov|ogg)$/i)) {
    return url.replace(/\.(mp4|webm|mov|ogg)$/i, '.jpg');
  }
  return url;
};

/**
 * Componente ProjectsTable.
 * Tabla administrativa para listar los proyectos del portafolio (MoodPrint).
 * Incluye paginación local y botones de acción rápida.
 *
 * @param {Object} props
 * @param {Array} props.projects - Lista de proyectos obtenidos del backend.
 * @param {Function} props.onToggleStatus - Callback para cambiar la visibilidad del proyecto.
 * @param {Function} props.onEdit - Callback para abrir el formulario de edición.
 */
const ProjectsTable = ({ projects, onToggleStatus, onEdit }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastProject = currentPage * itemsPerPage;
  const indexOfFirstProject = indexOfLastProject - itemsPerPage;
  const currentProjects = projects.slice(
    indexOfFirstProject,
    indexOfLastProject,
  );
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  const formatExactDate = (dateString) => {
    if (!dateString) return '---';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  return (
    <div className='cms-projects-table-wrapper'>
      <table className='cms-table'>
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Título</th>
            <th>Categoría</th>
            <th>Cliente</th>
            <th>Creado el</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentProjects.length > 0 ? (
            currentProjects.map((project) => (
              <tr
                key={project.id}
                className={!project.is_active ? 'row--inactive' : ''}
              >
                <td>
                  <img
                    src={getThumbnailUrl(project.img_url)}
                    alt={project.title}
                    style={{
                      width: '50px',
                      height: '30px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      display: 'block',
                    }}
                  />
                </td>
                <td className='font-medium'>{project.title}</td>
                <td>{project.category}</td>
                <td>{project.client || '---'}</td>
                <td>{formatExactDate(project.created_at)}</td>
                <td>
                  <span
                    className={`badge ${project.is_active ? 'badge--active' : 'badge--inactive'}`}
                  >
                    {project.is_active ? 'Visible' : 'Oculto'}
                  </span>
                </td>
                <td>
                  <div className='table-actions'>
                    <button
                      className='btn-action btn--icon-only btn--edit'
                      onClick={() => onEdit(project)}
                      title='Editar proyecto'
                    >
                      <Edit size={16} />
                    </button>

                    <button
                      className={`btn-action btn--icon-only ${project.is_active ? 'btn--deactivate' : 'btn--activate'}`}
                      onClick={() => onToggleStatus(project.id)}
                      title={
                        project.is_active ? 'Ocultar proyecto' : 'Hacer visible'
                      }
                    >
                      {project.is_active ? (
                        <PowerOff size={16} />
                      ) : (
                        <Power size={16} />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan='7'
                className='cms-table__empty'
              >
                No hay proyectos en el portafolio en este momento.
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

export default ProjectsTable;
