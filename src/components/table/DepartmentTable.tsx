import React from 'react';
import { Department } from '../../types/Department';

interface DepartmentTableProps {
  departments: Department[];
  onRename: (department: Department) => void;
  onDelete: (department: Department) => void;
}

const DepartmentTable: React.FC<DepartmentTableProps> = ({ departments, onRename, onDelete }) => {
  if (departments.length === 0) {
    return (
      <div className="empty-state">
        <p>No hay departamentos disponibles.</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((department) => (
            <tr key={department.id}>
              <td>{department.description}</td>
              <td>
                <div className="action-buttons">
                  <button 
                    className="rename-button" 
                    onClick={() => onRename(department)}
                    title="Renombrar departamento"
                  >
                    <span className="material-icon">edit</span>
                  </button>
                  <button 
                    className="delete-button" 
                    onClick={() => onDelete(department)}
                    title="Eliminar departamento"
                  >
                    <span className="material-icon">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DepartmentTable;