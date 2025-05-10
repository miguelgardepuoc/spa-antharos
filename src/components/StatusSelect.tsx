import React from 'react';

interface StatusOption {
  value: string;
  label: string;
  className?: string;
}

interface StatusSelectProps {
  status: string;
  options: StatusOption[];
  id: string;
  onStatusChange: (id: string, newStatus: string) => void;
  disabled?: boolean;
  isUpdating?: boolean;
}

const StatusSelect: React.FC<StatusSelectProps> = ({
  status,
  options,
  id,
  onStatusChange,
  disabled = false,
  isUpdating = false
}) => {
  return (
    <div className="status-select-container">
      <select
        value={status}
        onChange={(e) => onStatusChange(id, e.target.value)}
        className={`status-select ${options.find(opt => opt.value === status)?.className || ''}`}
        disabled={disabled || isUpdating}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {isUpdating && <span className="updating-indicator"> ⟳</span>}
    </div>
  );
};

export const employeeStatusOptions: StatusOption[] = [
  { value: 'ACTIVE', label: 'Activo', className: 'status-active' },
  { value: 'INACTIVE', label: 'Inactivo', className: 'status-inactive' },
  { value: 'SUSPENDED', label: 'Suspendido', className: 'status-suspended' }
];

export const candidateStatusOptions: StatusOption[] = [
  { value: 'APPLIED', label: 'Inscrito', className: 'status-applied' },
  { value: 'INTERVIEWING', label: 'Entrevistando', className: 'status-interviewing' },
  { value: 'HIRED', label: 'Contratado', className: 'status-hired' },
  { value: 'REJECTED', label: 'Rechazado', className: 'status-rejected' }
];

export default StatusSelect;