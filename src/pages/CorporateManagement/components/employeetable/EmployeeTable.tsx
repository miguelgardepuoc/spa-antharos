import React, { useState, useEffect } from 'react';
import { Employee, EmployeeStatus } from '../../../../types/employee';
import { fetchEmployees, markEmployeeAsInactive, putEmployeeOnLeave, terminateEmployee } from '../../../../services/employeeService';
import Table, { Column } from '../../../../components/common/table/Table';
import { showConfirmationAlert } from '../../../../utils/alerts';
import './EmployeeTable.css';

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
    var success = false;

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
        return;
      default:
        return;
    }

    if (success) {
      setEmployees(prevEmployees =>
        prevEmployees.map(emp =>
          emp.id === employeeId ? { ...emp, status: newStatus } : emp
        )
      );
    }
  };

  const columns: Column<Employee>[] = [
    { header: 'Número', key: 'employeeNumber' },
    { header: 'Username', key: 'username' },
    { header: 'Nombre', key: 'fullName' },
    {
      header: 'Salario',
      render: (employee) => `${employee.salary.toLocaleString('es-ES')}€`
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
          <option value="ON_LEAVE">De baja</option>
          <option value="TERMINATED">Despedido</option>
          <option value="INACTIVE">Inactivo</option>
        </select>
      )
    }
  ];

  return (
    <div className="table-container">
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
    </div>
  );
};

export default EmployeeTable;