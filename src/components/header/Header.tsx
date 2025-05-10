import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './Header.css';

interface NavigationItem {
  path: string;
  label: string;
  icon?: string;
}

interface HeaderProps {
  logoText?: string;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ logoText = 'Antharos', className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  const navigationItems: NavigationItem[] = [
    { path: '/job-offers', label: 'Ofertas de empleo' },
    { path: '/corporate-management', label: 'Gestión Corporativa' },
    { path: '/people-analytics', label: 'People Analytics' },
  ];

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('authToken');
      setIsLoggedIn(!!token);

      if (token) {
        const userRole = localStorage.getItem('userRole');
        setUserRole(userRole);
      }
    };

    checkAuthStatus();

    window.addEventListener('storage', checkAuthStatus);
    return () => window.removeEventListener('storage', checkAuthStatus);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isScrolled]);

  const handleLoginClick = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  const handleLogoutClick = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    navigate('/');
  }, [navigate]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const isActive = useCallback(
    (path: string): boolean => {
      return location.pathname === path;
    },
    [location.pathname]
  );

  const filteredNavigationItems = navigationItems.filter((item) => {
    if (item.path === '/people-analytics' && userRole !== 'ROLE_COMPANY_MANAGEMENT') {
      return false;
    } else if (item.path === '/corporate-management' && userRole == 'ROLE_EMPLOYEE') {
      return false;
    } else if (item.path === '/job-offers' && userRole == 'ROLE_EMPLOYEE') {
      return false;
    }
    return true;
  });

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
              {filteredNavigationItems.map((item) => (
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
