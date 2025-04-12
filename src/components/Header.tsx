import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="main-header">
      <div className="header-content">
        <div className="logo">Antharos</div>
        <div className="login-button">
          <button>Iniciar sesión</button>
        </div>
      </div>
    </header>
  );
};

export default Header;