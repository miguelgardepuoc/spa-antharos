import apiClient from './apiClient';
import { Employee, EmployeeStatus  } from '../types/Employee';

export const fetchEmployees = async (): Promise<Employee[]> => {
  try {
    const response = await apiClient.get('/employees');
    return response.data;
  } catch (error) {
    console.error('Error in fetchEmployees:', error);
    throw error;
  }
};

export const updateEmployeeStatus = async (
  employeeId: String, 
  status: EmployeeStatus
): Promise<boolean> => {
  try {
    const response = await fetch(`/api/employees/${employeeId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error updating employee status:', error);
    return false;
  }
};