import { useState, useEffect } from 'react';
import { JobTitle } from '../types/jobTitle';
import { fetchJobTitles } from '../services/jobTitlesService';

export const useJobTitles = () => {
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getJobTitles = async () => {
      try {
        setLoading(true);
        const data = await fetchJobTitles();
        setJobTitles(data);
        setError(null);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    
    getJobTitles();
  }, []);

  return { jobTitles, loading, error };
};