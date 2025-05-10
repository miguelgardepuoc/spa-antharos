import { RequirementsListProps } from '../../../types/formComponents';

export const RequirementsList = ({
  requirements,
  onChange,
  onAdd,
  onRemove,
  required = false,
  error,
}: RequirementsListProps) => {
  return (
    <div className="form-field">
      <label className="form-label">
        Requisitos {required && <span className="text-error">*</span>}
      </label>
      <div className={`requirements-container ${error ? 'error' : ''}`}>
        {requirements.map((req, index) => (
          <div key={index} className="requirement-item">
            <input
              type="text"
              value={req}
              onChange={(e) => onChange(index, e.target.value)}
              className="requirement-input"
              placeholder={`Requisito ${index + 1}`}
              required={required && index === 0}
              aria-label={`Requisito ${index + 1}`}
              aria-invalid={!!error && index === 0}
              maxLength={150}
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="remove-button"
              aria-label="Eliminar requisito"
              disabled={requirements.length <= 1}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={onAdd}
          className="add-button"
          aria-label="Añadir nuevo requisito"
        >
          <span className="add-icon">+</span>
          Añadir requisito
        </button>
      </div>
      {error && (
        <div className="form-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

export default RequirementsList;
