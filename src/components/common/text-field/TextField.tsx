import { TextFieldProps } from '../../../types/formComponents';
import './TextField.css';

export const TextField = ({ 
  label, 
  id, 
  value, 
  onChange, 
  placeholder, 
  multiline = false, 
  rows = 3,
  required = false,
  maxLength,
  type = "text",
  onBlur,
  error
}: TextFieldProps) => {
  return (
    <div className="form-field">
      <label htmlFor={id} className="form-label">
        {label} {required && <span className="text-error">*</span>}
      </label>
      {multiline ? (
        <textarea
          id={id}
          rows={rows}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`form-textarea ${error ? 'error' : ''}`}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          aria-required={required}
          aria-invalid={!!error}
        />
      ) : (
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`form-input ${error ? 'error' : ''}`}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          aria-required={required}
          aria-invalid={!!error}
        />
      )}
      {maxLength && (
        <div className="input-counter">
          {value.length}/{maxLength}
        </div>
      )}
      {error && (
        <div className="form-error" role="alert">{error}</div>
      )}
    </div>
  );
};