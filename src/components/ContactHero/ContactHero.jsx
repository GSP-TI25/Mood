import { useState, useMemo } from 'react';
import { Send, Loader2 } from 'lucide-react';
import Select from 'react-select';
import { useTranslation } from 'react-i18next'; // <-- IMPORTAMOS EL HOOK
import BlurText from '../BlurText/BlurText';
import './ContactHero.scss';

const ContactHero = () => {
  const { t } = useTranslation(); // <-- INICIALIZAMOS EL HOOK

  // Movimos COUNTRY_OPTIONS adentro y usamos useMemo para traducir dinámicamente
  const COUNTRY_OPTIONS = useMemo(
    () => [
      { value: 'Peru', label: t('contactHero.form.countries.peru') },
      { value: 'Mexico', label: t('contactHero.form.countries.mexico') },
      { value: 'Colombia', label: t('contactHero.form.countries.colombia') },
      { value: 'Chile', label: t('contactHero.form.countries.chile') },
      { value: 'Argentina', label: t('contactHero.form.countries.argentina') },
      { value: 'Espana', label: t('contactHero.form.countries.spain') },
      { value: 'Otro', label: t('contactHero.form.countries.other') },
    ],
    [t],
  );

  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    celular: '',
    pais: null,
    mensaje: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selectedOption) => {
    setFormData((prev) => ({ ...prev, pais: selectedOption }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const dataToSend = {
      Nombre: formData.nombre,
      Correo: formData.correo,
      Celular: formData.celular,
      País: formData.pais ? formData.pais.label : 'No especificado',
      Mensaje: formData.mensaje,
      _subject: `¡Nuevo Lead Mood! - ${formData.nombre}`,
      _cc: 'tecnologia@mood.pe',
      _captcha: 'false',
      _template: 'table',
    };

    try {
      const response = await fetch(
        'https://formsubmit.co/ajax/cbraco@gruposp.pe',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(dataToSend),
        },
      );

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
      console.error('Error enviando a FormSubmit:', error);
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
                  onChange={handleChange}
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
                  options={COUNTRY_OPTIONS}
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
