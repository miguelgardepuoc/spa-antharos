import React, { useState, useEffect } from 'react';
import { Department } from '../../../types/department';
import Table from '../../../components/common/table/Table';

interface DepartmentTableProps {
  departments: Department[];
  onRename: (department: Department) => void;
  onDelete: (department: Department) => void;
  onEditHead: (department: Department) => void;
}
 
const DepartmentTable: React.FC<DepartmentTableProps> = ({ 
  departments,
  onRename, 
  onDelete, 
  onEditHead 
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const headers = ['Nombre', 'Responsable', 'Acciones'];

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveMenu(null);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const toggleMenu = (departmentId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (activeMenu === departmentId) {
      setActiveMenu(null);
    } else {
      setActiveMenu(departmentId);
    }
  };

  const renderDepartmentRow = (department: Department) => {
    return (
      <tr key={department.id}>
        <td>{department.description}</td>
        <td>{department.departmentHeadFullName || '—'}</td>
        <td>
          <div className="dropdown-container">
            <button 
              className="menu-button"
              onClick={(e) => toggleMenu(department.id, e)}
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
    );
  };

  return (
      <Table
        headers={headers}
        data={departments}
        renderRow={renderDepartmentRow}
        emptyMessage={
          <p className="no-departments">
            Todavía no hay departamentos disponibles
          </p>
        }
        loadingMessage="Cargando departamentos..."
      />
  );
};

export default DepartmentTable;