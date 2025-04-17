import { ButtonProps } from '../../../types/FormComponents';
import './Button.css';

export const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  type = 'button', 
  fullWidth = false,
  disabled = false,
  isLoading = false
}: ButtonProps) => {
  const buttonClass = `button ${variant} ${fullWidth ? 'full-width' : ''} ${isLoading ? 'loading' : ''}`;
  
  return (
    <button
      type={type}
      onClick={onClick}
      className={buttonClass}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
    >
      {isLoading ? 'Guardando...' : children}
    </button>
  );
};