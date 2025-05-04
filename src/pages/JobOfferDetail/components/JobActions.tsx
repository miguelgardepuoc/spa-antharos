import React from 'react';

interface JobActionsProps {
  onEdit: () => void;
  onRemove: () => void;
  isDeleting: boolean;
}

const JobActions: React.FC<JobActionsProps> = ({ onEdit, onRemove, isDeleting }) => {
  return (
    <div className="admin-actions">
      <button 
        className="edit-job-offer-button"
        onClick={onEdit}
      >
        Editar oferta de trabajo
      </button>
      <button 
        className="remove-job-offer-button"
        onClick={onRemove}
        disabled={isDeleting}
      >
        {isDeleting ? 'Eliminando...' : 'Retirar oferta de trabajo'}
      </button>
    </div>
  );
};

export default JobActions;