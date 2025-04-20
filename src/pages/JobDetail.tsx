import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchJobOfferDetail, deleteJobOffer } from '../services/jobOfferService';
import { fetchCandidatesByJobOffer, downloadCv, rejectCandidate, interviewCandidate, addCandidate } from '../services/candidateService';
import { JobOfferDetail } from '../types/JobOffer';
import { Candidate } from '../types/Candidate';
import { REMOTE_OPTIONS, REMOTE_PERCENTAGE_MAP } from '../utils/constants';
import Swal from 'sweetalert2';
import './JobDetail.css';
import HireCandidatePopup from '../components/HireCandidatePopup';

// Types
interface SubmissionStatus {
  type: 'success' | 'error' | 'warning' | null;
  message: string;
}

interface HireData {
  dni: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  salary: string;
  departmentId: string;
  startDate: string;
}

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<JobOfferDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [emailError, setEmailError] = useState<string>('');
  const [fileError, setFileError] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [status, setStatus] = useState<SubmissionStatus>({ type: null, message: '' });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState<boolean>(false);
  const [candidatesError, setCandidatesError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [showHirePopup, setShowHirePopup] = useState<boolean>(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [updatingCandidateId, setUpdatingCandidateId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);

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
    
    // If user is logged in, also load candidates
    if (!!token && id) {
      fetchCandidates(id);
    }
  }, [id]);

  const fetchCandidates = async (jobOfferId: string) => {
    try {
      setLoadingCandidates(true);
      setCandidates(await fetchCandidatesByJobOffer(jobOfferId));
      setCandidatesError(null);
    } catch (err) {
      console.error('Error fetching candidates:', err);
      setCandidatesError('Unable to load candidates. Please try again later.');
    } finally {
      setLoadingCandidates(false);
    }
  };

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
    
    return `${formatValue(min)} - ${formatValue(max)} €`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      if (selectedFile.type !== 'application/pdf') {
        setFileError('Please attach a PDF file');
      } else {
        setFileError('');
      }
    }
  };

  const getRemotePercentageOption = (remotePercentage: number): string => {
    const optionEntry = Object.entries(REMOTE_PERCENTAGE_MAP).find(
      ([_, value]) => value === remotePercentage
    );
    
    return optionEntry ? optionEntry[0] : '';
  };

  const handleEditJobOffer = () => {
    if (!job) return;
    
    const formData = {
      jobOfferId: job.id,      
      selectedJobTitle: {
        description: job.jobTitle
      },
      remotePercentage: getRemotePercentageOption(job.remote),
      minSalary: job.minSalary.toString(),
      maxSalary: job.maxSalary.toString(),
      description: job.description,
      requirements: job.requirement ? job.requirement.split(';').map(req => req.trim()) : [''],
      isEditMode: true
    };
    
    sessionStorage.setItem('editJobOfferData', JSON.stringify(formData));
    
    navigate('/add-job-offer');
  };

  const handleRemoveJobOffer = () => {
    // Show confirmation modal
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'La oferta de trabajo será eliminada permanentemente. Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed && job) {
        try {
          setIsDeleting(true);
          
          // Call API to delete job offer
          await deleteJobOffer(job.id);
          
          // Show success message
          Swal.fire({
            title: 'Eliminada',
            text: 'La oferta de trabajo ha sido eliminada correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            // Navigate back to home page
            navigate('/');
          });
        } catch (error) {
          console.error('Error deleting job offer:', error);
          
          // Show error message
          Swal.fire({
            title: 'Error',
            text: error instanceof Error ? error.message : 'Ha ocurrido un error al eliminar la oferta de trabajo.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        } finally {
          setIsDeleting(false);
        }
      }
    });
  };

  const handleStatusChange = async (candidateId: string, newStatus: string) => {
    try {
      // Set updating state for UI feedback
      setUpdatingCandidateId(candidateId);
      
      // Find the candidate we're updating
      const candidate = candidates.find(c => c.id === candidateId);
      
      if (!candidate) {
        console.error(`Candidate with ID ${candidateId} not found`);
        return;
      }

      // If new status is HIRED, open the hire popup
      if (newStatus === 'HIRED') {
        setSelectedCandidate(candidate);
        setShowHirePopup(true);
        setUpdatingCandidateId(null);
        return; // Don't update status yet until hire form is completed
      }
      
      let updatedCandidate;
      
      // Call the appropriate API based on the new status
      switch (newStatus) {
        case 'REJECTED':
          updatedCandidate = await rejectCandidate(candidateId);
          break;
        case 'INTERVIEWING':
          updatedCandidate = await interviewCandidate(candidateId);
          break;
        default:
          console.warn(`Status change to ${newStatus} not implemented`);
          setUpdatingCandidateId(null);
          return;
      }
      
      // Update candidates list with the new status
      setCandidates(prevCandidates => 
        prevCandidates.map(c => 
          c.id === candidateId 
            ? { ...c, status: newStatus as 'APPLIED' | 'INTERVIEWING' | 'HIRED' | 'REJECTED' } 
            : c
        )
      );
      
      // Show success message
      Swal.fire({
        title: 'Estado actualizado',
        text: `El estado del candidato ha sido actualizado a ${
          newStatus === 'REJECTED' ? 'Rechazado' : 
          newStatus === 'INTERVIEWING' ? 'Entrevistando' : 
          newStatus
        }`,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        timer: 2000,
        timerProgressBar: true
      });
      
    } catch (error) {
      console.error('Error updating candidate status:', error);
      
      // Show error message
      Swal.fire({
        title: 'Error',
        text: 'Ha ocurrido un error al actualizar el estado del candidato.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    } finally {
      setUpdatingCandidateId(null);
    }
  };

  const handleHireConfirm = async (hireData: HireData) => {
    if (!selectedCandidate) return;
    
    try {
      // Here you would make an API call to your backend to process the hiring
      console.log('Hiring candidate with data:', hireData);
      
      // Update the candidate status to HIRED in local state
      setCandidates(prevCandidates => 
        prevCandidates.map(candidate => 
          candidate.id === selectedCandidate.id 
            ? { ...candidate, status: 'HIRED' } 
            : candidate
        )
      );
      
      // Close the popup
      setShowHirePopup(false);
      setSelectedCandidate(null);
      
      // Show success message
      Swal.fire({
        title: 'Contratado',
        text: 'El candidato ha sido contratado exitosamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
    } catch (error) {
      console.error('Error hiring candidate:', error);
      
      // Show error message
      Swal.fire({
        title: 'Error',
        text: 'Ha ocurrido un error al contratar al candidato.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setEmailError('');
    setFileError('');
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      return;
    }
    
    if (!validateFile(file)) {
      setFileError('Please attach a PDF file');
      return;
    }
    
    if (!id) {
      setStatus({
        type: 'error',
        message: 'Job offer not found'
      });
      return;
    }
    
    try {
      setSubmitting(true);
      setStatus({ type: null, message: '' });

      const candidateData = {
        personalEmail: email,
        id: uuidv4(),
        cv: file,
        jobOfferId: id
      };
      
      await addCandidate(candidateData);

      setStatus({
        type: 'success',
        message: 'Enhorabuena! Te has inscrito correctamente en esta oferta de trabajo.'
      });
      
      // Reset form
      setEmail('');
      setFile(null);
      
    } catch (error) {
      console.error('Error submitting application:', error);
      setStatus({
        type: 'error',
        message: 'An error occurred. Please try again later.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading-container"><div className="loading-spinner"></div></div>;
  }

  if (error || !job) {
    return <div className="error-container">{error || 'Job not found'}</div>;
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
                  {req.trim().charAt(0).toUpperCase() + req.trim().slice(1)}
                </li>
              ))}
            </ul>
          </div>

          {!isLoggedIn && (
            <div className="contact-section">
              <h2>Inscribirse</h2>
              
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
                    placeholder="tu.email@ejemplo.com" 
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
                      {file ? file.name : 'Select PDF file'}
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
                  {submitting ? 'Inscribiéndose...' : 'Inscribirme'}
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="job-image">
          <img src={job.photoUrl} alt={job.jobTitle} />
          
          {isLoggedIn && (
            <div className="admin-actions">
              <button 
                className="edit-job-offer-button"
                onClick={handleEditJobOffer}
              >
                Editar oferta de trabajo
              </button>
              <button 
                className="remove-job-offer-button"
                onClick={handleRemoveJobOffer}
                disabled={isDeleting}
              >
                {isDeleting ? 'Eliminando...' : 'Retirar oferta de trabajo'}
              </button>
            </div>
          )}
        </div>
      </div>

      {isLoggedIn && (
        <div className="candidates-section">
          <h2>Candidatos</h2>
          {loadingCandidates ? (
            <div className="loading-candidates">Cargando candidatos...</div>
          ) : candidatesError ? (
            <div className="error">{candidatesError}</div>
          ) : candidates.length === 0 ? (
            <p className="no-candidates">Todavía no hay candidatos para esta oferta de trabajo</p>
          ) : (
            <div className="candidates-table-container">
              <table className="candidates-table">
                <thead>
                  <tr>
                    <th>Nombre completo</th>
                    <th>Estado del proceso</th>
                    <th>Email</th>
                    <th>CV</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((candidate) => (
                    <tr key={candidate.id}>
                      <td>{candidate.fullName || 'Desconocido'}</td>
                      <td>
                        <select 
                          value={candidate.status}
                          onChange={(e) => handleStatusChange(candidate.id, e.target.value)}
                          className={`status-select status-${candidate.status.toLowerCase()}`}
                          disabled={updatingCandidateId === candidate.id}
                        >
                          <option value="APPLIED">Inscrito</option>
                          <option value="INTERVIEWING">Entrevistando</option>
                          <option value="HIRED">Contratado</option>
                          <option value="REJECTED">Rechazado</option>
                        </select>
                        {updatingCandidateId === candidate.id && (
                          <span className="updating-indicator"> ⟳</span>
                        )}
                      </td>
                      <td>{candidate.personalEmail}</td>
                      <td>
                        {candidate.cvFilename && (
                          <a
                            href="#"
                            onClick={async (e) => {
                              e.preventDefault();
                              await downloadCv(candidate.cvFilename!);
                            }}
                            className="download-cv"
                            title="Descargar CV"
                          >
                            <span className="download-icon">📄</span>
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
      {/* Hire Candidate Popup */}
      {showHirePopup && selectedCandidate && (
        <HireCandidatePopup
          isOpen={showHirePopup}
          onClose={() => {
            setShowHirePopup(false);
            setSelectedCandidate(null);
          }}
          onConfirm={handleHireConfirm}
          candidateName={selectedCandidate.fullName || 'Candidato'}
        />
      )}
    </div>
  );
};

export default JobDetail;