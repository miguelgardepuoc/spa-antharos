import React, { useState, useEffect } from 'react';
import { Employee, EmployeeStatus } from '../../../types/employee';
import {
  fetchEmployees,
  markEmployeeAsInactive,
  putEmployeeOnLeave,
  terminateEmployee,
} from '../../../services/employeeService';
import { showConfirmationAlert } from '../../../utils/alerts';
import Table from '../../../components/common/table/Table';

const FINAL_STATUSES = ['INACTIVE', 'TERMINATED'];

const EmployeeTable: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingEmployeeId, setUpdatingEmployeeId] = useState<string | null>(null);

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
    setUpdatingEmployeeId(employeeId);
    let success = false;

    try {
      switch (newStatus) {
        case 'ON_LEAVE':
          const leaveResult = await showConfirmationAlert({
            title: '¿Dar de baja al empleado?',
            text: 'Puede ser por enfermedad, maternidad, etc',
            icon: 'question',
          });
          if (leaveResult.isConfirmed) {
            await putEmployeeOnLeave(employeeId);
            success = true;
          }
          break;
        case 'TERMINATED':
          const terminateResult = await showConfirmationAlert({
            title: '¿Despedir al empleado?',
            icon: 'question',
          });
          if (terminateResult.isConfirmed) {
            await terminateEmployee(employeeId);
            success = true;
          }
          break;
        case 'INACTIVE':
          const inactiveResult = await showConfirmationAlert({
            title: '¿Se trata de un ex-empleado?',
            text: 'El empleado ya no tiene vinculación laboral, pero sin despido formal',
            icon: 'question',
          });
          if (inactiveResult.isConfirmed) {
            await markEmployeeAsInactive(employeeId);
            success = true;
          }
          break;
        default:
          break;
      }

      if (success) {
        setEmployees((prevEmployees) =>
          prevEmployees.map((emp) => (emp.id === employeeId ? { ...emp, status: newStatus } : emp))
        );
      }
    } finally {
      setUpdatingEmployeeId(null);
    }
  };

  const headers = [
    'Número',
    'Username',
    'Nombre',
    'Salario',
    'DNI',
    'Puesto',
    'Alta',
    'Departamento',
    'Estado',
  ];

  const renderEmployeeRow = (employee: Employee) => {
    const isFinalStatus = FINAL_STATUSES.includes(employee.status);
    const isUpdating = updatingEmployeeId === employee.id;

    return (
      <tr key={employee.id}>
        <td>{employee.employeeNumber}</td>
        <td>{employee.username}</td>
        <td>{employee.fullName}</td>
        <td>{`${employee.salary.toLocaleString('es-ES')}€`}</td>
        <td>{employee.dni}</td>
        <td>{employee.jobTitle}</td>
        <td>{new Date(employee.hiringDate).toLocaleDateString('es-ES')}</td>
        <td>{employee.department}</td>
        <td>
          <select
            value={employee.status}
            onChange={(e) => handleStatusChange(employee.id, e.target.value as EmployeeStatus)}
            className={`status-select status-${employee.status.toLowerCase()}`}
            disabled={isFinalStatus || isUpdating}
          >
            <option value="ACTIVE">Activo</option>
            <option value="ON_LEAVE">De baja</option>
            <option value="TERMINATED">Despedido</option>
            <option value="INACTIVE">Inactivo</option>
          </select>
          {isUpdating && <span className="updating-indicator"> ⟳</span>}
        </td>
      </tr>
    );
  };

  return (
    <Table
      headers={headers}
      data={employees}
      renderRow={renderEmployeeRow}
      isLoading={isLoading}
      error={error}
      emptyMessage={<p className="no-employees">No hay empleados disponibles</p>}
      loadingMessage="Cargando empleados..."
    />
  );
};

export default EmployeeTable;
