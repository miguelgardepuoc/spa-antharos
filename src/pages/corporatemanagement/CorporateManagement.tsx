import React, { useState, useEffect } from 'react';
import { Department } from '../../types/Department';
import { Employee } from '../../types/Employee';
import DepartmentTable from '../../components/table/DepartmentTable';
import EmployeeTable from '../../components/table/EmployeeTable';
import { fetchEmployees } from '../../services/employeeService';
import {
  fetchDepartments,
  renameDepartment,
  deleteDepartment,
  addDepartment
} from '../../services/departmentService';
import './CorporateManagement.css';

const CorporateManagement: React.FC = () => {
  // Department state
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [newDepartmentName, setNewDepartmentName] = useState<string>('');
  const [newDepartment, setNewDepartment] = useState<string>('');
  const [showRenameModal, setShowRenameModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Employee state
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Shared state
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch departments
        const departmentsData = await fetchDepartments();
        setDepartments(departmentsData);

        // Fetch employees
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

  // Department handlers
  const handleRenameClick = (department: Department) => {
    setSelectedDepartment(department);
    setNewDepartmentName(department.description);
    setShowRenameModal(true);
  };

  const handleDeleteClick = (department: Department) => {
    setSelectedDepartment(department);
    setShowDeleteModal(true);
  };

  const handleRenameSubmit = async () => {
    if (!selectedDepartment || !newDepartmentName.trim()) return;

    try {
      await renameDepartment(selectedDepartment.id, newDepartmentName);
      setDepartments(departments.map(dept =>
        dept.id === selectedDepartment.id
          ? { ...dept, description: newDepartmentName }
          : dept
      ));
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
      setDepartments(departments.filter(dept => dept.id !== selectedDepartment.id));
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

  if (loading) {
    return <div className="loading">Cargando datos corporativos...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="corporate-management">
      <h1>Gestión corporativa</h1>

      {/* Employees Section */}
      <section className="employees-section">
        <h2>Plantilla</h2>
        <EmployeeTable employees={employees} />
      </section>

      {/* Departments Section */}
      <section className="departments-section">
        <h2>Departamentos</h2>
        <DepartmentTable
          departments={departments}
          onRename={handleRenameClick}
          onDelete={handleDeleteClick}
        />

        <div className="add-department-button-container">
          <button
            className="add-department-button"
            onClick={() => setShowAddModal(true)}
          >
            <span className="material-icon"/>
            Añadir departamento
          </button>
        </div>
      </section>

      {/* Rename Modal */}
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
              <button
                className="cancel-button"
                onClick={() => setShowRenameModal(false)}
              >
                Cancelar
              </button>
              <button
                className="confirm-button"
                onClick={handleRenameSubmit}
              >
                Renombrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedDepartment && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Eliminar departamento</h3>
            <div className="modal-content">
              <p>¿Estás seguro que deseas eliminar el departamento "{selectedDepartment.description}"?</p>
            </div>
            <div className="modal-actions">
              <button
                className="cancel-button"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </button>
              <button
                className="delete-button"
                onClick={handleDeleteSubmit}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Department Modal */}
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
              <button
                className="cancel-button"
                onClick={() => setShowAddModal(false)}
              >
                Cancelar
              </button>
              <button
                className="confirm-button"
                onClick={handleAddDepartment}
              >
                Añadir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CorporateManagement;