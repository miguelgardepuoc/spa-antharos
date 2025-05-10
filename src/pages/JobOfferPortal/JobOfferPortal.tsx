import React, { useEffect, useState } from 'react';
import { JobOffer } from '../../types/jobOffer';
import { fetchJobOffers } from '../../services/jobOfferService';
import JobCard from './components/jobcard/JobCard';
import './JobOfferPortal.css';
import { useNavigate } from 'react-router-dom';

const JobOfferPortal: React.FC = () => {
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);

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

  const handleAddJobClick = () => {
    navigate('/add-job-offer');
  };

  if (loading) {
    return <div className="loading">Loading job opportunities...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="job-listings-container">
      <div className="header-section">
        <div className="header-top">
          <h1>Ofertas de empleo</h1>
        </div>
        <p className="subtitle">
          Descubre nuevas oportunidades y construye el futuro que siempre has soñado. Únete a una
          comunidad donde el talento y la pasión se encuentran para crear algo increíble. Encuentra
          el trabajo perfecto para ti y da el siguiente paso en tu carrera con nosotros. ¡Tu futuro
          comienza hoy!
        </p>
      </div>

      <div className="job-grid">
        {jobs.map((job) => (
          <div key={job.id} className="job-item">
            <JobCard job={job} />
          </div>
        ))}
        {isLoggedIn && (
          <button className="add-job-button" onClick={handleAddJobClick}>
            <img
              src="/src/assets/plus-icon.svg"
              alt="Plus icon"
              style={{
                height: '2em',
                width: 'auto',
                marginRight: '0.5em',
                flexShrink: 0,
              }}
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default JobOfferPortal;
