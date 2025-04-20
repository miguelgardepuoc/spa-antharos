import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './Header.css';

// Define types for navigation items
interface NavigationItem {
  path: string;
  label: string;
  icon?: string;
}

// Types for component props
interface HeaderProps {
  logoText?: string;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  logoText = 'Antharos',
  className = ''
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  
  // Navigation items configuration
  const navigationItems: NavigationItem[] = [
    { path: '/job-offers', label: 'Ofertas de empleo' },       
    { path: '/corporate-management', label: 'Gestión corporativa' },
    { path: '/people-analytics', label: 'People Analytics' }
  ];

  // Check if user is logged in on component mount and when authToken changes
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('authToken');
      setIsLoggedIn(!!token);
    };
    
    // Initial check
    checkAuthStatus();
    
    // Setup event listener for storage changes (in case of login/logout in another tab)
    window.addEventListener('storage', checkAuthStatus);
    
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      // Set isScrolled to true when page is scrolled more than 50px
      const scrolled = window.scrollY > 50;
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isScrolled]);

  const handleLoginClick = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  const handleLogoutClick = useCallback(() => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    navigate('/');
  }, [navigate]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  // Check if a navigation item is active
  const isActive = useCallback((path: string): boolean => {
    return location.pathname === path;
  }, [location.pathname]);

  return (
    <header className={`header ${className} ${isScrolled ? 'header--collapsed' : ''}`}>
      <div className="header__container">
        <div className="header__top">
          <Link to="/" className="header__logo">
            {logoText}
          </Link>
          
          <div className="header__actions">
            {isLoggedIn ? (
              <>
                <button 
                  className="header__button header__button--logout" 
                  onClick={handleLogoutClick}
                  aria-label="Cerrar sesión"
                >
                  Cerrar sesión
                </button>
                {/* Menu toggle button only appears if logged in */}
                <button 
                  className={`header__menu-toggle ${isMenuOpen ? 'header__menu-toggle--active' : ''}`}
                  onClick={toggleMenu}
                  aria-expanded={isMenuOpen}
                  aria-label="Toggle navigation menu"
                >
                  <span className="header__menu-icon"></span>
                </button>
              </>
            ) : (
              <button 
                className="header__button header__button--login" 
                onClick={handleLoginClick}
                aria-label="Iniciar sesión"
              >
                Iniciar sesión
              </button>
            )}
          </div>
        </div>
        
        {/* Only show navigation if the user is logged in */}
        {isLoggedIn && (
          <nav className={`header__nav ${isMenuOpen ? 'header__nav--open' : ''}`}>
            <ul className="header__nav-list">
              {navigationItems.map((item) => (
                <li key={item.path} className="header__nav-item">
                  <Link 
                    to={item.path}
                    className={`header__nav-link ${isActive(item.path) ? 'header__nav-link--active' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;