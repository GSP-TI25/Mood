// src/pages/Cms/Views/Vacantes/VacantesView.jsx
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Plus } from 'lucide-react';
import JobsTable from '../../../../components/Cms/JobsTable';
import JobForm from '../../../../components/Cms/JobForm';
import ConfirmModal from '../../../../components/Cms/ConfirmModal/ConfirmModal';
import './VacantesView.scss';

/**
 * Componente VacantesView.
 * Vista principal para la gestión de puestos de trabajo disponibles en la agencia.
 * Orquesta la tabla de vacantes, el formulario de creación/edición y el modal de confirmación.
 */
const VacantesView = () => {
  const [jobs, setJobs] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState(null);

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    message: '',
    onConfirm: null,
  });

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('cms_token');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/jobs`,
      );
      if (response.ok) {
        setJobs(await response.json());
      }
    } catch (error) {
      console.error('Error cargando vacantes:', error);
      toast.error('Error al cargar las vacantes.');
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleToggleStatus = (jobId) => {
    setConfirmDialog({
      isOpen: true,
      message: '¿Seguro que deseas cambiar el estado de esta vacante?',
      onConfirm: async () => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/jobs/${jobId}/status`,
            { method: 'PATCH', headers: getAuthHeaders() },
          );
          if (response.ok) {
            toast.success('Estado de vacante actualizado');
            fetchJobs();
          } else {
            toast.error('Hubo un error al actualizar la vacante');
          }
        } catch (error) {
          toast.error('Error de conexión al servidor.');
        }
      },
    });
  };

  /**
   * Controlador para que los componentes hijos (JobForm) soliciten confirmación.
   */
  const handleRequestConfirm = (message, actionCallback) => {
    setConfirmDialog({
      isOpen: true,
      message,
      onConfirm: actionCallback,
    });
  };

  const openCreateForm = () => {
    setJobToEdit(null);
    setIsFormOpen(true);
  };

  const openEditForm = async (jobShort) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/jobs/${jobShort.id}`,
      );
      if (response.ok) {
        const fullJob = await response.json();
        setJobToEdit(fullJob);
        setIsFormOpen(true);
      } else {
        toast.error('No se pudo obtener la información de la vacante.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error al cargar los detalles de la vacante.');
    }
  };

  const handleSuccess = () => {
    setIsFormOpen(false);
    fetchJobs();
  };

  return (
    <div className='view-container'>
      <header className='cms-main-content__header'>
        <div>
          <h1>Gestión de Vacantes</h1>
          <p>Administra los puestos de trabajo disponibles en la agencia.</p>
        </div>
        <button
          className='cms-btn-primary'
          onClick={openCreateForm}
        >
          <Plus
            size={16}
            strokeWidth={3}
          />{' '}
          Nueva Vacante
        </button>
      </header>

      <JobsTable
        jobs={jobs}
        onToggleStatus={handleToggleStatus}
        onEdit={openEditForm}
      />

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
              jobToEdit={jobToEdit}
              onSubmitSuccess={handleSuccess}
              onCancel={() => setIsFormOpen(false)}
              onRequestConfirm={handleRequestConfirm} // 🌟 Prop delegada al hijo
            />
          </div>
        </div>
      )}

      {/* Modal Genérico Reutilizable */}
      <ConfirmModal
        isOpen={confirmDialog.isOpen}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      />
    </div>
  );
};

export default VacantesView;
