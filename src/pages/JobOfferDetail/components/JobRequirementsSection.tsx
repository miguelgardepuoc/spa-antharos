import React from 'react';

interface JobRequirementsSectionProps {
  requirements: string;
}

const JobRequirementsSection: React.FC<JobRequirementsSectionProps> = ({ requirements }) => {
  return (
    <div className="job-requirements-section">
      <h2>Requisitos</h2>
      <ul>
        {requirements.split(';').map((req, index) => (
          <li key={index}>{req.trim().charAt(0).toUpperCase() + req.trim().slice(1)}</li>
        ))}
      </ul>
    </div>
  );
};

export default JobRequirementsSection;
