import React, { useState } from 'react';
import { Department } from '../../types/Department';

interface DepartmentTableProps {
  departments: Department[];
  onRename: (department: Department) => void;
  onDelete: (department: Department) => void;
}

const DepartmentTable: React.FC<DepartmentTableProps> = ({ departments, onRename, onDelete }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const toggleMenu = (departmentId: string) => {
    if (activeMenu === departmentId) {
      setActiveMenu(null);
    } else {
      setActiveMenu(departmentId);
    }
  };

  // Cerrar el menú al hacer clic fuera
  React.useEffect(() => {
    const handleClickOutside = () => {
      setActiveMenu(null);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  if (departments.length === 0) {
    return (
      <div className="empty-state">
        <p>No hay departamentos disponibles.</p>
      </div>
    );
  }

  return (
    <div className="department-table-container">
      <table className="department-table">
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
                <div className="dropdown-container">
                  <button 
                    className="menu-button"
                    onClick={(e) => {
                      e.stopPropagation(); // Evitar que el clic se propague
                      toggleMenu(department.id);
                    }}
                    title="Opciones"
                  >
                    <span className="material-icons">more_vert</span> {/* Tres puntos verticales */}
                    {/* Alternativa: <span className="material-icons">settings</span> para una ruedita */}
                  </button>
                  
                  {activeMenu === department.id && (
                    <div className="dropdown-menu">
                      <button 
                        className="menu-item"
                        onClick={() => {
                          onRename(department);
                          setActiveMenu(null);
                        }}
                      >
                        <span className="material-icons">edit</span>
                        <span>Renombrar</span>
                      </button>
                      <button 
                        className="menu-item"
                        onClick={() => {
                          onDelete(department);
                          setActiveMenu(null);
                        }}
                      >
                        <span className="material-icons">delete</span>
                        <span>Eliminar</span>
                      </button>
                    </div>
                  )}
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