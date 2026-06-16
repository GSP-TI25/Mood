// src/components/Cms/ProjectForm.jsx
import { useState, useRef } from 'react';
import Select from 'react-select';
import {
  ArrowRight,
  Image as ImageIcon,
  Video as VideoIcon,
  Trash2,
} from 'lucide-react';
import { toast } from 'react-toastify';
import categoryOptions from '../../data/projectCategories.json';
import './ProjectForm.scss';

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
  }),
  menu: (provided) => ({ ...provided, zIndex: 5 }),
};

/**
 * Utilidad para sanitizar las entradas de texto del usuario.
 * Previene inyección de etiquetas HTML (XSS).
 */
const sanitizeInput = (str) => {
  if (!str) return '';
  return str.replace(/<\/?[^>]+(>|$)/g, '').trim();
};

/**
 * Componente ProjectForm.
 * Formulario para crear o editar proyectos del portafolio.
 *
 * @param {Object} props
 * @param {Function} props.onSubmitSuccess - Callback ejecutado tras guardar correctamente.
 * @param {Function} props.onCancel - Callback para cerrar o cancelar el formulario.
 * @param {Object} [props.projectToEdit] - Datos del proyecto si se está en modo edición.
 * @param {Function} props.onRequestConfirm - Callback para solicitar confirmación al componente padre.
 */
const ProjectForm = ({
  onSubmitSuccess,
  onCancel,
  projectToEdit,
  onRequestConfirm,
}) => {
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    projectToEdit?.img_url || '',
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: projectToEdit?.title || '',
    category: projectToEdit?.category || 'Branding',
    client: projectToEdit?.client || '',
    date: projectToEdit?.date || '',
    description: projectToEdit?.description || '',
    project_url: projectToEdit?.project_url || '',
  });

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSelectChange = (selectedOption) =>
    setFormData({ ...formData, category: selectedOption.value });

  /**
   * Maneja la selección de archivos (Imagen o Video), validando tipo y peso.
   */
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const sizeInMB = file.size / (1024 * 1024);

    if (type === 'image') {
      if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
        toast.warning('Formato no soportado. Sólo JPG, PNG y WEBP.');
        e.target.value = '';
        return;
      }
      if (sizeInMB > 2) {
        toast.warning('La imagen no debe superar los 2MB.');
        e.target.value = '';
        return;
      }
    }

    if (type === 'video') {
      if (!file.type.match(/^video\/(mp4|webm)$/)) {
        toast.warning('Formato de video no soportado. Sólo MP4 y WEBM.');
        e.target.value = '';
        return;
      }
      if (sizeInMB > 15) {
        toast.warning('El video no debe superar los 15MB.');
        e.target.value = '';
        return;
      }
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearMedia = () => {
    setImageFile(null);
    setImagePreview('');
    if (imageInputRef.current) imageInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  /**
   * Intercepta el submit para validar y solicitar confirmación al padre.
   */
  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!imageFile && !imagePreview) {
      toast.warning('El archivo del proyecto (Imagen o Video) es obligatorio.');
      return;
    }

    onRequestConfirm(
      projectToEdit
        ? '¿Guardar cambios del proyecto?'
        : '¿Publicar proyecto en el portafolio?',
      executeSubmit,
    );
  };

  /**
   * Procesa el envío de datos al backend.
   */
  const executeSubmit = async () => {
    setIsSubmitting(true);
    const token = localStorage.getItem('cms_token');

    if (!token) {
      toast.error('Sesión expirada. Por favor, vuelve a iniciar sesión.');
      setIsSubmitting(false);
      return;
    }

    const dataToSend = new FormData();
    dataToSend.append('title', sanitizeInput(formData.title));
    dataToSend.append('category', sanitizeInput(formData.category));
    dataToSend.append('client', sanitizeInput(formData.client));
    dataToSend.append('date', sanitizeInput(formData.date));
    dataToSend.append('description', sanitizeInput(formData.description));
    dataToSend.append('project_url', sanitizeInput(formData.project_url));

    if (imageFile) {
      dataToSend.append('img_url', imageFile);
    }

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const url = projectToEdit
        ? `${baseUrl}/api/projects/${projectToEdit.id}`
        : `${baseUrl}/api/projects`;
      const method = projectToEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { Authorization: `Bearer ${token}` },
        body: dataToSend,
      });

      if (response.ok) {
        toast.success('¡Proyecto guardado con éxito!');
        onSubmitSuccess();
      } else {
        const errorData = await response.json();
        toast.error(`Error al guardar: ${errorData.message || 'Desconocido'}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error de conexión al intentar guardar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isVideoMedia =
    imagePreview.match(/\.(mp4|webm|mov|ogg)$/i) ||
    (imageFile && imageFile.type.startsWith('video/'));

  return (
    <div className='cms-project-form'>
      <div className='cms-project-form__header-fixed'>
        <h2>{projectToEdit ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h2>
      </div>

      <form
        className='cms-project-form__step-wrapper'
        onSubmit={handleFormSubmit}
      >
        <div className='cms-project-form__scroll-area'>
          <div className='cms-project-form__section'>
            <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>
              Media del Proyecto
            </label>

            {imagePreview ? (
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '240px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                }}
              >
                {isVideoMedia ? (
                  <video
                    src={imagePreview}
                    autoPlay
                    muted
                    loop
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <img
                    src={imagePreview}
                    alt='Preview'
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                )}

                <button
                  type='button'
                  onClick={clearMedia}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    border: 'none',
                    borderRadius: '50%',
                    padding: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    display: 'flex',
                    color: '#ef4444',
                  }}
                  title='Eliminar media'
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                <button
                  type='button'
                  onClick={() => imageInputRef.current.click()}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    borderRadius: '8px',
                    border: '1px dashed #cbd5e1',
                    backgroundColor: '#f8fafc',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    gap: '0.5rem',
                    color: '#475569',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = '#f1f5f9')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = '#f8fafc')
                  }
                >
                  <ImageIcon
                    size={32}
                    color='#64748b'
                  />
                  <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>
                    Subir Imagen
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    JPG, PNG, WEBP (Max 2MB)
                  </span>
                </button>

                <button
                  type='button'
                  onClick={() => videoInputRef.current.click()}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    borderRadius: '8px',
                    border: '1px dashed #cbd5e1',
                    backgroundColor: '#f8fafc',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    gap: '0.5rem',
                    color: '#475569',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = '#f1f5f9')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = '#f8fafc')
                  }
                >
                  <VideoIcon
                    size={32}
                    color='#64748b'
                  />
                  <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>
                    Subir Video
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    MP4, WEBM (Max 15MB)
                  </span>
                </button>
              </div>
            )}

            <input
              type='file'
              accept='image/jpeg, image/png, image/webp'
              ref={imageInputRef}
              onChange={(e) => handleFileChange(e, 'image')}
              style={{ display: 'none' }}
            />
            <input
              type='file'
              accept='video/mp4, video/webm'
              ref={videoInputRef}
              onChange={(e) => handleFileChange(e, 'video')}
              style={{ display: 'none' }}
            />
          </div>

          <div className='cms-project-form__section'>
            <div className='cms-project-form__group'>
              <label>Título del Proyecto</label>
              <input
                type='text'
                name='title'
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className='cms-project-form__group-row'>
              <div className='cms-project-form__group'>
                <label>Categoría</label>
                <Select
                  name='category'
                  options={categoryOptions}
                  value={categoryOptions.find(
                    (opt) => opt.value === formData.category,
                  )}
                  onChange={handleSelectChange}
                  styles={customSelectStyles}
                  isSearchable={false}
                />
              </div>
              <div className='cms-project-form__group'>
                <label>Fecha del Proyecto</label>
                <input
                  type='text'
                  name='date'
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className='cms-project-form__group-row'>
              <div className='cms-project-form__group'>
                <label>Cliente (Marca)</label>
                <input
                  type='text'
                  name='client'
                  value={formData.client}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className='cms-project-form__group'>
                <label>Enlace del Proyecto (Opcional)</label>
                <input
                  type='url'
                  name='project_url'
                  value={formData.project_url}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className='cms-project-form__group'>
              <label>Descripción / Detalle del trabajo (Opcional)</label>
              <textarea
                name='description'
                value={formData.description}
                onChange={handleInputChange}
                className='textarea-small'
              ></textarea>
            </div>
          </div>
        </div>

        <div className='cms-project-form__actions-fixed'>
          <button
            type='button'
            className='btn-cancel'
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type='submit'
            className='btn-submit'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Proyecto'}{' '}
            <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
