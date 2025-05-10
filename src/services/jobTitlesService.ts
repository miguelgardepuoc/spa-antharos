import apiClient from './apiClient';
import { JobTitle } from '../types/jobTitle';

export const fetchJobTitles = async (): Promise<JobTitle[]> => {
  try {
    const response = await apiClient.get('/job-titles');
    return response.data;
  } catch (error) {
    console.error('Error fetching job titles:', error);
    throw error;
  }
};
