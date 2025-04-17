import { JobTitle } from '../types/JobTitle';

export const fetchJobTitles = async (): Promise<JobTitle[]> => {
  try {
    const response = await fetch('http://localhost:8080/bff/job-titles');
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching job titles:', error);
    throw error;
  }
};