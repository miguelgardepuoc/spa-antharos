import React from 'react';
import { JobOffer } from '../types/JobOffer';
import { useNavigate } from 'react-router-dom';
import './JobCard.css';

interface JobCardProps {
  job: JobOffer;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const navigate = useNavigate();
  
  // Format salary range from numbers to string format (e.g., "70K-80K")
  const formatSalary = (min: number, max: number): string => {
    const formatValue = (value: number): string => {
      if (value >= 1000) {
        return `${Math.floor(value / 1000)}K`;
      }
      return value.toString();
    };
    
    return `${formatValue(min)}-${formatValue(max)}`;
  };

  const handleCardClick = () => {
    navigate(`/job-offer/${job.id}`);
  };

  return (
    <div className="job-card" onClick={handleCardClick}>
      <div className="job-image-container">
        <img src={job.photoUrl} alt={job.jobTitle} className="job-image" loading="lazy" />
      </div>
      <h3 className="job-title">{job.jobTitle}</h3>
      <p className="job-salary">Salario: {formatSalary(job.minSalary, job.maxSalary)}</p>
    </div>
  );
};

export default JobCard;