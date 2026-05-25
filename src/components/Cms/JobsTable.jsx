import './JobsTable.scss';

const JobsTable = ({ jobs }) => {
  // Función para formatear la marca de tiempo a DD/MM/YY HH:MM
  const formatExactDate = (dateString) => {
    if (!dateString) return '---';
    const date = new Date(dateString);

    // Fecha
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);

    // Hora
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
            <th>Fecha de Publicación</th>
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
                {/* Renderizamos la fecha y hora exacta */}
                <td>{formatExactDate(job.created_at)}</td>
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
                colSpan='5'
                className='cms-table__empty'
              >
                No hay vacantes publicadas en este momento.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default JobsTable;
