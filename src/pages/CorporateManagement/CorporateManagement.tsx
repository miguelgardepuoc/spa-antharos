import React, { useState, useEffect } from 'react';
import { Department } from '../../types/department';
import { Employee } from '../../types/employee';
import DepartmentTable from './components/DepartmentTable';
import EmployeeTable from './components/EmployeeTable';
import { fetchEmployees } from '../../services/employeeService';
import {
  fetchDepartments,
  renameDepartment,
  deleteDepartment,
  addDepartment,
  updateDepartmentHead,
} from '../../services/departmentService';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import './CorporateManagement.css';

const CorporateManagement: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [newDepartmentName, setNewDepartmentName] = useState<string>('');
  const [newDepartment, setNewDepartment] = useState<string>('');
  const [newDepartmentHead, setNewDepartmentHead] = useState<string>('');
  const [showRenameModal, setShowRenameModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showEditHeadModal, setShowEditHeadModal] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const decoded: { role: string; exp: number } = jwtDecode(token);
          setUserRole(decoded.role || null);
        } catch (error) {
          console.error('Error decoding token', error);
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
    };

    checkAuthStatus();
    window.addEventListener('storage', checkAuthStatus);
    return () => window.removeEventListener('storage', checkAuthStatus);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const departmentsData = await fetchDepartments();
        setDepartments(departmentsData);
        const employeesData = await fetchEmployees();
        setEmployees(employeesData);
      } catch (err) {
        setError('Error al cargar los datos corporativos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRenameClick = (department: Department) => {
    setSelectedDepartment(department);
    setNewDepartmentName(department.description);
    setShowRenameModal(true);
  };

  const handleDeleteClick = (department: Department) => {
    setSelectedDepartment(department);
    setShowDeleteModal(true);
  };

  const handleEditHeadClick = (department: Department) => {
    setSelectedDepartment(department);
    setNewDepartmentHead(department.departmentHeadFullName || '');
    setShowEditHeadModal(true);
  };

  const handleRenameSubmit = async () => {
    if (!selectedDepartment || !newDepartmentName.trim()) return;

    try {
      await renameDepartment(selectedDepartment.id, newDepartmentName);
      setDepartments(
        departments.map((dept) =>
          dept.id === selectedDepartment.id ? { ...dept, description: newDepartmentName } : dept
        )
      );
      setShowRenameModal(false);
    } catch (err) {
      setError('Error al renombrar el departamento');
      console.error(err);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedDepartment) return;

    try {
      await deleteDepartment(selectedDepartment.id);
      setDepartments(departments.filter((dept) => dept.id !== selectedDepartment.id));
      setShowDeleteModal(false);
    } catch (err) {
      setError('Error al eliminar el departamento');
      console.error(err);
    }
  };

  const handleAddDepartment = async () => {
    if (!newDepartment.trim()) return;

    try {
      const department = await addDepartment(newDepartment);
      setDepartments([...departments, department]);
      setShowAddModal(false);
      setNewDepartment('');
    } catch (err) {
      setError('Error al añadir el departamento');
      console.error(err);
    }
  };

  const handleEditHeadSubmit = async () => {
    if (!selectedDepartment || !newDepartmentHead.trim()) return;

    try {
      await updateDepartmentHead(selectedDepartment.id, newDepartmentHead);
      setDepartments(
        departments.map((dept) =>
          dept.id === selectedDepartment.id
            ? { ...dept, departmentHeadFullName: newDepartmentHead }
            : dept
        )
      );
      setShowEditHeadModal(false);
      setNewDepartmentHead('');
    } catch (error: any) {
      console.error('Error al actualizar el responsable del departamento', error);

      let errorMessage = '';
      if (error?.response?.status === 422) {
        const errors = error?.response?.data?.errors;
        const errorCode = Array.isArray(errors) && errors.length > 0 ? errors[0].code : null;
        setShowEditHeadModal(false);

        switch (errorCode) {
          case 'USER_IS_NOT_ACTIVE':
            errorMessage = 'El usuario no está activo. Por favor, revisa la información.';
            break;
          case 'USER_IS_NOT_EMPLOYEE':
            errorMessage =
              'El usuario es parte de la dirección o ya es responsable de otro departamento. Por favor, revisa la información.';
            break;
          default:
            errorMessage = 'Usuario no puede ser asignado como responsable';
            break;
        }
      }

      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    }
  };

  if (loading) {
    return <div className="loading">Cargando datos corporativos...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="corporate-management">
      <h1>Gestión Corporativa</h1>

      <section className="employees-section">
        <h2>Plantilla</h2>
        <EmployeeTable />
      </section>

      {userRole === 'ROLE_COMPANY_MANAGEMENT' && (
        <section className="departments-section">
          <h2>Departamentos</h2>
          <DepartmentTable
            departments={departments}
            onRename={handleRenameClick}
            onDelete={handleDeleteClick}
            onEditHead={handleEditHeadClick}
          />

          <div className="add-department-button-container">
            <button className="add-department-button" onClick={() => setShowAddModal(true)}>
              Añadir departamento
            </button>
          </div>
        </section>
      )}

      {showRenameModal && selectedDepartment && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Renombrar departamento</h3>
            <div className="modal-content">
              <input
                type="text"
                value={newDepartmentName}
                onChange={(e) => setNewDepartmentName(e.target.value)}
                placeholder="Nuevo nombre"
              />
            </div>
            <div className="modal-actions">
              <button className="cancel-button" onClick={() => setShowRenameModal(false)}>
                Cancelar
              </button>
              <button className="confirm-button" onClick={handleRenameSubmit}>
                Renombrar
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && selectedDepartment && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Eliminar departamento</h3>
            <div className="modal-content">
              <p>
                ¿Estás seguro que deseas eliminar el departamento "{selectedDepartment.description}
                "?
              </p>
            </div>
            <div className="modal-actions">
              <button className="cancel-button" onClick={() => setShowDeleteModal(false)}>
                Cancelar
              </button>
              <button className="delete-button" onClick={handleDeleteSubmit}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Añadir departamento</h3>
            <div className="modal-content">
              <input
                type="text"
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                placeholder="Nombre del departamento"
              />
            </div>
            <div className="modal-actions">
              <button className="cancel-button" onClick={() => setShowAddModal(false)}>
                Cancelar
              </button>
              <button className="confirm-button" onClick={handleAddDepartment}>
                Añadir
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditHeadModal && selectedDepartment && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Editar responsable de departamento</h3>
            <div className="modal-content">
              <input
                type="text"
                onChange={(e) => setNewDepartmentHead(e.target.value)}
                placeholder="Username del nuevo responsable"
              />
            </div>
            <div className="modal-actions">
              <button className="cancel-button" onClick={() => setShowEditHeadModal(false)}>
                Cancelar
              </button>
              <button className="confirm-button" onClick={handleEditHeadSubmit}>
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CorporateManagement;
