import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchJobOfferDetail } from '../api/jobsApi';
import { JobOfferDetail } from '../types/JobOffer';
import { v4 as uuidv4 } from 'uuid';
import './JobDetail.css';

interface SubmissionStatus {
  type: 'success' | 'error' | 'warning' | null;
  message: string;
}

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<JobOfferDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [emailError, setEmailError] = useState<string>('');
  const [fileError, setFileError] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [status, setStatus] = useState<SubmissionStatus>({ type: null, message: '' });

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

  const validateEmail = (email: string): boolean => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const validateFile = (file: File | null): boolean => {
    if (!file) return false;
    return file.type === 'application/pdf';
  };

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
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      if (selectedFile.type !== 'application/pdf') {
        setFileError('Por favor, adjunta un archivo PDF');
      } else {
        setFileError('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setEmailError('');
    setFileError('');
    
    // Validate email
    if (!validateEmail(email)) {
      setEmailError('Por favor, introduce un email válido');
      return;
    }
    
    // Validate file
    if (!validateFile(file)) {
      setFileError('Por favor, adjunta un archivo PDF');
      return;
    }
    
    if (!id) {
      setStatus({
        type: 'error',
        message: 'Oferta de trabajo no encontrada'
      });
      return;
    }
    
    try {
      setSubmitting(true);
      setStatus({ type: null, message: '' });
      
      // Create form data for submission
      const formData = new FormData();
      formData.append('id', uuidv4());
      formData.append('personalEmail', email);
      formData.append('jobOfferId', id);
      if (file) {
        formData.append('cv', file);
      }
      
      // Submit the data
      const response = await fetch('http://localhost:8080/bff/candidates', {
        method: 'POST',
        body: formData,
      });
      
      // Handle response based on status code
      if (response.status === 201) {
        setStatus({
          type: 'success',
          message: '¡Enhorabuena! Te has inscrito correctamente a esta oferta.'
        });
        // Reset form
        setEmail('');
        setFile(null);
      } else if (response.status === 409) {
        setStatus({
          type: 'warning',
          message: 'Ya estás inscrito en esta oferta de trabajo.'
        });
      } else {
        setStatus({
          type: 'error',
          message: 'Ha ocurrido un error. Por favor, inténtalo más tarde.'
        });
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setStatus({
        type: 'error',
        message: 'Ha ocurrido un error. Por favor, inténtalo más tarde.'
      });
    } finally {
      setSubmitting(false);
    }
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
              {job.requirement.split(';').map((req, index) => (
                <li key={index}>
                {req.trim().charAt(0).toUpperCase() + req.trim().slice(1) + '.'}
              </li>
              ))}
            </ul>
          </div>

          <div className="contact-section">
          <h2 className="text-xl font-semibold">Contacto</h2>
            
            {status.type && (
              <div className={`status-message ${status.type}`}>
                {status.message}
              </div>
            )}
            
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
                  className={emailError ? 'error-input' : ''}
                />
                {emailError && <div className="input-error">{emailError}</div>}
              </div>
              
              <div className="form-group">
                <label>Adjunta tu CV</label>
                <div className="file-upload">
                  <label htmlFor="file-upload" className={`file-upload-label ${fileError ? 'error-input' : ''}`}>
                    {file ? file.name : 'Seleccionar archivo PDF'}
                    <span className="upload-icon">📎</span>
                  </label>
                  <input 
                    type="file" 
                    id="file-upload" 
                    onChange={handleFileChange}
                    accept=".pdf"
                    hidden
                  />
                </div>
                {fileError && <div className="input-error">{fileError}</div>}
              </div>
              
              <button 
                type="submit" 
                className="submit-button" 
                disabled={submitting}
              >
                {submitting ? 'Enviando...' : 'Inscribirme'}
              </button>
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