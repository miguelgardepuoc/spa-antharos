import { useState, FormEvent } from 'react';
import './LoginPage.css';

export default function BookshelfLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Login attempted with:', email);
  };

  return (
    <div className="login-container">
      <div className="image-section"></div>

      <div className="form-section">
        <div className="form-container">
          <h1 className="form-title">Iniciar sesión</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@gmail.com"
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
                placeholder="••••••••••"
                className="form-input"
                required
              />
            </div>
            
            <button
              type="submit"
              className="submit-button"
            >
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}