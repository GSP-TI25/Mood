import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './CmsLogin.scss';

// 🌟 DATOS DEL SLIDER
const SLIDER_DATA = [
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=100',
    text: 'Gestión inteligente de talento y análisis de rendimiento centralizado en un solo lugar.',
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=100',
    text: 'Automatiza procesos de reclutamiento y toma decisiones basadas en datos reales.',
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=900&q=100',
    text: 'Transformamos la administración del equipo con herramientas de inteligencia artificial.',
  },
];

const CmsLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  // 🌟 ESTADO Y EFECTO PARA EL SLIDER AUTOMÁTICO
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDER_DATA.length);
    }, 10000); // Cambia cada 5 segundos
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Por favor, ingresa tus credenciales.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token, data.user);
      } else {
        alert(data.message || 'Credenciales inválidas');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      alert('Error al conectar con el servidor.');
    }
  };

  return (
    <main className='cms-login'>
      {/* CONTENEDOR PRINCIPAL BLANCO CON PADDING (ESTILO SHADCN) */}
      <div className='cms-login__wrapper'>
        {/* LADO IZQUIERDO: Slider con Padding */}
        <div className='cms-login__slider-section'>
          <div className='cms-login__slider-container'>
            {/* Imágenes del Slider */}
            {SLIDER_DATA.map((slide, index) => (
              <img
                key={slide.id}
                src={slide.image}
                alt={`Slide ${index + 1}`}
                className={`cms-login__slider-image ${
                  index === currentSlide
                    ? 'cms-login__slider-image--active'
                    : ''
                }`}
              />
            ))}

            {/* Capa superpuesta para oscurecer un poco la imagen base */}
            <div className='cms-login__slider-overlay'></div>

            {/* Contenido flotante inferior */}
            <div className='cms-login__slider-content'>
              {/* Caja de texto blanca flotante */}
              <div className='cms-login__floating-box'>
                <p>{SLIDER_DATA[currentSlide].text}</p>
              </div>

              {/* Puntos de navegación (Dots) */}
              <div className='cms-login__slider-dots'>
                {SLIDER_DATA.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`cms-login__dot ${
                      index === currentSlide ? 'cms-login__dot--active' : ''
                    }`}
                    aria-label={`Ir al slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* LADO DERECHO: Formulario Shadcn */}
        <div className='cms-login__form-section'>
          <div className='cms-login__form-inner'>
            <div className='cms-login__header'>
              <h2>Iniciar sesión</h2>
              <p>Ingresa tus credenciales para acceder a tu cuenta.</p>
            </div>

            <form
              className='cms-login__form'
              onSubmit={handleSubmit}
            >
              <div className='cms-login__group'>
                <label htmlFor='email'>Correo electrónico</label>
                <input
                  id='email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='rrhh@mood.com'
                  required
                />
              </div>

              <div className='cms-login__group'>
                <div className='cms-login__label-row'>
                  <label htmlFor='password'>Contraseña</label>
                </div>
                <input
                  id='password'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='••••••••'
                  required
                />
              </div>

              <button
                type='submit'
                className='cms-login__btn'
              >
                Ingresar al panel
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CmsLogin;
