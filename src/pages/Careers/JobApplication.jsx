import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, UploadCloud, FileText } from 'lucide-react';
import './JobApplication.scss';

const JobApplication = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Estados del postulante actualizados
  const [personalData, setPersonalData] = useState({
    name: '',
    email: '',
    linkedin: '',
    github: '',
    behance: '',
    cv: null, // Guardará el archivo físico
  });
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/jobs/${jobId}`);
        if (response.ok) {
          const data = await response.json();
          setJob(data);
        }
      } catch (error) {
        console.error('Error al cargar vacante:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  const handlePersonalChange = (e) => {
    setPersonalData({ ...personalData, [e.target.name]: e.target.value });
  };

  // Manejador específico para el archivo CV
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPersonalData({ ...personalData, cv: file });
    }
  };

  const handleTextAnswer = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleCheckboxAnswer = (questionId, option, isChecked) => {
    const currentSelections = answers[questionId] || [];
    if (isChecked) {
      setAnswers({ ...answers, [questionId]: [...currentSelections, option] });
    } else {
      setAnswers({
        ...answers,
        [questionId]: currentSelections.filter((item) => item !== option),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🚧 SIMULACIÓN: Aquí luego usaremos FormData para poder enviar el archivo físico al backend
    const applicationPayload = {
      jobId,
      name: personalData.name,
      email: personalData.email,
      linkedin: personalData.linkedin,
      github: personalData.github,
      behance: personalData.behance,
      cvName: personalData.cv ? personalData.cv.name : 'Ninguno',
      answers,
    };

    console.log('Enviando postulación (Simulación):', applicationPayload);
    alert('¡Tu postulación ha sido enviada con éxito! (Modo Simulación)');

    navigate('/trabaja_con_nosotros');
  };

  if (isLoading) {
    return (
      <main className='job-app-layout'>
        <div className='spinner'></div>
      </main>
    );
  }

  if (!job) return null;

  const filterQuestions =
    typeof job.questions === 'string'
      ? JSON.parse(job.questions)
      : job.questions || [];

  return (
    <main className='job-app-layout'>
      <div className='job-app-wrapper'>
        <Link
          to={`/trabaja_con_nosotros/${jobId}`}
          className='job-app__back'
        >
          <ArrowLeft size={16} /> Volver a los detalles
        </Link>

        <form
          className='job-app-card'
          onSubmit={handleSubmit}
        >
          <header className='job-app-card__header'>
            <h1>Postulación: {job.title}</h1>
            <p>Por favor, completa la siguiente información con cuidado.</p>
          </header>

          <div className='job-app-card__content'>
            {/* --- DATOS PERSONALES --- */}
            <section className='app-section'>
              <h2>Datos Personales</h2>
              <div className='app-grid'>
                <div className='app-group'>
                  <label>
                    Nombre completo <span className='required-asterisk'>*</span>
                  </label>
                  <input
                    type='text'
                    name='name'
                    value={personalData.name}
                    onChange={handlePersonalChange}
                    required
                  />
                </div>
                <div className='app-group'>
                  <label>
                    Correo electrónico{' '}
                    <span className='required-asterisk'>*</span>
                  </label>
                  <input
                    type='email'
                    name='email'
                    value={personalData.email}
                    onChange={handlePersonalChange}
                    required
                  />
                </div>
              </div>
            </section>

            <hr className='app-divider' />

            {/* --- ENLACES Y CV --- */}
            <section className='app-section'>
              <h2>Perfil Profesional</h2>

              <div className='app-grid'>
                <div className='app-group'>
                  <label>Perfil de LinkedIn</label>
                  <input
                    type='url'
                    name='linkedin'
                    value={personalData.linkedin}
                    onChange={handlePersonalChange}
                    placeholder='https://linkedin.com/in/...'
                  />
                </div>
                <div className='app-group'>
                  <label>GitHub</label>
                  <input
                    type='url'
                    name='github'
                    value={personalData.github}
                    onChange={handlePersonalChange}
                    placeholder='https://github.com/...'
                  />
                </div>
                <div className='app-group'>
                  <label>Behance / Portafolio Web</label>
                  <input
                    type='url'
                    name='behance'
                    value={personalData.behance}
                    onChange={handlePersonalChange}
                    placeholder='https://...'
                  />
                </div>

                {/* ZONA DE SUBIDA DE CV */}
                <div className='app-group full-width'>
                  <label>
                    Curriculum Vitae (CV){' '}
                    <span className='required-asterisk'>*</span>
                  </label>
                  <div className='cv-upload-area'>
                    <input
                      type='file'
                      id='cv-upload'
                      accept='.pdf,.doc,.docx'
                      onChange={handleFileChange}
                      required
                      className='cv-upload-input'
                    />
                    <label
                      htmlFor='cv-upload'
                      className={`cv-upload-label ${personalData.cv ? 'has-file' : ''}`}
                    >
                      {personalData.cv ? (
                        <>
                          <FileText
                            size={28}
                            className='icon-success'
                          />
                          <div className='file-info'>
                            <span className='file-name'>
                              {personalData.cv.name}
                            </span>
                            <span className='file-size'>
                              {(personalData.cv.size / 1024 / 1024).toFixed(2)}{' '}
                              MB
                            </span>
                          </div>
                          <span className='file-change-text'>
                            Haz clic para cambiar
                          </span>
                        </>
                      ) : (
                        <>
                          <UploadCloud
                            size={32}
                            className='icon-upload'
                          />
                          <span className='upload-text'>
                            Haz clic para subir tu CV o arrástralo aquí
                          </span>
                          <span className='upload-hint'>
                            Formatos soportados: PDF, DOCX (Máx. 5MB)
                          </span>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </section>

            {filterQuestions.length > 0 && <hr className='app-divider' />}

            {/* --- PREGUNTAS FILTRO DINÁMICAS --- */}
            {filterQuestions.length > 0 && (
              <section className='app-section'>
                <h2>Cuestionario</h2>
                <div className='app-questions'>
                  {filterQuestions.map((q, index) => (
                    <div
                      key={q.id}
                      className='app-group'
                    >
                      <label>
                        {index + 1}. {q.label}{' '}
                        <span className='required-asterisk'>*</span>
                      </label>

                      {q.type === 'text' && (
                        <textarea
                          rows='3'
                          required
                          value={answers[q.id] || ''}
                          onChange={(e) =>
                            handleTextAnswer(q.id, e.target.value)
                          }
                          placeholder='Tu respuesta...'
                        />
                      )}

                      {q.type === 'multiple' && (
                        <div className='checkbox-grid'>
                          {q.options.map((opt, i) => (
                            <label
                              key={i}
                              className='checkbox-label'
                            >
                              <input
                                type='checkbox'
                                value={opt}
                                checked={(answers[q.id] || []).includes(opt)}
                                onChange={(e) =>
                                  handleCheckboxAnswer(
                                    q.id,
                                    opt,
                                    e.target.checked,
                                  )
                                }
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <footer className='job-app-card__footer'>
            <button
              type='submit'
              className='btn-submit-app'
            >
              Enviar Postulación <Send size={16} />
            </button>
          </footer>
        </form>
      </div>
    </main>
  );
};

export default JobApplication;
