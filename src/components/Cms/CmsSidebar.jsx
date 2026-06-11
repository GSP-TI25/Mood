import { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import {
  Briefcase,
  Users,
  FolderGit2,
  IdCard,
  Settings,
  LayoutDashboard,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Menu,
  CircleUser,
  UserCircle,
} from 'lucide-react';
import logoMood from '../../assets/Logo_Mood.svg';
import './CmsSidebar.scss';

const CmsSidebar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  const isSuperAdmin = user?.role_name === 'SuperAdmin' || user?.role_id === 1;
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsOpen(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    if (window.innerWidth <= 768) setIsOpen(false);
  };

  const menuItems = [
    { id: 'inicio', name: 'Inicio', icon: <LayoutDashboard size={16} /> },
    { id: 'vacantes', name: 'Vacantes', icon: <Briefcase size={16} /> },
    { id: 'postulantes', name: 'Postulantes', icon: <Users size={16} /> },
    { id: 'proyectos', name: 'Proyectos', icon: <FolderGit2 size={16} /> },
    { id: 'equipo', name: 'Equipo Mood', icon: <IdCard size={16} /> },
  ];

  if (isSuperAdmin) {
    menuItems.push({
      id: 'configuracion',
      name: 'Configuración',
      icon: <Settings size={20} />,
    });
  }

  const getAvatarUrl = (url) => {
    if (!url) return null;
    return url.startsWith('http') ? url : `http://localhost:5000${url}`;
  };
  const avatarUrl = getAvatarUrl(user?.avatar_url);

  return (
    <>
      <button
        className={`cms-mobile-hamburger ${isOpen ? 'hidden' : ''}`}
        onClick={toggleSidebar}
      >
        <Menu size={20} />
      </button>

      {isOpen && (
        <div
          className='cms-mobile-overlay'
          onClick={toggleSidebar}
        ></div>
      )}

      <aside className={`cms-sidebar ${isOpen ? 'open' : 'collapsed'}`}>
        <button
          className='toggle-btn'
          onClick={toggleSidebar}
        >
          {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>

        <div className='logo-container'>
          <img
            src={logoMood}
            alt='Mood Logo'
          />
        </div>

        <nav>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              title={!isOpen ? item.name : ''}
            >
              <div className='icon-wrapper'>{item.icon}</div>
              <span className='label'>{item.name}</span>
            </button>
          ))}
        </nav>

        <div className='footer-actions'>
          <div
            className='user-menu-container'
            ref={menuRef}
          >
            <div
              className={`user-mini-card ${showUserMenu ? 'active' : ''}`}
              onClick={() => setShowUserMenu(!showUserMenu)}
              title={!isOpen ? 'Opciones de Usuario' : ''}
            >
              <div className='avatar'>
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt='Avatar'
                  />
                ) : (
                  <CircleUser size={20} />
                )}
              </div>
              <div className='info'>
                <span className='name'>{user?.first_name || 'Admin'}</span>
                <span
                  className='email'
                  title={user?.email}
                >
                  {user?.email || 'Usuario de Mood'}
                </span>
              </div>
            </div>

            {showUserMenu && (
              <div className='user-dropdown'>
                <button
                  className='dropdown-item'
                  onClick={() => {
                    handleTabClick('perfil');
                    setShowUserMenu(false);
                  }}
                >
                  <UserCircle size={16} /> Mi Perfil
                </button>
                <div className='dropdown-divider'></div>
                <button
                  className='dropdown-item logout'
                  onClick={() => {
                    logout();
                  }}
                >
                  <LogOut size={16} /> Cerrar Sesión
                </button>
              </div>
            )}
          </div>
          <p className='copyright'>© {currentYear} Mood</p>
        </div>
      </aside>
    </>
  );
};

export default CmsSidebar;
