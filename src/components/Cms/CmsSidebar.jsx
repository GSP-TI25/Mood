import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Briefcase, LogOut } from 'lucide-react';
import logoMood from '../../assets/Logo_Mood.svg'; // 🌟 Importamos tu Logo
import './CmsSidebar.scss';

const CmsSidebar = () => {
  const { logout } = useContext(AuthContext);

  return (
    <aside className='cms-sidebar-nav'>
      <div className='cms-sidebar-nav__brand'>
        <img
          src={logoMood}
          alt='Mood Agencia Logo'
          className='cms-sidebar-nav__logo'
        />
      </div>

      <nav className='cms-sidebar-nav__menu'>
        <button className='cms-sidebar-nav__link active'>
          <Briefcase size={18} />
          Vacantes
        </button>
      </nav>

      <div className='cms-sidebar-nav__footer'>
        <button
          onClick={logout}
          className='cms-sidebar-nav__logout'
        >
          <LogOut size={18} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default CmsSidebar;
