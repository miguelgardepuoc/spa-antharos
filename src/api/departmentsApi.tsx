import { Department } from '../types/Department';

export const fetchDepartments = async (): Promise<Department[]> => {
  try {
    const response = await fetch('http://localhost:8080/bff/departments', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }    
    return await response.json();
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};