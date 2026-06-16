// src/components/Cms/JobForm.jsx
import { useState } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import {
  List,
  ListOrdered,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import FilterQuestions from './FilterQuestions';
import jobOptions from '../../data/jobOptions.json';
import './JobForm.scss';

/**
 * Estilos personalizados para el componente React-Select.
 */
const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: '#ffffff',
    borderColor: state.isFocused ? '#0f172a' : '#cbd5e1',
    boxShadow: state.isFocused ? '0 0 0 1px #0f172a' : 'none',
    borderRadius: '6px',
    padding: '0 2px',
    minHeight: '38px',
    fontSize: '0.875rem',
    cursor: 'pointer',
    '&:hover': {
      borderColor: state.isFocused ? '#0f172a' : '#94a3b8',
    },
  }),
  option: (provided, state) => ({
    ...provided,
    fontSize: '0.875rem',
    backgroundColor: state.isSelected
      ? '#0f172a'
      : state.isFocused
        ? '#f8fafc'
        : '#ffffff',
    color: state.isSelected ? '#ffffff' : '#0f172a',
    cursor: 'pointer',
    '&:active': {
      backgroundColor: '#e2e8f0',
    },
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: '6px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    zIndex: 5,
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#0f172a',
  }),
};

/**
 * Componente JobForm.
 * Formulario multipaso para la creación y edición de vacantes laborales,
 * incluyendo las preguntas de filtrado para candidatos.
 *
 * @param {Object} props
 * @param {Function} props.onSubmitSuccess - Callback ejecutado tras guardar exitosamente.
 * @param {Function} props.onCancel - Callback para cerrar el formulario.
 * @param {Object} [props.jobToEdit] - Datos de la vacante si está en modo edición.
 * @param {Function} props.onRequestConfirm - Función delegada al padre para mostrar el modal de confirmación.
 */
const JobForm = ({
  onSubmitSuccess,
  onCancel,
  jobToEdit,
  onRequestConfirm,
}) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: jobToEdit?.title || '',
    type: jobToEdit?.type || 'Full-time',
    country: jobToEdit?.country || 'Peru',
    description: jobToEdit?.description || '',
    responsibilities: jobToEdit?.responsibilities
      ? jobToEdit.responsibilities.join('\n• ')
      : '',
    requirements: jobToEdit?.requirements
      ? jobToEdit.requirements.join('\n• ')
      : '',
    benefits: jobToEdit?.benefits ? jobToEdit.benefits.join('\n• ') : '',
    filterQuestions: jobToEdit?.questions
      ? typeof jobToEdit.questions === 'string'
        ? JSON.parse(jobToEdit.questions)
        : jobToEdit.questions
      : [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (selectedOption, actionMeta) => {
    setFormData({ ...formData, [actionMeta.name]: selectedOption.value });
  };

  /**
   * Formatea un bloque de texto como lista ordenada o desordenada (viñetas).
   */
  const handleFormatText = (field, formatType) => {
    const text = formData[field];
    if (!text.trim()) return;

    const lines = text.split('\n');
    let formattedText = '';

    if (formatType === 'ul') {
      formattedText = lines
        .map((line) => line.replace(/^[\d\.\•\-\s]+/, '').trim())
        .map((line) => (line ? `• ${line}` : ''))
        .join('\n');
    } else if (formatType === 'ol') {
      formattedText = lines
        .map((line) => line.replace(/^[\d\.\•\-\s]+/, '').trim())
        .map((line, index) => (line ? `${index + 1}. ${line}` : ''))
        .join('\n');
    }

    setFormData({ ...formData, [field]: formattedText });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  /**
   * Intercepta el submit para validar y solicitar confirmación al padre.
   */
  const handleFormSubmit = (e) => {
    e.preventDefault();

    const hasEmptyMultipleChoice = formData.filterQuestions.some(
      (q) => q.type === 'multiple' && q.options.length === 0,
    );

    if (hasEmptyMultipleChoice) {
      toast.warning(
        "Tienes preguntas de 'Opción Múltiple' sin opciones asignadas. Por favor agrega al menos una opción.",
      );
      return;
    }

    const confirmMessage = jobToEdit
      ? '¿Estás seguro de guardar los cambios en esta vacante?'
      : '¿Estás seguro de publicar esta vacante? Asegúrate de que las preguntas de filtrado estén correctas.';

    onRequestConfirm(confirmMessage, executeSubmit);
  };

  /**
   * Ejecuta la petición al servidor tras la confirmación del usuario.
   */
  const executeSubmit = async () => {
    setIsSubmitting(true);
    const token = localStorage.getItem('cms_token');

    if (!token) {
      toast.error('Sesión expirada. Por favor, vuelve a iniciar sesión.');
      setIsSubmitting(false);
      return;
    }

    const currentDate = new Date();
    const month = currentDate.toLocaleString('es-ES', { month: 'long' });
    const year = currentDate.getFullYear();
    const formattedDate = `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;

    const convertToArray = (text) => {
      return text
        .split('\n')
        .map((line) => line.replace(/^[\d\.\•\-\s]+/, '').trim())
        .filter((line) => line !== '');
    };

    const dataToSend = {
      ...formData,
      category: 'General',
      date: formattedDate,
      responsibilities: convertToArray(formData.responsibilities),
      requirements: convertToArray(formData.requirements),
      benefits: convertToArray(formData.benefits),
      questions: formData.filterQuestions,
    };

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const url = jobToEdit
        ? `${baseUrl}/api/jobs/${jobToEdit.id}`
        : `${baseUrl}/api/jobs`;
      const method = jobToEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        toast.success(
          jobToEdit
            ? 'Vacante actualizada con éxito'
            : 'Vacante publicada con éxito',
        );
        onSubmitSuccess();
      } else {
        const errorData = await response.json();
        toast.error(`Error al procesar: ${errorData.message || 'Desconocido'}`);
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      toast.error('Error de conexión con el servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='cms-job-form'>
      <div className='cms-job-form__header-fixed'>
        <h2>{step === 1 ? 'Nueva Vacante' : 'Preguntas Filtro'}</h2>
        <span className='cms-job-form__step-indicator'>Paso {step} de 2</span>
      </div>

      {step === 1 && (
        <form
          className='cms-job-form__step-wrapper'
          onSubmit={handleNextStep}
        >
          <div className='cms-job-form__scroll-area'>
            <div className='cms-job-form__section'>
              <div className='cms-job-form__group'>
                <label>Título del Puesto</label>
                <input
                  type='text'
                  name='title'
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder='Ej. Content Creator'
                  required
                />
              </div>

              <div className='cms-job-form__group-row'>
                <div className='cms-job-form__group'>
                  <label>Modalidad</label>
                  <Select
                    name='type'
                    options={jobOptions.types}
                    value={jobOptions.types.find(
                      (opt) => opt.value === formData.type,
                    )}
                    onChange={handleSelectChange}
                    styles={customSelectStyles}
                    isSearchable={false}
                  />
                </div>
                <div className='cms-job-form__group'>
                  <label>Sede</label>
                  <Select
                    name='country'
                    options={jobOptions.countries}
                    value={jobOptions.countries.find(
                      (opt) => opt.value === formData.country,
                    )}
                    onChange={handleSelectChange}
                    styles={customSelectStyles}
                    isSearchable={false}
                  />
                </div>
              </div>

              <div className='cms-job-form__group'>
                <label>Descripción General</label>
                <textarea
                  name='description'
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder='Propósito de la posición...'
                  required
                  className='textarea-small'
                ></textarea>
              </div>
            </div>

            <hr className='cms-job-form__divider' />

            <div className='cms-job-form__section'>
              <div className='cms-job-form__group'>
                <div className='cms-job-form__label-bar'>
                  <label>Responsabilidades</label>
                  <div className='cms-job-form__toolbar'>
                    <button
                      type='button'
                      onClick={() => handleFormatText('responsibilities', 'ul')}
                    >
                      <List size={16} />
                    </button>
                    <button
                      type='button'
                      onClick={() => handleFormatText('responsibilities', 'ol')}
                    >
                      <ListOrdered size={16} />
                    </button>
                  </div>
                </div>
                <textarea
                  name='responsibilities'
                  value={formData.responsibilities}
                  onChange={handleInputChange}
                  className='textarea-large'
                ></textarea>
              </div>

              <div className='cms-job-form__group'>
                <div className='cms-job-form__label-bar'>
                  <label>Requisitos</label>
                  <div className='cms-job-form__toolbar'>
                    <button
                      type='button'
                      onClick={() => handleFormatText('requirements', 'ul')}
                    >
                      <List size={16} />
                    </button>
                    <button
                      type='button'
                      onClick={() => handleFormatText('requirements', 'ol')}
                    >
                      <ListOrdered size={16} />
                    </button>
                  </div>
                </div>
                <textarea
                  name='requirements'
                  value={formData.requirements}
                  onChange={handleInputChange}
                  className='textarea-large'
                ></textarea>
              </div>

              <div className='cms-job-form__group'>
                <div className='cms-job-form__label-bar'>
                  <label>Beneficios</label>
                  <div className='cms-job-form__toolbar'>
                    <button
                      type='button'
                      onClick={() => handleFormatText('benefits', 'ul')}
                    >
                      <List size={16} />
                    </button>
                    <button
                      type='button'
                      onClick={() => handleFormatText('benefits', 'ol')}
                    >
                      <ListOrdered size={16} />
                    </button>
                  </div>
                </div>
                <textarea
                  name='benefits'
                  value={formData.benefits}
                  onChange={handleInputChange}
                  className='textarea-large'
                ></textarea>
              </div>
            </div>
          </div>

          <div className='cms-job-form__actions-fixed'>
            <button
              type='button'
              className='btn-cancel'
              onClick={onCancel}
            >
              Cancelar
            </button>
            <button
              type='submit'
              className='btn-next'
            >
              Siguiente <ArrowRight size={16} />
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form
          className='cms-job-form__step-wrapper'
          onSubmit={handleFormSubmit}
        >
          <div className='cms-job-form__scroll-area'>
            <FilterQuestions
              questions={formData.filterQuestions}
              onChange={(newQuestions) =>
                setFormData({ ...formData, filterQuestions: newQuestions })
              }
            />
          </div>

          <div className='cms-job-form__actions-fixed'>
            <button
              type='button'
              className='btn-cancel'
              onClick={handlePrevStep}
              disabled={isSubmitting}
            >
              <ArrowLeft size={16} /> Atrás
            </button>
            <button
              type='submit'
              className='btn-submit'
              disabled={isSubmitting}
            >
              <CheckCircle2 size={16} />{' '}
              {isSubmitting ? 'Guardando...' : 'Publicar Vacante'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default JobForm;
