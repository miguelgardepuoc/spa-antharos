import React, { useEffect, useState } from 'react';
import { JobOffer } from '../types/JobOffer';
import { fetchJobOffers } from '../api/jobsApi';
import JobCard from './JobCard';
import './JobListings.css';

const JobListings: React.FC = () => {
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getJobs = async () => {
      try {
        setLoading(true);
        const jobsData = await fetchJobOffers();
        setJobs(jobsData);
        setError(null);
      } catch (err) {
        setError('Failed to load job opportunities. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getJobs();
  }, []);

  if (loading) {
    return <div className="loading">Loading job opportunities...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="job-listings-container">
      <div className="header-section">
        <h1>Ofertas de empleo</h1>
        <p className="subtitle">
          Descubre nuevas oportunidades y construye el futuro que siempre has soñado. 
          Únete a una comunidad donde el talento y la pasión se encuentran para crear 
          algo increíble. Encuentra el trabajo perfecto para ti y da el siguiente paso 
          en tu carrera con nosotros. ¡Tu futuro comienza hoy!
        </p>
      </div>
      
      <div className="job-grid">
        {jobs.map((job) => (
          <div key={job.id} className="job-item">
            <JobCard job={job} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobListings;