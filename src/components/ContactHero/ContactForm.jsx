import { useState, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';
import './ContactForm.scss';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const ContactForm = ({ onSuccess }) => {
  const { t, i18n } = useTranslation();

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
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(`${API_URL}/api/countries`);
        const data = await response.json();

        if (data.success) {
          const options = data.data;
          const prefixes = {};

          options.forEach((country) => {
            prefixes[country.value] = country.prefix;
          });

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
  }, [t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selectedOption) => {
    setFormData((prev) => {
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
    setSubmitError(null);

    if (honeypot) {
      console.warn('Bot bloqueado.');
      setIsSubmitting(false);
      onSuccess();
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
      const response = await fetch(`${API_URL}/api/contacto`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsSubmitting(false);
        onSuccess(); // Evoca la animación en el componente padre
      } else {
        setSubmitError('error');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error procesando el formulario:', error);
      setSubmitError('error');
      setIsSubmitting(false);
    }
  };

  return (
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
        <label htmlFor='_honey'>No llenes este campo si eres humano</label>
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
        <label htmlFor='nombre'>{t('contactHero.form.labels.name')}</label>
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
        <label htmlFor='correo'>{t('contactHero.form.labels.email')}</label>
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
          <label htmlFor='celular'>{t('contactHero.form.labels.phone')}</label>
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
          <label htmlFor='pais'>{t('contactHero.form.labels.country')}</label>
          <Select
            inputId='pais'
            options={countryOptions}
            value={formData.pais}
            onChange={handleSelectChange}
            placeholder={t('contactHero.form.placeholders.select')}
            classNamePrefix='custom-select'
            required
          />
        </div>
      </div>

      <div className='contact-form__group'>
        <label htmlFor='mensaje'>{t('contactHero.form.labels.message')}</label>
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

      {submitError === 'error' && (
        <p className='contact-form__feedback contact-form__feedback--error'>
          {t('contactHero.form.feedback.error')}
        </p>
      )}

      <button
        type='submit'
        className='contact-form__submit'
        disabled={isSubmitting}
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
  );
};

export default ContactForm;
