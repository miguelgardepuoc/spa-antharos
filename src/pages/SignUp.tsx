import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api/authApi';
import './SignUpPage.css';

export default function SignUp() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [apiError, setApiError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError('');
    setApiError('');
    
    if (password !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }
    
    if (password.length < 8) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres de longitud');
      return;
    }

    setIsLoading(true);
    
    try {
        const result = await signup(username, password);
        
        if ('message' in result) {
          setApiError(result.message);
        } else {
          console.log('Signup successful:', result);
          navigate('/');
        }
      } catch (err) {
        setApiError('An unexpected error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <div className="signup-container">
      <div className="image-section"></div>
      <div className="form-section">
        <div className="form-container">
          <h1 className="form-title">Registrarse</h1>
          <p className="form-subtitle">Completa tu registro estableciendo una contraseña</p>

          {apiError && (
            <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
              {apiError}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label" htmlFor="username">
              Nombre de usuario
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nombre de usuario existente"
                className="form-input"
                required
              />
            </div>
            
            <div className="input-group">
              <label className="input-label" htmlFor="password">
              Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Crea una contraseña"
                className="form-input"
                required
              />
            </div>
            
            <div className="input-group">
              <label className="input-label" htmlFor="confirmPassword">
              Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirma tu contraseña"
                className="form-input"
                required
              />
              {passwordError && (
                <p className="error-text">{passwordError}</p>
              )}
            </div>
            
            <button
              type="submit"
              className="submit-button"
              disabled={isLoading}
            >
                {isLoading ? 'Registrandose...' : 'Registrarse'}
              
            </button>
            
            <p className="login-text">
            Ya estás registrado? <a href="/login" className="login-link">Iniciar sesión</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}