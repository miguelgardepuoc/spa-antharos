import apiClient from './apiClient';
import { Department } from '../types/Department';
import { v4 as uuidv4 } from 'uuid';

export const fetchDepartments = async (): Promise<Department[]> => {
  try {
    const response = await apiClient.get('/departments');
    return response.data;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};

export const renameDepartment = async (id: string, description: string): Promise<void> => {
  try {
    await apiClient.patch(`/departments/${id}/renaming`, { description });
  } catch (error) {
    console.error('Error in renameDepartment:', error);
    throw error;
  }
};

export const deleteDepartment = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/departments/${id}`);
  } catch (error) {
    console.error('Error in deleteDepartment:', error);
    throw error;
  }
};

export const addDepartment = async (description: string): Promise<Department> => {
  try {
    const id = uuidv4();
    const response = await apiClient.post('/departments', { id, description });
    return response.data;
  } catch (error) {
    console.error('Error in addDepartment:', error);
    throw error;
  }
};