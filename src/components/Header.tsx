import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Comprobar si el usuario está logueado al cargar el componente
  useEffect(() => {
    // Aquí puedes implementar tu lógica de verificación de sesión
    // Por ejemplo, verificando si existe un token en localStorage
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <header className='main-header'>
      <div className='header-content'>
        <div className='logo'>Antharos</div>
        <div className='login-button'>
          {isLoggedIn ? (
            <button onClick={handleLogoutClick}>Cerrar sesión</button>
          ) : (
            <button onClick={handleLoginClick}>Iniciar sesión</button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
