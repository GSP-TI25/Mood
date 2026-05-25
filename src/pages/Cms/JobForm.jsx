import { useState } from 'react';
import { List, ListOrdered } from 'lucide-react';
import './JobForm.scss';

const JobForm = ({ onSubmitSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Full-time',
    country: 'Peru',
    description: '',
    responsibilities: '',
    requirements: '',
    benefits: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Función mágica: Toma el texto del textarea y le pone viñetas o números a cada línea
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('cms_token');

    // 🌟 AUTOMATIZACIÓN DE FECHA: Generamos "Mes Año" en tiempo real (Ej: Mayo 2026)
    const currentDate = new Date();
    const month = currentDate.toLocaleString('es-ES', { month: 'long' });
    const year = currentDate.getFullYear();
    const formattedDate = `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;

    // Función para convertir el bloque de texto en un Array limpio para PostgreSQL
    const convertToArray = (text) => {
      return text
        .split('\n')
        .map((line) => line.replace(/^[\d\.\•\-\s]+/, '').trim())
        .filter((line) => line !== '');
    };

    // Preparamos los datos con la fecha automática
    const dataToSend = {
      ...formData,
      category: 'General',
      date: formattedDate, // <--- Aquí inyectamos la fecha actual automáticamente
      responsibilities: convertToArray(formData.responsibilities),
      requirements: convertToArray(formData.requirements),
      benefits: convertToArray(formData.benefits),
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
        alert('¡Vacante publicada con éxito!');
        onSubmitSuccess();
      } else {
        alert('Hubo un error al publicar la vacante.');
      }
    } catch (error) {
      console.error('Error al publicar:', error);
    }
  };

  return (
    <form
      className='cms-job-form'
      onSubmit={handleSubmit}
    >
      <div className='cms-job-form__header-fixed'>
        <h2>Nueva Vacante</h2>
      </div>

      <div className='cms-job-form__scroll-area'>
        {/* BÁSICOS */}
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
              <select
                name='type'
                value={formData.type}
                onChange={handleInputChange}
              >
                <option value='Full-time'>Full-time</option>
                <option value='Part-time'>Part-time</option>
                <option value='Freelance'>Freelance</option>
                <option value='Híbrido'>Híbrido</option>
              </select>
            </div>
            <div className='cms-job-form__group'>
              <label>Sede</label>
              <select
                name='country'
                value={formData.country}
                onChange={handleInputChange}
              >
                <option value='Peru'>Perú</option>
                <option value='Colombia'>Colombia</option>
              </select>
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

        {/* DETALLES CON FORMATO */}
        <div className='cms-job-form__section'>
          {/* Responsabilidades */}
          <div className='cms-job-form__group'>
            <div className='cms-job-form__label-bar'>
              <label>Responsabilidades</label>
              <div className='cms-job-form__toolbar'>
                <button
                  type='button'
                  onClick={() => handleFormatText('responsibilities', 'ul')}
                  title='Lista con viñetas'
                >
                  <List size={16} />
                </button>
                <button
                  type='button'
                  onClick={() => handleFormatText('responsibilities', 'ol')}
                  title='Lista numerada'
                >
                  <ListOrdered size={16} />
                </button>
              </div>
            </div>
            <textarea
              name='responsibilities'
              value={formData.responsibilities}
              onChange={handleInputChange}
              placeholder='Pega las tareas y presiona los botones de arriba...'
              className='textarea-large'
            ></textarea>
          </div>

          {/* Requisitos */}
          <div className='cms-job-form__group'>
            <div className='cms-job-form__label-bar'>
              <label>Requisitos</label>
              <div className='cms-job-form__toolbar'>
                <button
                  type='button'
                  onClick={() => handleFormatText('requirements', 'ul')}
                  title='Lista con viñetas'
                >
                  <List size={16} />
                </button>
                <button
                  type='button'
                  onClick={() => handleFormatText('requirements', 'ol')}
                  title='Lista numerada'
                >
                  <ListOrdered size={16} />
                </button>
              </div>
            </div>
            <textarea
              name='requirements'
              value={formData.requirements}
              onChange={handleInputChange}
              placeholder='Pega los requisitos...'
              className='textarea-large'
            ></textarea>
          </div>

          {/* Beneficios */}
          <div className='cms-job-form__group'>
            <div className='cms-job-form__label-bar'>
              <label>Beneficios</label>
              <div className='cms-job-form__toolbar'>
                <button
                  type='button'
                  onClick={() => handleFormatText('benefits', 'ul')}
                  title='Lista con viñetas'
                >
                  <List size={16} />
                </button>
                <button
                  type='button'
                  onClick={() => handleFormatText('benefits', 'ol')}
                  title='Lista numerada'
                >
                  <ListOrdered size={16} />
                </button>
              </div>
            </div>
            <textarea
              name='benefits'
              value={formData.benefits}
              onChange={handleInputChange}
              placeholder='Pega los beneficios...'
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
          className='btn-submit'
        >
          Publicar Vacante
        </button>
      </div>
    </form>
  );
};

export default JobForm;
