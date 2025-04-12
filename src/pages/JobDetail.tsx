import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchJobOfferDetail } from '../api/jobsApi';
import { JobOfferDetail } from '../types/JobOffer';
import './JobDetail.css';

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<JobOfferDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const getJobDetail = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const jobData = await fetchJobOfferDetail(id);
        setJob(jobData);
        setError(null);
      } catch (err) {
        setError('Failed to load job details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getJobDetail();
  }, [id]);

  const formatSalary = (min: number, max: number): string => {
    const formatValue = (value: number): string => {
      if (value >= 1000) {
        return `${Math.floor(value / 1000)}K`;
      }
      return value.toString();
    };
    
    return `${formatValue(min)}-${formatValue(max)}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send the application data to your backend
    console.log('Submitting application:', { email, file, jobId: id });
    
    // Demo alert for now
    alert('¡Solicitud enviada con éxito!');
  };

  if (loading) {
    return <div className="loading">Loading job details...</div>;
  }

  if (error || !job) {
    return <div className="error">{error || 'Job not found'}</div>;
  }

  return (
    <div className="job-detail-container">

      <div className="job-detail-content">
        <div className="job-info">
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
          </div>

          <div className="job-description-section">
            <h2>Descripción</h2>
            <p>{job.description}</p>
          </div>

          <div className="job-requirements-section">
            <h2>Requisitos</h2>
            <ul>
              {job.requirement.split(',').map((req, index) => (
                <li key={index}>{req.trim()}</li>
              ))}
            </ul>
          </div>

          <div className="contact-section">
            <h2>Contact me</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="email@example.net" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Adjunta tu CV</label>
                <div className="file-upload">
                  <label htmlFor="file-upload" className="file-upload-label">
                    {file ? file.name : 'Seleccionar archivo'}
                    <span className="upload-icon">📎</span>
                  </label>
                  <input 
                    type="file" 
                    id="file-upload" 
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    hidden
                  />
                </div>
              </div>
              
              <button type="submit" className="submit-button">Inscribirme</button>
            </form>
          </div>
        </div>

        <div className="job-image">
          <img src={job.photoUrl} alt={job.jobTitle} />
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
