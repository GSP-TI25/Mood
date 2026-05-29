import { useState, useEffect } from 'react';
import CmsSidebar from '../../components/Cms/CmsSidebar';
import JobsTable from '../../components/Cms/JobsTable';
import JobForm from '../../components/Cms/JobForm';
import ApplicationsTable from '../../components/Cms/ApplicationsTable';
import UsersTable from '../../components/Cms/UsersTable';
import UserForm from '../../components/Cms/UserForm';
import Profile from '../../components/Cms/Profile';
import ProjectsTable from '../../components/Cms/ProjectsTable';
import ProjectForm from '../../components/Cms/ProjectForm';
import TeamTable from '../../components/Cms/TeamTable'; // 🌟 Importado
import TeamForm from '../../components/Cms/TeamForm'; // 🌟 Importado
import { Plus } from 'lucide-react';
import './CmsDashboard.scss';

const CmsDashboard = () => {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('cms_active_tab') || 'vacantes';
  });

  useEffect(() => {
    localStorage.setItem('cms_active_tab', activeTab);
  }, [activeTab]);

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [team, setTeam] = useState([]); // 🌟 Estado para Equipo

  // Estados Modales
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState(null);

  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);

  const [isTeamFormOpen, setIsTeamFormOpen] = useState(false); // 🌟 Estado Modal Equipo
  const [teamMemberToEdit, setTeamMemberToEdit] = useState(null); // 🌟 Estado Editar Miembro

  const fetchJobs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/jobs');
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Error al cargar vacantes:', error);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/applications');
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error('Error al cargar postulaciones:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
    }
  };

  // 🌟 Nueva función Fetch
  const fetchTeam = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/team');
      if (response.ok) {
        const data = await response.json();
        setTeam(data);
      }
    } catch (error) {
      console.error('Error al cargar equipo:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'vacantes') fetchJobs();
    if (activeTab === 'postulantes') fetchApplications();
    if (activeTab === 'configuracion') fetchUsers();
    if (activeTab === 'proyectos') fetchProjects();
    if (activeTab === 'equipo') fetchTeam(); // 🌟 Llama si estamos en equipo
  }, [activeTab]);

  useEffect(() => {
    document.body.style.overflow =
      isFormOpen || isUserFormOpen || isProjectFormOpen || isTeamFormOpen
        ? 'hidden'
        : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFormOpen, isUserFormOpen, isProjectFormOpen, isTeamFormOpen]);

  // Handlers Success
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
  }; // 🌟 Team Success

  // Handlers Toggles
  const handleToggleStatus = async (jobId) => {
    const token = localStorage.getItem('cms_token');
    const isConfirmed = window.confirm(
      '¿Seguro que deseas cambiar el estado de esta vacante?',
    );
    if (!isConfirmed) return;
    try {
      const response = await fetch(
        `http://localhost:5000/api/jobs/${jobId}/status`,
        {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.ok) fetchJobs();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleToggleProjectStatus = async (projectId) => {
    const token = localStorage.getItem('cms_token');
    const isConfirmed = window.confirm(
      '¿Seguro que deseas cambiar la visibilidad de este proyecto?',
    );
    if (!isConfirmed) return;
    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/${projectId}/status`,
        {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.ok) fetchProjects();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleToggleTeamStatus = async (memberId) => {
    const token = localStorage.getItem('cms_token');
    const isConfirmed = window.confirm(
      '¿Seguro que deseas cambiar la visibilidad de este miembro?',
    );
    if (!isConfirmed) return;
    try {
      const response = await fetch(
        `http://localhost:5000/api/team/${memberId}/status`,
        {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.ok) fetchTeam();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Open Forms
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
      console.error('Error al cargar detalles:', error);
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
        {activeTab !== 'configuracion' && activeTab !== 'perfil' && (
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

            {/* 🌟 BOTÓN PARA NUEVO MIEMBRO DEL EQUIPO */}
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

        {/* 🌟 TABLA DEL EQUIPO */}
        {activeTab === 'equipo' && (
          <TeamTable
            team={team}
            onToggleStatus={handleToggleTeamStatus}
            onEdit={openEditTeamForm}
          />
        )}

        {activeTab === 'configuracion' && (
          <UsersTable
            users={users}
            onAddUser={openCreateUserForm}
            onEdit={(user) => {
              setUserToEdit(user);
              setIsUserFormOpen(true);
            }}
          />
        )}

        {activeTab === 'perfil' && <Profile />}
      </main>

      {/* MODAL: VACANTES */}
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

      {/* MODAL: PROYECTOS */}
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

      {/* MODAL: EQUIPO */}
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

      {/* MODAL: USUARIOS */}
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
    </div>
  );
};

export default CmsDashboard;
