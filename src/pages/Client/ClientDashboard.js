import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../../components/ThemeToggle';

const ClientDashboard = () => {
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
        <h2>Cliente</h2>
        <ThemeToggle />
        <p>Bem-vindo, {user?.name?.split(' ')[0]}!</p>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
        <nav className="nav-links">
          <NavLink 
            to="/client/catalog" 
            className={`nav-link ${isActiveRoute('/client/catalog') ? 'active-link' : ''}`} 
          >
            Catálogo
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

export default ClientDashboard;
