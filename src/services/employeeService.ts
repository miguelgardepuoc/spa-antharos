import apiClient from './apiClient';
import { Employee  } from '../types/employee';
import { HireData } from '../types/hireCandidateForm';

export const fetchEmployees = async (): Promise<Employee[]> => {
  try {
    const response = await apiClient.get('/employees');
    return response.data;
  } catch (error) {
    console.error('Error in fetchEmployees:', error);
    throw error;
  }
};

export const putEmployeeOnLeave = async (id: string): Promise<void> => {
  try {
    await apiClient.patch(`/employees/${id}/on-leave`);
  } catch (error) {
    console.error(`Error changing employee ${id} status to on leave:`, error);
    throw error;
  }
};

export const terminateEmployee = async (id: string): Promise<void> => {
  try {
    await apiClient.patch(`/employees/${id}/termination`);
  } catch (error) {
    console.error(`Error terminating employee ${id}:`, error);
    throw error;
  }
};

export const markEmployeeAsInactive = async (id: string): Promise<void> => {
  try {
    await apiClient.patch(`/employees/${id}/inactivation`);
  } catch (error) {
    console.error(`Error marking employee ${id} as inactive:`, error);
    throw error;
  }
};

export const hireCandidate = async (hireData: HireData): Promise<void> => {
  try {
    await apiClient.post('/employees/hiring', hireData);
  } catch (error) {
    console.error('Error hiring candidate:', error);
    throw error;
  }
};