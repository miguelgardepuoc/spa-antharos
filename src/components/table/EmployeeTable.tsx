import React, { useState, useEffect } from 'react';
import { Employee, EmployeeStatus } from '../../types/Employee';
import { fetchEmployees, updateEmployeeStatus } from '../../services/employeeService';
import Table, { Column } from '../common/Table/Table';

const EmployeeTable: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setIsLoading(true);
        const data = await fetchEmployees();
        setEmployees(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los empleados');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadEmployees();
  }, []);

  const handleStatusChange = async (employeeId: string, newStatus: EmployeeStatus) => {
    const success = await updateEmployeeStatus(employeeId, newStatus);
    
    if (success) {
      setEmployees(employees.map(emp => 
        emp.id === employeeId ? { ...emp, status: newStatus } : emp
      ));
    } else {
      setError('Error al actualizar el estado del empleado');
    }
  };

  const columns: Column<Employee>[] = [
    { header: 'Número', key: 'employeeNumber' },
    { header: 'Nombre', key: 'fullName' },
    { 
      header: 'Salario', 
      render: (employee) => `${employee.salary.toLocaleString('es-ES')} €` 
    },
    { header: 'DNI', key: 'dni' },
    { header: 'Puesto', key: 'jobTitle' },
    { 
      header: 'Fecha de alta', 
      render: (employee) => new Date(employee.hiringDate).toLocaleDateString('es-ES')
    },
    { header: 'Departamento', key: 'department' },
    { 
      header: 'Estado',
      render: (employee) => (
        <select
          value={employee.status}
          onChange={(e) => handleStatusChange(employee.id, e.target.value as EmployeeStatus)}
          className={`status-select status-${employee.status.toLowerCase()}`}
        >
          <option value="ACTIVE">Activo</option>
          <option value="INACTIVE">Inactivo</option>
          <option value="SUSPENDED">Suspendido</option>
        </select>
      )
    }
  ];

  return (
    <Table
      columns={columns}
      data={employees}
      keyExtractor={(employee) => employee.id}
      isLoading={isLoading}
      error={error}
      loadingText="Cargando empleados..."
      className="employee-table"
      emptyMessage="No hay empleados disponibles"
    />
  );
};

export default EmployeeTable;