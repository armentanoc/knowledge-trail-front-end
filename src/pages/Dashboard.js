// src/pages/Dashboard.js
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
 const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout(); 
    navigate('/login'); 
  };

  useEffect(() => {
    if (user) {
      switch (user.role) {
        case 'admin':
          navigate('/admin/user');
          break;
        case 'employee':
        default:
          navigate('/employee/skills');
          break;
      }
    }
  }, [user, navigate]);

  return (
    <div>
      <button onClick={handleLogout}>Sair</button>
      <h2>Painel Principal</h2>
      <p>Bem-vindo ao sistema de alocação de espaço físico!</p>
      <nav>
        <ul>
          <li>
            <Link to="/employee">Painel do Funcionário</Link>
          </li> 
          <li>
            <Link to="/admin">Painel do Administrador</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Dashboard;
