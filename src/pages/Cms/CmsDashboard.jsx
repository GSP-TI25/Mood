//src/pages/Cms/CmsDashboard.jsx
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify'; // 🌟 IMPORTAMOS TOASTIFY PARA NOTIFICACIONES
import CmsSidebar from '../../components/Cms/CmsSidebar';
import JobsTable from '../../components/Cms/JobsTable';
import JobForm from '../../components/Cms/JobForm';
import ApplicationsTable from '../../components/Cms/ApplicationsTable';
import UsersTable from '../../components/Cms/UsersTable';
import UserForm from '../../components/Cms/UserForm';
import Profile from '../../components/Cms/Profile';
import ProjectsTable from '../../components/Cms/ProjectsTable';
import ProjectForm from '../../components/Cms/ProjectForm';
import TeamTable from '../../components/Cms/TeamTable';
import TeamForm from '../../components/Cms/TeamForm';
import {
  Plus,
  Briefcase,
  Users,
  FolderGit2,
  IdCard,
  Settings,
  User,
  AlertTriangle, // 🌟 ICONO PARA EL MODAL DE CONFIRMACIÓN
} from 'lucide-react';
import './CmsDashboard.scss';

const getLoadingPhrase = (tab) => {
  const phrases = {
    inicio: 'Preparando tu panel de control...',
    vacantes: 'Buscando al próximo talento que rompa el molde...',
    postulantes: 'Analizando perfiles, descubriendo estrellas...',
    proyectos: 'Renderizando casos de éxito e impacto...',
    equipo: 'Sincronizando talento humano e Inteligencia Artificial...',
    configuracion: 'Ajustando los engranajes del sistema...',
    perfil: 'Cargando tu identidad en el ecosistema Mood...',
  };
  return phrases[tab] || 'Cargando...';
};

const CmsDashboard = () => {
  const { user } = useContext(AuthContext);
  const isSuperAdmin = user?.role_name === 'SuperAdmin' || user?.role_id === 1;

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('cms_active_tab') || 'inicio';
  });

  const [isChangingTab, setIsChangingTab] = useState(false);

  // 🌟 ESTADO PARA EL MODAL DE CONFIRMACIÓN PERSONALIZADO
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    message: '',
    onConfirm: null,
  });

  useEffect(() => {
    localStorage.setItem('cms_active_tab', activeTab);

    setIsChangingTab(true);
    const timer = setTimeout(() => setIsChangingTab(false), 3000);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [projects, setProjects] = useState([]);
  const [team, setTeam] = useState([]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState(null);

  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);

  const [isTeamFormOpen, setIsTeamFormOpen] = useState(false);
  const [teamMemberToEdit, setTeamMemberToEdit] = useState(null);

  const fetchJobs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/jobs');
      setJobs(await response.json());
    } catch (error) {
      console.error(error);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/applications');
      setApplications(await response.json());
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users');
      if (response.ok) setUsersList(await response.json());
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/projects');
      if (response.ok) setProjects(await response.json());
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTeam = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/team');
      if (response.ok) setTeam(await response.json());
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (activeTab === 'vacantes') fetchJobs();
    if (activeTab === 'postulantes') fetchApplications();
    if (activeTab === 'configuracion') fetchUsers();
    if (activeTab === 'proyectos') fetchProjects();
    if (activeTab === 'equipo') fetchTeam();
  }, [activeTab]);

  useEffect(() => {
    document.body.style.overflow =
      isFormOpen ||
      isUserFormOpen ||
      isProjectFormOpen ||
      isTeamFormOpen ||
      confirmDialog.isOpen
        ? 'hidden'
        : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [
    isFormOpen,
    isUserFormOpen,
    isProjectFormOpen,
    isTeamFormOpen,
    confirmDialog.isOpen,
  ]);

  const handleSuccess = () => {
    setIsFormOpen(false);
    fetchJobs();
  };
  const handleUserSuccess = () => {
    setIsUserFormOpen(false);
    fetchUsers();
  };
  const handleProjectSuccess = () => {
    setIsProjectFormOpen(false);
    fetchProjects();
  };
  const handleTeamSuccess = () => {
    setIsTeamFormOpen(false);
    fetchTeam();
  };

  // 🌟 FUNCIÓN HELPER PARA ABRIR EL MODAL DE CONFIRMACIÓN
  const requestConfirm = (message, onConfirmCallback) => {
    setConfirmDialog({
      isOpen: true,
      message,
      onConfirm: onConfirmCallback,
    });
  };

  // 🌟 FUNCIÓN HELPER PARA CERRAR EL MODAL
  const closeConfirm = () => {
    setConfirmDialog({ isOpen: false, message: '', onConfirm: null });
  };

  // ===============================================
  // 🌟 MANEJADORES DE ESTADO CON ALERTAS PERSONALIZADAS
  // ===============================================
  const handleToggleStatus = (jobId) => {
    requestConfirm(
      '¿Seguro que deseas cambiar el estado de esta vacante?',
      async () => {
        const token = localStorage.getItem('cms_token');
        try {
          const response = await fetch(
            `http://localhost:5000/api/jobs/${jobId}/status`,
            {
              method: 'PATCH',
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          if (response.ok) {
            toast.success('Estado de vacante actualizado');
            fetchJobs();
          } else {
            toast.error('Hubo un error al actualizar la vacante');
          }
        } catch (error) {
          toast.error('Error de conexión');
          console.error(error);
        }
      },
    );
  };

  const handleToggleProjectStatus = (projectId) => {
    requestConfirm(
      '¿Seguro que deseas cambiar la visibilidad de este proyecto?',
      async () => {
        const token = localStorage.getItem('cms_token');
        try {
          const response = await fetch(
            `http://localhost:5000/api/projects/${projectId}/status`,
            {
              method: 'PATCH',
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          if (response.ok) {
            toast.success('Visibilidad del proyecto actualizada');
            fetchProjects();
          } else {
            toast.error('Error al actualizar el proyecto');
          }
        } catch (error) {
          toast.error('Error de conexión');
          console.error(error);
        }
      },
    );
  };

  const handleToggleTeamStatus = (memberId) => {
    requestConfirm(
      '¿Seguro que deseas cambiar la visibilidad de este miembro?',
      async () => {
        const token = localStorage.getItem('cms_token');
        try {
          const response = await fetch(
            `http://localhost:5000/api/team/${memberId}/status`,
            {
              method: 'PATCH',
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          if (response.ok) {
            toast.success('Estado del miembro actualizado');
            fetchTeam();
          } else {
            toast.error('Error al actualizar el miembro');
          }
        } catch (error) {
          toast.error('Error de conexión');
          console.error(error);
        }
      },
    );
  };

  const openCreateForm = () => {
    setJobToEdit(null);
    setIsFormOpen(true);
  };
  const openCreateUserForm = () => {
    setUserToEdit(null);
    setIsUserFormOpen(true);
  };
  const openCreateProjectForm = () => {
    setProjectToEdit(null);
    setIsProjectFormOpen(true);
  };
  const openCreateTeamForm = () => {
    setTeamMemberToEdit(null);
    setIsTeamFormOpen(true);
  };

  const openEditForm = async (jobShort) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/jobs/${jobShort.id}`,
      );
      const fullJob = await response.json();
      setJobToEdit(fullJob);
      setIsFormOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const openEditProjectForm = (project) => {
    setProjectToEdit(project);
    setIsProjectFormOpen(true);
  };
  const openEditTeamForm = (member) => {
    setTeamMemberToEdit(member);
    setIsTeamFormOpen(true);
  };

  return (
    <div className='cms-layout'>
      <CmsSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className='cms-main-content'>
        {isChangingTab ? (
          <div className='cms-tab-loader'>
            <div className='cms-tab-loader__spinner'></div>
            <p className='cms-tab-loader__phrase'>
              {getLoadingPhrase(activeTab)}
            </p>
          </div>
        ) : (
          <>
            {/* 🌟 VISTA DE INICIO (HOME) */}
            {activeTab === 'inicio' && (
              <div className='cms-home-view'>
                <header className='cms-home-header'>
                  <h1>¡Hola, {user?.first_name || 'Admin'}! </h1>
                  <p>
                    Bienvenido al Panel de Control de Mood. ¿Qué te gustaría
                    gestionar hoy?
                  </p>
                </header>

                <div className='cms-home-grid'>
                  <div
                    className='cms-home-card'
                    onClick={() => setActiveTab('vacantes')}
                  >
                    <div className='cms-home-card__icon bg-blue'>
                      <Briefcase size={25} />
                    </div>
                    <div className='cms-home-card__info'>
                      <h3>Gestión de Vacantes</h3>
                      <p>
                        Crea, edita o pausa las ofertas de empleo de la agencia.
                      </p>
                    </div>
                  </div>

                  <div
                    className='cms-home-card'
                    onClick={() => setActiveTab('postulantes')}
                  >
                    <div className='cms-home-card__icon bg-purple'>
                      <Users size={25} />
                    </div>
                    <div className='cms-home-card__info'>
                      <h3>Base de Postulantes</h3>
                      <p>
                        Revisa CVs, portafolios y respuestas de los candidatos.
                      </p>
                    </div>
                  </div>

                  <div
                    className='cms-home-card'
                    onClick={() => setActiveTab('proyectos')}
                  >
                    <div className='cms-home-card__icon bg-pink'>
                      <FolderGit2 size={25} />
                    </div>
                    <div className='cms-home-card__info'>
                      <h3>Proyectos (MoodPrint)</h3>
                      <p>
                        Sube imágenes o videos de casos de éxito y campañas.
                      </p>
                    </div>
                  </div>

                  <div
                    className='cms-home-card'
                    onClick={() => setActiveTab('equipo')}
                  >
                    <div className='cms-home-card__icon bg-emerald'>
                      <IdCard size={25} />
                    </div>
                    <div className='cms-home-card__info'>
                      <h3>Equipo Mood</h3>
                      <p>
                        Administra perfiles de líderes y miembros de la agencia.
                      </p>
                    </div>
                  </div>

                  <div
                    className='cms-home-card'
                    onClick={() => setActiveTab('perfil')}
                  >
                    <div className='cms-home-card__icon bg-orange'>
                      <User size={25} />
                    </div>
                    <div className='cms-home-card__info'>
                      <h3>Mi Perfil</h3>
                      <p>
                        Actualiza tu información personal, foto y contraseña.
                      </p>
                    </div>
                  </div>

                  {isSuperAdmin && (
                    <div
                      className='cms-home-card'
                      onClick={() => setActiveTab('configuracion')}
                    >
                      <div className='cms-home-card__icon bg-slate'>
                        <Settings size={25} />
                      </div>
                      <div className='cms-home-card__info'>
                        <h3>Configuración</h3>
                        <p>
                          Administra accesos y permisos de otros usuarios del
                          CMS.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* RESTO DE CABECERAS Y TABLAS */}
            {activeTab !== 'configuracion' &&
              activeTab !== 'perfil' &&
              activeTab !== 'inicio' && (
                <header className='cms-main-content__header'>
                  <div>
                    <h1>
                      {activeTab === 'vacantes'
                        ? 'Gestión de Vacantes'
                        : activeTab === 'proyectos'
                          ? 'Portafolio MoodPrint'
                          : activeTab === 'equipo'
                            ? 'Equipo Mood'
                            : 'Base de Postulantes'}
                    </h1>
                    <p>
                      {activeTab === 'vacantes'
                        ? 'Administra los puestos de trabajo disponibles en la agencia.'
                        : activeTab === 'proyectos'
                          ? 'Sube y organiza los casos de éxito de la agencia.'
                          : activeTab === 'equipo'
                            ? 'Administra a los líderes y miembros de la agencia.'
                            : 'Revisa y descarga los perfiles de los talentos que han postulado.'}
                    </p>
                  </div>

                  {activeTab === 'vacantes' && (
                    <button
                      className='cms-btn-primary'
                      onClick={openCreateForm}
                    >
                      <Plus
                        size={16}
                        strokeWidth={3}
                      />{' '}
                      Nueva Vacante
                    </button>
                  )}

                  {activeTab === 'proyectos' && (
                    <button
                      className='cms-btn-primary'
                      onClick={openCreateProjectForm}
                    >
                      <Plus
                        size={16}
                        strokeWidth={3}
                      />{' '}
                      Nuevo Proyecto
                    </button>
                  )}

                  {activeTab === 'equipo' && (
                    <button
                      className='cms-btn-primary'
                      onClick={openCreateTeamForm}
                    >
                      <Plus
                        size={16}
                        strokeWidth={3}
                      />{' '}
                      Nuevo Miembro
                    </button>
                  )}
                </header>
              )}

            {activeTab === 'vacantes' && (
              <JobsTable
                jobs={jobs}
                onToggleStatus={handleToggleStatus}
                onEdit={openEditForm}
              />
            )}
            {activeTab === 'postulantes' && (
              <ApplicationsTable applications={applications} />
            )}
            {activeTab === 'proyectos' && (
              <ProjectsTable
                projects={projects}
                onToggleStatus={handleToggleProjectStatus}
                onEdit={openEditProjectForm}
              />
            )}
            {activeTab === 'equipo' && (
              <TeamTable
                team={team}
                onToggleStatus={handleToggleTeamStatus}
                onEdit={openEditTeamForm}
              />
            )}
            {activeTab === 'configuracion' && (
              <UsersTable
                users={usersList}
                onAddUser={openCreateUserForm}
                onEdit={(u) => {
                  setUserToEdit(u);
                  setIsUserFormOpen(true);
                }}
              />
            )}
            {activeTab === 'perfil' && <Profile />}
          </>
        )}
      </main>

      {/* MODALES DE FORMULARIOS */}
      {isFormOpen && activeTab === 'vacantes' && (
        <div
          className='cms-sheet-overlay'
          onClick={() => setIsFormOpen(false)}
        >
          <div
            className='cms-sheet-content'
            onClick={(e) => e.stopPropagation()}
          >
            <JobForm
              jobToEdit={jobToEdit}
              onSubmitSuccess={handleSuccess}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </div>
      )}

      {isProjectFormOpen && activeTab === 'proyectos' && (
        <div
          className='cms-sheet-overlay'
          onClick={() => setIsProjectFormOpen(false)}
        >
          <div
            className='cms-sheet-content'
            onClick={(e) => e.stopPropagation()}
          >
            <ProjectForm
              projectToEdit={projectToEdit}
              onSubmitSuccess={handleProjectSuccess}
              onCancel={() => setIsProjectFormOpen(false)}
            />
          </div>
        </div>
      )}

      {isTeamFormOpen && activeTab === 'equipo' && (
        <div
          className='cms-sheet-overlay'
          onClick={() => setIsTeamFormOpen(false)}
        >
          <div
            className='cms-sheet-content'
            onClick={(e) => e.stopPropagation()}
          >
            <TeamForm
              memberToEdit={teamMemberToEdit}
              onSubmitSuccess={handleTeamSuccess}
              onCancel={() => setIsTeamFormOpen(false)}
            />
          </div>
        </div>
      )}

      {isUserFormOpen && activeTab === 'configuracion' && (
        <div
          className='cms-sheet-overlay'
          onClick={() => setIsUserFormOpen(false)}
        >
          <div
            className='cms-sheet-content'
            onClick={(e) => e.stopPropagation()}
          >
            <UserForm
              userToEdit={userToEdit}
              onSubmitSuccess={handleUserSuccess}
              onCancel={() => setIsUserFormOpen(false)}
            />
          </div>
        </div>
      )}

      {/* 🌟 MODAL DE CONFIRMACIÓN PERSONALIZADO 🌟 */}
      {confirmDialog.isOpen && (
        <div
          className='cms-confirm-overlay'
          onClick={closeConfirm}
        >
          <div
            className='cms-confirm-modal'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='cms-confirm-modal__icon'>
              <AlertTriangle
                size={32}
                strokeWidth={2}
              />
            </div>
            <h3>Confirmar Acción</h3>
            <p>{confirmDialog.message}</p>

            <div className='cms-confirm-modal__actions'>
              <button
                className='btn-cancel'
                onClick={closeConfirm}
              >
                Cancelar
              </button>
              <button
                className='btn-confirm'
                onClick={() => {
                  confirmDialog.onConfirm();
                  closeConfirm();
                }}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CmsDashboard;
