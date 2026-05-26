import { useState } from 'react';
import Select from 'react-select';
import {
  List,
  ListOrdered,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import FilterQuestions from './FilterQuestions';
import './JobForm.scss';

const typeOptions = [
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Freelance', label: 'Freelance' },
  { value: 'Híbrido', label: 'Híbrido' },
];

const countryOptions = [
  { value: 'Peru', label: 'Perú' },
  { value: 'Colombia', label: 'Colombia' },
];

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: '#ffffff',
    borderColor: state.isFocused ? '#000000' : 'rgba(0, 0, 0, 0.15)',
    boxShadow: state.isFocused ? '0 0 0 1px #000000' : 'none',
    borderRadius: '6px',
    padding: '0 2px',
    minHeight: '38px',
    fontSize: '0.875rem',
    cursor: 'pointer',
    '&:hover': {
      borderColor: state.isFocused ? '#000000' : 'rgba(0, 0, 0, 0.25)',
    },
  }),
  option: (provided, state) => ({
    ...provided,
    fontSize: '0.875rem',
    backgroundColor: state.isSelected
      ? '#000000'
      : state.isFocused
        ? 'rgba(0,0,0,0.05)'
        : '#ffffff',
    color: state.isSelected ? '#ffffff' : '#000000',
    cursor: 'pointer',
    '&:active': {
      backgroundColor: 'rgba(0,0,0,0.1)',
    },
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: '6px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid rgba(0,0,0,0.1)',
    overflow: 'hidden',
    zIndex: 5,
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#000000',
  }),
};

const JobForm = ({ onSubmitSuccess, onCancel }) => {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    title: '',
    type: 'Full-time',
    country: 'Peru',
    description: '',
    responsibilities: '',
    requirements: '',
    benefits: '',
    filterQuestions: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (selectedOption, actionMeta) => {
    setFormData({ ...formData, [actionMeta.name]: selectedOption.value });
  };

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

  // 🌟 ACTUALIZADO: Manejo del submit final con confirmación
  const handleFinalSubmit = async (e) => {
    e.preventDefault(); // Previene recargas indeseadas al enviar el formulario

    // Validación extra: Verificar si hay preguntas múltiples sin opciones
    const hasEmptyMultipleChoice = formData.filterQuestions.some(
      (q) => q.type === 'multiple' && q.options.length === 0,
    );

    if (hasEmptyMultipleChoice) {
      alert(
        "⚠️ Tienes preguntas de 'Opción Múltiple' sin opciones asignadas. Por favor agrega al menos una opción.",
      );
      return;
    }

    // Modal nativo de confirmación
    const confirmPublish = window.confirm(
      '¿Estás seguro de publicar esta vacante? \n\nAsegúrate de que las preguntas de filtrado estén correctas.',
    );

    if (!confirmPublish) return; // Si el usuario cancela, detenemos el proceso

    const token = localStorage.getItem('cms_token');
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
      const response = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        alert('✅ ¡Vacante y preguntas publicadas con éxito!');
        onSubmitSuccess();
      } else {
        alert('❌ Hubo un error al publicar la vacante.');
      }
    } catch (error) {
      console.error('Error al publicar:', error);
    }
  };

  return (
    <div className='cms-job-form'>
      {/* HEADER COMPARTIDO */}
      <div className='cms-job-form__header-fixed'>
        <h2>{step === 1 ? 'Nueva Vacante' : 'Preguntas Filtro'}</h2>
        <span className='cms-job-form__step-indicator'>Paso {step} de 2</span>
      </div>

      {/* ==============================================
          PASO 1: DATOS DEL PUESTO
          ============================================== */}
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
                    options={typeOptions}
                    value={typeOptions.find(
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
                    options={countryOptions}
                    value={countryOptions.find(
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

      {/* ==============================================
          PASO 2: PREGUNTAS FILTRO
          ============================================== */}
      {step === 2 && (
        <form
          className='cms-job-form__step-wrapper'
          onSubmit={
            handleFinalSubmit
          } /* 🌟 El form captura el Enter y el botón submit */
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
            >
              <ArrowLeft size={16} /> Atrás
            </button>
            <button
              type='submit' /* 🌟 Cambiado a tipo submit para activar validación nativa */
              className='btn-submit'
            >
              <CheckCircle2 size={16} /> Publicar Vacante
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default JobForm;
