import { useState } from 'react';
import { Power, PowerOff, Edit } from 'lucide-react';
import './TeamTable.scss';

const TeamTable = ({ team, onToggleStatus, onEdit }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastMember = currentPage * itemsPerPage;
  const indexOfFirstMember = indexOfLastMember - itemsPerPage;
  const currentTeam = team.slice(indexOfFirstMember, indexOfLastMember);
  const totalPages = Math.ceil(team.length / itemsPerPage);

  return (
    <div className='cms-team-table-wrapper'>
      <table className='cms-table'>
        <thead>
          <tr>
            <th>Foto / Tipo</th>
            <th>Nombre</th>
            <th>ID del Rol (Traducción)</th>
            <th>LinkedIn</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentTeam.length > 0 ? (
            currentTeam.map((member) => (
              <tr
                key={member.id}
                className={!member.is_active ? 'row--inactive' : ''}
              >
                <td>
                  {member.image_url ? (
                    <img
                      src={member.image_url}
                      alt={member.name}
                      className='team-table__thumb'
                    />
                  ) : (
                    <span className='team-table__badge-type team-table__badge-type--general'>
                      General
                    </span>
                  )}
                </td>
                <td className='font-medium'>{member.name}</td>
                <td>
                  <code className='role-code'>{member.role_key}</code>
                </td>
                <td>
                  {member.linkedin ? (
                    <a
                      href={member.linkedin}
                      target='_blank'
                      rel='noreferrer'
                      className='text-link'
                    >
                      Ver Perfil
                    </a>
                  ) : (
                    '---'
                  )}
                </td>
                <td>
                  <span
                    className={`badge ${member.is_active ? 'badge--active' : 'badge--inactive'}`}
                  >
                    {member.is_active ? 'Activo' : 'Oculto'}
                  </span>
                </td>
                <td>
                  <div className='table-actions'>
                    <button
                      className='btn-action btn--icon-only btn--edit'
                      onClick={() => onEdit(member)}
                      title='Editar miembro'
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className={`btn-action btn--icon-only ${member.is_active ? 'btn--deactivate' : 'btn--activate'}`}
                      onClick={() => onToggleStatus(member.id)}
                      title={
                        member.is_active ? 'Ocultar miembro' : 'Hacer visible'
                      }
                    >
                      {member.is_active ? (
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
                colSpan='6'
                className='cms-table__empty'
              >
                No hay miembros en el equipo aún.
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

export default TeamTable;
