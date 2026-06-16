// src/components/Cms/TeamForm.jsx
import { useState, useRef } from 'react';
import { ArrowRight, Image as ImageIcon, Trash2, Info } from 'lucide-react';
import { toast } from 'react-toastify';
import './TeamForm.scss';

/**
 * Utilidad para sanitizar las entradas de texto del usuario.
 * Previene inyección de etiquetas HTML (XSS).
 * @param {string} str - Cadena de texto a sanitizar.
 * @returns {string} Cadena sanitizada.
 */
const sanitizeInput = (str) => {
  if (!str) return '';
  return str.replace(/<\/?[^>]+(>|$)/g, '').trim();
};

/**
 * Componente TeamForm.
 * Gestiona la creación y edición de miembros del equipo.
 * Delega la confirmación de guardado al componente padre mediante `onRequestConfirm`.
 *
 * @param {Object} props
 * @param {Function} props.onSubmitSuccess
 * @param {Function} props.onCancel
 * @param {Object} props.memberToEdit
 * @param {Function} props.onRequestConfirm - Callback para solicitar confirmación al padre
 */
const TeamForm = ({
  onSubmitSuccess,
  onCancel,
  memberToEdit,
  onRequestConfirm,
}) => {
  const fileInputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    memberToEdit?.image_url || '',
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: memberToEdit?.name || '',
    role_key: memberToEdit?.role_key || '',
    linkedin: memberToEdit?.linkedin || '',
  });

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      toast.warning('Formato no soportado. Sólo JPG, PNG y WEBP.');
      e.target.value = '';
      return;
    }

    if (file.size / (1024 * 1024) > 2) {
      toast.warning('La foto no debe superar los 2MB.');
      e.target.value = '';
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Intercepta el submit y le pide al PADRE (EquipoView) que muestre el modal
  const handleFormSubmit = (e) => {
    e.preventDefault();
    onRequestConfirm(
      memberToEdit
        ? '¿Guardar cambios del miembro?'
        : '¿Agregar este miembro al equipo?',
      executeSubmit, // Pasamos la función que el modal ejecutará si el usuario da click a "Aceptar"
    );
  };

  // Función de ejecución real
  const executeSubmit = async () => {
    setIsSubmitting(true);
    const token = localStorage.getItem('cms_token');

    if (!token) {
      toast.error('Sesión expirada. Por favor, vuelve a iniciar sesión.');
      setIsSubmitting(false);
      return;
    }

    const dataToSend = new FormData();
    dataToSend.append('name', sanitizeInput(formData.name));
    dataToSend.append('role_key', sanitizeInput(formData.role_key));
    dataToSend.append('linkedin', sanitizeInput(formData.linkedin));

    if (imageFile) {
      dataToSend.append('image_url', imageFile);
    }

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const url = memberToEdit
        ? `${baseUrl}/api/team/${memberToEdit.id}`
        : `${baseUrl}/api/team`;
      const method = memberToEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { Authorization: `Bearer ${token}` },
        body: dataToSend,
      });

      if (response.ok) {
        toast.success('¡Miembro guardado con éxito!');
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

  return (
    <div className='cms-team-form'>
      <div className='cms-team-form__header-fixed'>
        <h2>{memberToEdit ? 'Editar Miembro' : 'Nuevo Miembro'}</h2>
      </div>

      <form
        className='cms-team-form__step-wrapper'
        onSubmit={handleFormSubmit}
      >
        <div className='cms-team-form__scroll-area'>
          <div className='cms-team-form__info-box'>
            <Info size={18} />
            <p>
              <strong>Regla de visualización:</strong> Si subes una foto, el
              miembro aparecerá en la sección superior de{' '}
              <strong>Liderazgo</strong>. Si lo dejas sin foto, aparecerá en el
              carrusel inferior del <strong>Equipo</strong>.
            </p>
          </div>

          <div
            className='cms-team-form__section'
            style={{ alignItems: 'center' }}
          >
            {imagePreview ? (
              <div
                style={{
                  position: 'relative',
                  width: '160px',
                  height: '160px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  backgroundColor: '#f1f5f9',
                  border: '2px solid #e2e8f0',
                  margin: '0 auto',
                }}
              >
                <img
                  src={imagePreview}
                  alt='Preview'
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  type='button'
                  onClick={clearImage}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    border: 'none',
                    borderRadius: '50%',
                    padding: '12px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    color: '#ef4444',
                  }}
                  title='Eliminar foto'
                >
                  <Trash2 size={24} />
                </button>
              </div>
            ) : (
              <button
                type='button'
                onClick={() => fileInputRef.current.click()}
                style={{
                  width: '160px',
                  height: '160px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  border: '2px dashed #cbd5e1',
                  backgroundColor: '#fafafa',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  gap: '0.5rem',
                  color: '#334155',
                  margin: '0 auto',
                }}
              >
                <ImageIcon
                  size={32}
                  color='#64748b'
                />
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textAlign: 'center',
                    padding: '0 10px',
                  }}
                >
                  Subir Foto (Opcional)
                </span>
              </button>
            )}
            <input
              type='file'
              accept='image/jpeg, image/png, image/webp'
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>

          <div className='cms-team-form__section'>
            <div className='cms-team-form__group'>
              <label>Nombre y Apellido</label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder='Ej. Matthias Stimman'
              />
            </div>

            <div className='cms-team-form__group-row'>
              <div className='cms-team-form__group'>
                <label>Cargo / Rol</label>
                <input
                  type='text'
                  name='role_key'
                  value={formData.role_key}
                  onChange={handleInputChange}
                  required
                  placeholder='Ej. Director Creativo'
                />
              </div>
              <div className='cms-team-form__group'>
                <label>Enlace de LinkedIn (Opcional)</label>
                <input
                  type='url'
                  name='linkedin'
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  placeholder='https://linkedin.com/in/...'
                />
              </div>
            </div>
          </div>
        </div>

        <div className='cms-team-form__actions-fixed'>
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
            {isSubmitting ? 'Guardando...' : 'Guardar Miembro'}{' '}
            <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default TeamForm;
