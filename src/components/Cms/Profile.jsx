// src/components/Cms/Profile.jsx
import { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Select from 'react-select';
import { Camera, Save, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import './Profile.scss';

/**
 * Estilos personalizados para el componente React-Select.
 */
const selectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: '#ffffff',
    borderColor: state.isFocused ? '#0f172a' : '#cbd5e1',
    boxShadow: state.isFocused ? '0 0 0 1px #0f172a' : 'none',
    '&:hover': { borderColor: state.isFocused ? '#0f172a' : '#94a3b8' },
    borderRadius: '6px',
    fontSize: '0.875rem',
    minHeight: '40px',
    cursor: 'pointer',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? '#0f172a'
      : state.isFocused
        ? '#f1f5f9'
        : '#ffffff',
    color: state.isSelected ? '#ffffff' : '#0f172a',
    fontSize: '0.875rem',
    cursor: 'pointer',
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: '6px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    zIndex: 5,
  }),
};

/**
 * Componente Profile.
 * Vista para que el usuario autenticado pueda gestionar sus datos personales,
 * actualizar su avatar y cambiar su contraseña.
 */
const Profile = () => {
  const { user, login } = useContext(AuthContext);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    country: '',
    password: '',
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [countryOptions, setCountryOptions] = useState([]);

  /**
   * Obtiene la lista de países disponibles desde el backend.
   */
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${baseUrl}/api/countries`);
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setCountryOptions(result.data);
          }
        }
      } catch (error) {
        console.error('Error al cargar países:', error);
        toast.error('Error al cargar los países.');
      }
    };
    fetchCountries();
  }, []);

  /**
   * Inicializa el formulario con los datos del usuario logueado.
   */
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        country: user.country || '',
        password: '',
      });
      if (user.avatar_url) setAvatarPreview(user.avatar_url);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCountryChange = (selected) => {
    setFormData({ ...formData, country: selected ? selected.value : '' });
  };

  /**
   * Maneja la previsualización del nuevo avatar.
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  /**
   * Envía los datos actualizados al backend.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('first_name', formData.first_name);
    data.append('last_name', formData.last_name);
    data.append('country', formData.country);

    if (formData.password) {
      data.append('password', formData.password);
    }
    if (avatarFile) {
      data.append('avatar', avatarFile);
    }

    try {
      const token = localStorage.getItem('cms_token');
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      const response = await fetch(`${baseUrl}/api/users/profile/${user.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('¡Perfil actualizado con éxito!');

        // Actualizamos el contexto global con la nueva data
        const updatedUser = { ...user, ...result.user };
        login(token, updatedUser);

        setFormData((prev) => ({ ...prev, password: '' }));
      } else {
        toast.error(result.message || 'Hubo un problema al guardar.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='profile-view'>
      <header className='profile-header'>
        <h2>Configuración de Perfil</h2>
        <p>Administra tu información pública y credenciales de acceso.</p>
      </header>

      <div className='profile-grid'>
        {/* Lado izquierdo: Identidad visual */}
        <aside className='profile-card identity-card'>
          <div
            className='avatar-wrapper'
            onClick={() => fileInputRef.current.click()}
            title='Cambiar foto de perfil'
          >
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt='Avatar'
                className='avatar-img'
              />
            ) : (
              <div className='avatar-placeholder'>
                {formData.first_name.charAt(0)}
                {formData.last_name.charAt(0)}
              </div>
            )}
            <div className='avatar-overlay'>
              <Camera
                size={24}
                color='white'
              />
            </div>
          </div>
          <input
            type='file'
            accept='image/jpeg, image/png, image/webp'
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
          <h3 className='user-fullname'>
            {formData.first_name} {formData.last_name}
          </h3>
          <p className='user-email'>{user?.email}</p>
          <span className='user-rolebadge'>{user?.role_name || 'Miembro'}</span>
        </aside>

        {/* Lado derecho: Formulario de datos */}
        <section className='profile-card form-card'>
          <h3>Datos Personales</h3>
          <hr className='minimal-divider' />

          <form
            onSubmit={handleSubmit}
            className='profile-form'
          >
            <div className='form-row'>
              <div className='form-group'>
                <label>Nombre</label>
                <input
                  type='text'
                  name='first_name'
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='form-group'>
                <label>Apellido</label>
                <input
                  type='text'
                  name='last_name'
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className='form-row'>
              <div className='form-group'>
                <label>País de Operación</label>
                <Select
                  options={countryOptions}
                  value={
                    countryOptions.find((o) => o.value === formData.country) ||
                    null
                  }
                  onChange={handleCountryChange}
                  styles={selectStyles}
                  isSearchable={true}
                  placeholder='Seleccionar...'
                />
              </div>

              <div className='form-group'>
                <label>
                  Nueva Contraseña <span className='hint'>(Opcional)</span>
                </label>
                <input
                  type='password'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  placeholder='Dejar en blanco para no cambiar'
                />
              </div>
            </div>

            <div className='form-actions'>
              <button
                type='submit'
                className='btn-save'
                disabled={loading}
              >
                {loading ? (
                  <Loader2
                    size={16}
                    className='lucide-spinner'
                  />
                ) : (
                  <Save size={16} />
                )}
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Profile;
