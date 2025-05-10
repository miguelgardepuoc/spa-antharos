import React from 'react';
import { JobOfferDetail } from '../../../types/jobOffer';

interface JobDetailsSectionProps {
  job: JobOfferDetail;
}

const JobDetailsSection: React.FC<JobDetailsSectionProps> = ({ job }) => {
  const formatSalary = (min: number, max: number): string => {
    const formatValue = (value: number): string => {
      if (value >= 1000) {
        return `${Math.floor(value / 1000)}K`;
      }
      return value.toString();
    };

    return `${formatValue(min)} - ${formatValue(max)} €`;
  };

  return (
    <div className="job-title-section">
      <h1>{job.jobTitle}</h1>
      <div className="job-meta">
        <div className="salary-info">
          <span className="meta-label">Salario:</span> {formatSalary(job.minSalary, job.maxSalary)}
        </div>
        <div className="remote-info">
          <span className="meta-label">Teletrabajo:</span> {job.remote}%
        </div>
      </div>

      <div className="job-description-section">
        <h2>Descripción</h2>
        <p>{job.description}</p>
      </div>
    </div>
  );
};

export default JobDetailsSection;
