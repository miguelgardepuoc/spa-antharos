import { useState, useEffect, useRef } from 'react';
import { DropdownProps } from '../../../types/formComponents';
import './Dropdown.css';

export function Dropdown<T>({ 
  label, 
  value, 
  options, 
  loading, 
  error: apiError, 
  renderOption, 
  onSelect, 
  placeholder = 'Seleccionar', 
  required = false, 
  error: validationError 
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: T) => {
    onSelect(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isOptionSelected = (option: T): boolean => {
    if (option === null || option === undefined) return false;
    if (typeof option === 'object' && option !== null && 'description' in option) {
      return (option as any).description === value;
    }
    return option === value;
  };

  const getOptionKey = (option: T, index: number): string | number => {
    if (option === null || option === undefined) return index;
    if (typeof option === 'object' && option !== null && 'id' in option) {
      return (option as any).id;
    }
    return index;
  };

  return (
    <div className="form-field">
      <label className="form-label">
        {label}
        {required && <span className="text-error">*</span>}
      </label>
      <div 
        className={`dropdown ${validationError ? 'error' : ''}`} 
        ref={dropdownRef} 
        data-open={isOpen}
      >
        <button 
          type="button" 
          className="dropdown-toggle" 
          onClick={() => setIsOpen(!isOpen)} 
          aria-haspopup="listbox" 
          aria-expanded={isOpen} 
          aria-invalid={!!validationError}
        >
          <span className={!value ? 'text-muted' : ''}>
            {value || placeholder}
          </span>
          <span className="dropdown-arrow">▼</span>
        </button>
        {isOpen && (
          <ul className="dropdown-menu" role="listbox">
            {loading ? (
              <li className="dropdown-item-loading" role="status">Cargando opciones...</li>
            ) : apiError ? (
              <li className="dropdown-item-error" role="alert">Error: {apiError}</li>
            ) : options.length === 0 ? (
              <li className="dropdown-item-empty">No hay opciones disponibles</li>
            ) : (
              options.map((option, index) => (
                <li 
                  key={getOptionKey(option, index)}
                  className="dropdown-item" 
                  onClick={() => handleSelect(option)} 
                  role="option" 
                  aria-selected={isOptionSelected(option)}
                >
                  {renderOption(option)}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
      {validationError && (
        <div className="form-error" role="alert">{validationError}</div>
      )}
    </div>
  );
}