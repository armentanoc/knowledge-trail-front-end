import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../../components/ThemeToggle';

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const isActiveRoute = (route) => {
    return location.pathname.startsWith(route);
  };

  return (
    <div className="layout">
      <header className="header">
        <h2>Funcionário</h2>
        <ThemeToggle />
        <p>Bem-vindo, {user?.name?.split(' ')[0]}!</p>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
        <nav className="nav-links">
          <NavLink 
            to="/employee/skills" 
            className={`nav-link ${isActiveRoute('/employee/skills') ? 'active-link' : ''}`} 
          >
            Habilidades
          </NavLink>
          <NavLink 
            to="/employee/trails" 
            className={`nav-link ${isActiveRoute('/employee/trails') ? 'active-link' : ''}`} 
          >
            Trilhas
          </NavLink>
        </nav>
        <hr />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default EmployeeDashboard;
