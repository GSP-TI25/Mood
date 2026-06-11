//src/components/Cms/ApplicationsTable.jsx
import { useState, useMemo, useEffect } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify'; // 🌟 IMPORTAMOS TOASTIFY
import {
  Download,
  Mail,
  FileText,
  Eye,
  X,
  Loader2,
  MessageCircle,
  FilterX,
  Globe,
  Save,
  FileSpreadsheet, // 🌟 Ícono para exportar a Excel/CSV
} from 'lucide-react';
import LinkedinIcon from '../Icons/Linkedin';
import GithubIcon from '../Icons/Github';
import './ApplicationsTable.scss';

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: '#ffffff',
    borderColor: state.isFocused ? '#0f172a' : '#cbd5e1',
    boxShadow: state.isFocused ? '0 0 0 1px #0f172a' : 'none',
    '&:hover': { borderColor: state.isFocused ? '#0f172a' : '#94a3b8' },
    borderRadius: '6px',
    padding: '0 4px',
    minHeight: '36px', // 🌟 Ajustado a 36px (estándar shadcn)
    fontSize: '0.875rem',
    minWidth: '220px',
    cursor: 'pointer',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? '#f1f5f9'
      : state.isFocused
        ? '#f8fafc'
        : '#ffffff',
    color: '#0f172a',
    fontSize: '0.875rem',
    cursor: 'pointer',
    '&:active': { backgroundColor: '#e2e8f0' },
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: '6px',
    boxShadow:
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    zIndex: 9999,
  }),
  singleValue: (provided) => ({ ...provided, color: '#0f172a' }),
  placeholder: (provided) => ({ ...provided, color: '#64748b' }),
};

const getStatusColors = (status) => {
  switch (status) {
    case 'Nuevo':
      return { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' };
    case 'Seguimiento':
      return { bg: '#fffbeb', text: '#d97706', border: '#fde68a' };
    case 'Descartado':
      return { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' };
    default:
      return { bg: '#ffffff', text: '#334155', border: '#e2e8f0' };
  }
};

const statusOptions = [
  { value: 'Nuevo', label: 'Nuevo' },
  { value: 'Seguimiento', label: 'Seguimiento' },
  { value: 'Descartado', label: 'Descartado' },
];

const statusSelectStyles = {
  control: (provided, state) => {
    const status = state.getValue()[0]?.value || 'Nuevo';
    const colors = getStatusColors(status);
    return {
      ...provided,
      backgroundColor: colors.bg,
      borderColor: state.isFocused ? colors.text : colors.border,
      boxShadow: 'none',
      '&:hover': { borderColor: colors.text },
      borderRadius: '9999px',
      minHeight: '28px',
      height: '28px',
      cursor: 'pointer',
      width: '135px',
    };
  },
  singleValue: (provided, state) => {
    const status = state.getValue()[0]?.value || 'Nuevo';
    const colors = getStatusColors(status);
    return {
      ...provided,
      color: colors.text,
      fontSize: '0.75rem',
      fontWeight: '600',
    };
  },
  option: (provided, state) => {
    const colors = getStatusColors(state.data.value);
    return {
      ...provided,
      fontSize: '0.75rem',
      fontWeight: '500',
      color: state.isSelected ? colors.text : '#334155',
      backgroundColor: state.isSelected
        ? colors.bg
        : state.isFocused
          ? '#f8fafc'
          : '#ffffff',
      cursor: 'pointer',
      '&:active': { backgroundColor: '#e2e8f0' },
    };
  },
  valueContainer: (provided) => ({ ...provided, padding: '0 10px' }),
  menu: (provided) => ({
    ...provided,
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    boxShadow:
      '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    overflow: 'hidden',
    zIndex: 9999,
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  dropdownIndicator: (provided, state) => {
    const status = state.getValue()[0]?.value || 'Nuevo';
    const colors = getStatusColors(status);
    return {
      ...provided,
      padding: '2px 8px 2px 4px',
      color: colors.text,
      '&:hover': { opacity: 0.8 },
    };
  },
  indicatorSeparator: () => ({ display: 'none' }),
};

const ApplicationsTable = ({ applications }) => {
  const [localApps, setLocalApps] = useState(applications);
  const [pendingChanges, setPendingChanges] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [cvModalApp, setCvModalApp] = useState(null);
  const [answersModalApp, setAnswersModalApp] = useState(null);
  const [jobQuestions, setJobQuestions] = useState([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  const [jobFilter, setJobFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    setLocalApps(applications);
    setPendingChanges({});
  }, [applications]);

  const uniqueJobs = useMemo(() => {
    const jobs = localApps.map((app) => app.job_title);
    return [...new Set(jobs)];
  }, [localApps]);

  const jobOptionsFilter = useMemo(() => {
    return [
      { value: '', label: 'Todas las vacantes' },
      ...uniqueJobs.map((job) => ({ value: job, label: job })),
    ];
  }, [uniqueJobs]);

  const selectedJobOption =
    jobOptionsFilter.find((opt) => opt.value === jobFilter) ||
    jobOptionsFilter[0];

  const filteredApps = useMemo(() => {
    return localApps.filter((app) => {
      let matchesJob = true;
      let matchesStart = true;
      let matchesEnd = true;

      if (jobFilter) matchesJob = app.job_title === jobFilter;
      if (startDate)
        matchesStart =
          new Date(app.created_at) >= new Date(startDate + 'T00:00:00');
      if (endDate)
        matchesEnd =
          new Date(app.created_at) <= new Date(endDate + 'T23:59:59');

      return matchesJob && matchesStart && matchesEnd;
    });
  }, [localApps, jobFilter, startDate, endDate]);

  useMemo(() => {
    setCurrentPage(1);
  }, [jobFilter, startDate, endDate]);

  const clearFilters = () => {
    setJobFilter('');
    setStartDate('');
    setEndDate('');
  };

  const handleStatusChange = (appId, newStatus) => {
    setLocalApps((prev) =>
      prev.map((app) =>
        app.id === appId ? { ...app, status: newStatus } : app,
      ),
    );

    const originalApp = applications.find((a) => a.id === appId);
    const originalStatus = originalApp?.status || 'Nuevo';

    setPendingChanges((prev) => {
      const updated = { ...prev, [appId]: newStatus };
      if (originalStatus === newStatus) delete updated[appId];
      return updated;
    });
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const promises = Object.entries(pendingChanges).map(([appId, status]) =>
        fetch(`http://localhost:5000/api/applications/${appId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        }),
      );

      await Promise.all(promises);
      setPendingChanges({});
      toast.success('Estados de los postulantes actualizados correctamente'); // 🌟 ALERTA DE ÉXITO
    } catch (error) {
      console.error('Error guardando los cambios:', error);
      toast.error('Ocurrió un error al intentar guardar los cambios.'); // 🌟 ALERTA DE ERROR
    } finally {
      setIsSaving(false);
    }
  };

  // 🌟 FUNCIÓN DE EXPORTACIÓN A CSV (EXCEL)
  const exportToCSV = () => {
    const headers = [
      'Candidato',
      'Vacante',
      'Estado',
      'Correo',
      'Teléfono',
      'LinkedIn',
      'Portafolio',
      'GitHub',
      'Fecha Postulación',
    ];

    const rows = filteredApps.map((app) => [
      `"${app.name || ''}"`,
      `"${app.job_title || ''}"`,
      `"${app.status || 'Nuevo'}"`,
      `"${app.email || ''}"`,
      `"${app.phone || ''}"`,
      `"${app.linkedin || ''}"`,
      `"${app.behance || ''}"`,
      `"${app.github || ''}"`,
      `"${formatDate(app.created_at)}"`,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((e) => e.join(',')),
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `Postulantes_Mood_${new Date().toISOString().split('T')[0]}.csv`,
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.info('Descarga del archivo iniciada'); // 🌟 ALERTA INFORMATIVA OPCIONAL
  };

  const indexOfLastApp = currentPage * itemsPerPage;
  const indexOfFirstApp = indexOfLastApp - itemsPerPage;
  const currentApps = filteredApps.slice(indexOfFirstApp, indexOfLastApp);
  const totalPages = Math.ceil(filteredApps.length / itemsPerPage);

  const formatDate = (dateString) => {
    if (!dateString) return '---';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const parseAnswers = (answersData) => {
    if (!answersData) return {};
    return typeof answersData === 'string'
      ? JSON.parse(answersData)
      : answersData;
  };

  const openCvModal = (app) => setCvModalApp(app);
  const closeCvModal = () => setCvModalApp(null);

  const openAnswersModal = async (app) => {
    setAnswersModalApp(app);
    setIsLoadingQuestions(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/jobs/${app.job_id}`,
      );
      if (response.ok) {
        const data = await response.json();
        const parsedQs =
          typeof data.questions === 'string'
            ? JSON.parse(data.questions)
            : data.questions || [];
        setJobQuestions(parsedQs);
      }
    } catch (error) {
      console.error('Error al cargar preguntas:', error);
      toast.error('Error al cargar las preguntas del formulario.'); // 🌟 ALERTA DE ERROR SECUNDARIA
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const closeAnswersModal = () => {
    setAnswersModalApp(null);
    setJobQuestions([]);
  };

  const hasChanges = Object.keys(pendingChanges).length > 0;

  return (
    <div className='applications-view'>
      <div className='app-filters-bar'>
        <div className='app-filters-left'>
          <div className='filter-group'>
            <label>Puesto postulado</label>
            <Select
              options={jobOptionsFilter}
              value={selectedJobOption}
              onChange={(selected) =>
                setJobFilter(selected ? selected.value : '')
              }
              styles={customSelectStyles}
              placeholder='Seleccionar vacante...'
              isSearchable={false}
            />
          </div>

          <div className='filter-group'>
            <label>Desde (Fecha)</label>
            <input
              type='date'
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className='filter-group'>
            <label>Hasta (Fecha)</label>
            <input
              type='date'
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {(jobFilter || startDate || endDate) && (
            <button
              className='btn-shadcn-ghost'
              onClick={clearFilters}
              title='Limpiar filtros'
            >
              <FilterX size={15} /> <span>Limpiar</span>
            </button>
          )}
        </div>

        {/* 🌟 BOTONES DE ACCIÓN: GUARDAR Y EXPORTAR */}
        <div className='app-filters-right'>
          <button
            className='btn-shadcn-outline'
            onClick={exportToCSV}
            title='Exportar vista actual a Excel'
          >
            <FileSpreadsheet size={15} />
            <span>Exportar</span>
          </button>

          <button
            className='btn-shadcn-primary'
            disabled={!hasChanges || isSaving}
            onClick={handleSaveChanges}
          >
            {isSaving ? (
              <Loader2
                size={15}
                className='spinner-icon'
              />
            ) : (
              <Save size={15} />
            )}
            <span>{isSaving ? 'Guardando...' : 'Guardar'}</span>
          </button>
        </div>
      </div>

      <div className='cms-table-wrapper'>
        <table className='cms-table'>
          <thead>
            <tr>
              <th>Candidato</th>
              <th>Vacante</th>
              <th>Estado</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th style={{ textAlign: 'center' }}>Enlaces</th>
              <th style={{ textAlign: 'center' }}>CV</th>
              <th style={{ textAlign: 'center' }}>Respuestas</th>
            </tr>
          </thead>
          <tbody>
            {currentApps.length > 0 ? (
              currentApps.map((app) => (
                <tr key={app.id}>
                  <td>
                    <div className='app-candidate'>
                      <span className='font-medium'>{app.name}</span>
                      <span className='app-date'>
                        Postuló: {formatDate(app.created_at)}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className='badge badge--job'>{app.job_title}</span>
                  </td>
                  <td>
                    <Select
                      options={statusOptions}
                      value={statusOptions.find(
                        (opt) => opt.value === (app.status || 'Nuevo'),
                      )}
                      onChange={(selectedOption) =>
                        handleStatusChange(app.id, selectedOption.value)
                      }
                      styles={statusSelectStyles}
                      isSearchable={false}
                      menuPortalTarget={document.body}
                    />
                  </td>
                  <td>
                    <div className='app-contact'>
                      <a
                        href={`mailto:${app.email}`}
                        className='contact-link'
                      >
                        <Mail size={14} /> {app.email}
                      </a>
                    </div>
                  </td>
                  <td>
                    <div className='app-contact'>
                      <a
                        href={`https://wa.me/${app.phone?.replace(/\D/g, '')}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='btn-whatsapp'
                      >
                        <MessageCircle size={14} /> {app.phone}
                      </a>
                    </div>
                  </td>
                  <td>
                    <div className='app-links-row'>
                      {app.linkedin && (
                        <a
                          href={app.linkedin}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='icon-link-chip linkedin'
                          title='Ver LinkedIn'
                        >
                          <LinkedinIcon size={16} />
                        </a>
                      )}
                      {app.behance && (
                        <a
                          href={app.behance}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='icon-link-chip portfolio'
                          title='Ver Portafolio Web / Behance'
                        >
                          <Globe size={16} />
                        </a>
                      )}
                      {app.github && (
                        <a
                          href={app.github}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='icon-link-chip github'
                          title='Ver GitHub'
                        >
                          <GithubIcon size={16} />
                        </a>
                      )}
                      {!app.linkedin && !app.behance && !app.github && (
                        <span className='no-data'>-</span>
                      )}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      className='btn-action btn--icon-only btn--view-cv'
                      onClick={() => openCvModal(app)}
                      title='Ver CV del candidato'
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {Object.keys(parseAnswers(app.answers)).length > 0 ? (
                      <button
                        className='btn-action btn--icon-only btn--view-answers'
                        onClick={() => openAnswersModal(app)}
                        title='Ver respuestas del formulario'
                      >
                        <FileText size={16} />
                      </button>
                    ) : (
                      <span className='no-data'>-</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan='8'
                  className='cms-table__empty'
                >
                  {filteredApps.length === 0 && applications.length > 0
                    ? 'No hay postulantes que coincidan con estos filtros.'
                    : 'Aún no hay postulantes registrados en el sistema.'}
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

      {cvModalApp && (
        <div
          className='cms-modal-overlay'
          onClick={closeCvModal}
        >
          <div
            className='cms-modal-content modal-cv'
            onClick={(e) => e.stopPropagation()}
          >
            <header className='cms-modal-header'>
              <div>
                <h3>CV de {cvModalApp.name}</h3>
                <p>Postulante a: {cvModalApp.job_title}</p>
              </div>
              <div className='modal-header-actions'>
                <a
                  href={cvModalApp.cv_url}
                  download
                  target='_blank'
                  rel='noopener noreferrer'
                  className='btn-download-icon'
                  title='Descargar externo'
                >
                  <Download size={18} />
                </a>
                <button
                  className='btn-close'
                  onClick={closeCvModal}
                >
                  <X size={24} />
                </button>
              </div>
            </header>
            <div className='cms-modal-body'>
              <iframe
                src={cvModalApp.cv_url}
                className='cv-iframe'
                title={`CV de ${cvModalApp.name}`}
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {answersModalApp && (
        <div
          className='cms-modal-overlay'
          onClick={closeAnswersModal}
        >
          <div
            className='cms-modal-content modal-answers'
            onClick={(e) => e.stopPropagation()}
          >
            <header className='cms-modal-header'>
              <div>
                <h3>Cuestionario de {answersModalApp.name}</h3>
                <p>Postulante a: {answersModalApp.job_title}</p>
              </div>
              <button
                className='btn-close'
                onClick={closeAnswersModal}
              >
                <X size={24} />
              </button>
            </header>
            <div className='cms-modal-body'>
              {isLoadingQuestions ? (
                <div className='loading-answers'>
                  <Loader2
                    className='spinner-icon'
                    size={32}
                  />
                  <p>Cargando cuestionario...</p>
                </div>
              ) : jobQuestions.length > 0 ? (
                <div className='qa-list'>
                  {jobQuestions.map((q, index) => {
                    const candidateAnswer = parseAnswers(
                      answersModalApp.answers,
                    )[q.id];
                    const formattedAnswer = Array.isArray(candidateAnswer)
                      ? candidateAnswer.join(' • ')
                      : candidateAnswer || 'No respondió';
                    return (
                      <div
                        key={q.id}
                        className='qa-block'
                      >
                        <div className='q-label'>
                          <span className='q-number'>{index + 1}.</span>{' '}
                          {q.label}
                        </div>
                        <div className='a-text'>{formattedAnswer}</div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className='no-questions-msg'>
                  No se encontraron preguntas para esta vacante.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsTable;
