import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <header className="main-header">
      <div className="header-content">
        <div className="logo">Antharos</div>
        <div className="login-button">
          <button onClick={handleLoginClick}>Iniciar sesión</button>
        </div>
      </div>
    </header>
  );
};

export default Header;