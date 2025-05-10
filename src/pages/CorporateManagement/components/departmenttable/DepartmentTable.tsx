import React, { useState } from 'react';
import { Department } from '../../../../types/department';

interface DepartmentTableProps {
  departments: Department[];
  loading: boolean;
  error: string | null;
  onRename: (department: Department) => void;
  onDelete: (department: Department) => void;
  onEditHead: (department: Department) => void;
}
 
const DepartmentTable: React.FC<DepartmentTableProps> = ({ departments, loading, error, onRename, onDelete, onEditHead }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  if (loading) {
    return <div className="loading-candidates">Cargando candidatos...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const toggleMenu = (departmentId: string) => {
    if (activeMenu === departmentId) {
      setActiveMenu(null);
    } else {
      setActiveMenu(departmentId);
    }
  };

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
      <div className="departments-section">
        <p className="no-departments">
          Todavía no hay departamentos disponibles
        </p>
      </div>
    );
  }

  return (
    <div className="departments-table-container">
      <table className="departments-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Jefe de Departamento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((department) => (
            <tr key={department.id}>
              <td>{department.description}</td>
              <td>{department.departmentHeadFullName || '—'}</td>
              <td>
                <div className="dropdown-container">
                  <button 
                    className="menu-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMenu(department.id);
                    }}
                    title="Opciones"
                  >
                    <span className="material-icons">settings</span>
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
                        onEditHead(department);
                        setActiveMenu(null);
                      }}
                    >
                      <span className="material-icons">person</span>
                      <span>Editar Responsable</span>
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
