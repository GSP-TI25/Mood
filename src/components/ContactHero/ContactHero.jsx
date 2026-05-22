import { useState, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';
import BlurText from '../BlurText/BlurText';
import './ContactHero.scss';

const ContactHero = () => {
  const { t, i18n } = useTranslation();

  // --- NUEVOS ESTADOS: Países y Prefijos Dinámicos ---
  const [countryOptions, setCountryOptions] = useState([]);
  const [countryPrefixes, setCountryPrefixes] = useState({});

  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    celular: '',
    pais: null,
    mensaje: '',
  });

  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // --- EFECTO: Cargar países desde la Base de Datos ---
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/countries');
        const data = await response.json();

        if (data.success) {
          const options = data.data; // [{ value, label, prefix }]
          const prefixes = {};

          // Construimos el diccionario dinámico de prefijos
          options.forEach((country) => {
            prefixes[country.value] = country.prefix;
          });

          // Agregamos manualmente la opción "Otro" al final, usando tu traducción
          const otroLabel = t('contactHero.form.countries.other') || 'Otro';
          options.push({ value: 'Otro', label: otroLabel, prefix: '' });
          prefixes['Otro'] = '';

          setCountryOptions(options);
          setCountryPrefixes(prefixes);
        }
      } catch (error) {
        console.error('Error cargando la lista de países:', error);
      }
    };

    fetchCountries();
  }, [t]); // Se ejecuta al montar y si cambia el idioma (para traducir "Otro")

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selectedOption) => {
    setFormData((prev) => {
      // Leemos el prefijo del estado dinámico
      const oldPrefix = prev.pais ? countryPrefixes[prev.pais.value] : '';
      const newPrefix = countryPrefixes[selectedOption.value] || '';

      let numberOnly = prev.celular;
      if (oldPrefix && numberOnly.startsWith(oldPrefix)) {
        numberOnly = numberOnly.substring(oldPrefix.length);
      }

      numberOnly = numberOnly.replace(/\D/g, '');

      return {
        ...prev,
        pais: selectedOption,
        celular: newPrefix + numberOnly,
      };
    });
  };

  const handlePhoneChange = (e) => {
    let rawValue = e.target.value;
    const currentCountry = formData.pais?.value;
    // Leemos el prefijo dinámico
    const prefix =
      currentCountry && currentCountry !== 'Otro'
        ? countryPrefixes[currentCountry]
        : '';

    if (prefix && !rawValue.startsWith(prefix)) {
      rawValue = prefix;
    }

    let userTypedPart = rawValue.substring(prefix.length);

    if (currentCountry === 'Otro') {
      const hasPlus = userTypedPart.startsWith('+');
      userTypedPart = userTypedPart.replace(/\D/g, '');
      if (hasPlus) userTypedPart = '+' + userTypedPart;
    } else {
      userTypedPart = userTypedPart.replace(/\D/g, '');
    }

    if (userTypedPart.length > 15) {
      const maxLen = userTypedPart.startsWith('+') ? 16 : 15;
      userTypedPart = userTypedPart.substring(0, maxLen);
    }

    setFormData((prev) => ({ ...prev, celular: prefix + userTypedPart }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    if (honeypot) {
      console.warn('Bot de spam interceptado y bloqueado.');
      setTimeout(() => {
        setSubmitStatus('success');
        setIsSubmitting(false);
        setFormData({
          nombre: '',
          correo: '',
          celular: '',
          pais: null,
          mensaje: '',
        });
      }, 1000);
      return;
    }

    const payload = {
      nombre: formData.nombre,
      correo: formData.correo,
      celular: formData.celular,
      pais: formData.pais ? formData.pais.label : 'No especificado',
      mensaje: formData.mensaje,
      idioma: i18n.language || 'es',
    };

    try {
      const response = await fetch('http://localhost:5000/api/contacto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          nombre: '',
          correo: '',
          celular: '',
          pais: null,
          mensaje: '',
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error procesando el formulario:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className='contact-hero'>
      <div className='contact-hero__container'>
        <div className='contact-hero__content'>
          <div className='contact-hero__title-group'>
            <BlurText
              text={t('contactHero.title1')}
              delay={30}
              animateBy='words'
              direction='top'
              as='h1'
              className='contact-hero__title contact-hero__title--light'
            />
            <div className='contact-hero__line'>
              <BlurText
                text={t('contactHero.title2')}
                delay={45}
                animateBy='words'
                direction='top'
                as='span'
                className='contact-hero__highlight'
              />
              <BlurText
                text={t('contactHero.title3')}
                delay={60}
                animateBy='words'
                direction='top'
                as='h1'
                className='contact-hero__title'
              />
            </div>
          </div>

          <div
            className='contact-hero__fade-in'
            style={{ animationDelay: '0.4s' }}
          >
            <p className='contact-hero__subtitle'>
              {t('contactHero.subtitle')}
            </p>
          </div>
        </div>

        <div
          className='contact-hero__form-wrapper contact-hero__fade-in'
          style={{ animationDelay: '0.6s' }}
        >
          <form
            className='contact-form'
            onSubmit={handleSubmit}
          >
            <div className='contact-form__header'>
              <h3>{t('contactHero.form.header')}</h3>
            </div>

            <div
              style={{ position: 'absolute', left: '-9999px' }}
              aria-hidden='true'
            >
              <label htmlFor='_honey'>
                No llenes este campo si eres humano
              </label>
              <input
                type='text'
                id='_honey'
                name='_honey'
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex='-1'
                autoComplete='off'
              />
            </div>

            <div className='contact-form__group'>
              <label htmlFor='nombre'>
                {t('contactHero.form.labels.name')}
              </label>
              <input
                type='text'
                id='nombre'
                name='nombre'
                value={formData.nombre}
                onChange={handleChange}
                required
                maxLength={100}
                placeholder={t('contactHero.form.placeholders.name')}
              />
            </div>

            <div className='contact-form__group'>
              <label htmlFor='correo'>
                {t('contactHero.form.labels.email')}
              </label>
              <input
                type='email'
                id='correo'
                name='correo'
                value={formData.correo}
                onChange={handleChange}
                required
                maxLength={150}
                placeholder={t('contactHero.form.placeholders.email')}
              />
            </div>

            <div className='contact-form__row'>
              <div className='contact-form__group'>
                <label htmlFor='celular'>
                  {t('contactHero.form.labels.phone')}
                </label>
                <input
                  type='tel'
                  id='celular'
                  name='celular'
                  value={formData.celular}
                  onChange={handlePhoneChange}
                  required
                  placeholder={t('contactHero.form.placeholders.phone')}
                />
              </div>

              <div className='contact-form__group'>
                <label htmlFor='pais'>
                  {t('contactHero.form.labels.country')}
                </label>
                <Select
                  inputId='pais'
                  options={countryOptions} // <-- USAMOS EL ESTADO DINÁMICO AQUÍ
                  value={formData.pais}
                  onChange={handleSelectChange}
                  placeholder={t('contactHero.form.placeholders.select')}
                  classNamePrefix='custom-select'
                  required
                />
              </div>
            </div>

            <div className='contact-form__group'>
              <label htmlFor='mensaje'>
                {t('contactHero.form.labels.message')}
              </label>
              <textarea
                id='mensaje'
                name='mensaje'
                value={formData.mensaje}
                onChange={handleChange}
                required
                rows='4'
                maxLength={1000}
                placeholder={t('contactHero.form.placeholders.message')}
              ></textarea>
            </div>

            {submitStatus === 'success' && (
              <p className='contact-form__feedback contact-form__feedback--success'>
                {t('contactHero.form.feedback.success')}
              </p>
            )}
            {submitStatus === 'error' && (
              <p className='contact-form__feedback contact-form__feedback--error'>
                {t('contactHero.form.feedback.error')}
              </p>
            )}

            <button
              type='submit'
              className='contact-form__submit'
              disabled={isSubmitting}
              style={{
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              <span>
                {isSubmitting
                  ? t('contactHero.form.buttons.sending')
                  : t('contactHero.form.buttons.send')}
              </span>
              {isSubmitting ? (
                <Loader2
                  size={18}
                  className='spin-animation'
                />
              ) : (
                <Send size={18} />
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;
