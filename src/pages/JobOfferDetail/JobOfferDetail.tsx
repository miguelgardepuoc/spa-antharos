import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJobOffer } from './hooks/useJobOffer';
import { useCandidates } from './hooks/useCandidates';
import { useJobApplication } from './hooks/useJobApplication';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import JobDetailsSection from './components/JobDetailsSection';
import JobRequirementsSection from './components/JobRequirementsSection';
import ApplicationForm from './components/ApplicationForm';
import JobActions from './components/JobActions';
import CandidatesTable from './components/CandidatesTable';
import HireCandidatePopup from './components/hirecandidatepopup/HireCandidatePopup';
import useUserRole from "../../hooks/useUserRole";
import './JobOfferDetail.css';

const JobDetail: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem('authToken'));
  const { userRole } = useUserRole();
  const isEmployee = userRole == 'ROLE_EMPLOYEE';

  const {
    job,
    loading: loadingJob,
    error: jobError,
    handleEditJobOffer,
    handleRemoveJobOffer,
    isDeleting,
  } = useJobOffer(id, navigate);

  const {
    candidates,
    loading: loadingCandidates,
    error: candidatesError,
    handleStatusChange,
    updatingCandidateId,
    handleHireConfirm,
    selectedCandidate,
    showHirePopup,
    setShowHirePopup,
    setSelectedCandidate,
  } = useCandidates(id);

  const {
    email,
    setEmail,
    file,
    emailError,
    fileError,
    submitting,
    status,
    handleFileChange,
    handleSubmit,
  } = useJobApplication(id);

  if (loadingJob) {
    return <LoadingSpinner />;
  }

  if (jobError || !job) {
    return <ErrorMessage message={jobError || 'Job not found'} />;
  }

  return (
    <div className="job-detail-container">
      <div className="job-detail-content">
        <div className="job-info">
          <JobDetailsSection job={job} />
          <JobRequirementsSection requirements={job.requirement} />

          {!isLoggedIn && (
            <ApplicationForm
              email={email}
              setEmail={setEmail}
              file={file}
              emailError={emailError}
              fileError={fileError}
              submitting={submitting}
              status={status}
              handleFileChange={handleFileChange}
              handleSubmit={handleSubmit}
            />
          )}
        </div>

        <div className="job-image">
          <img src={job.photoUrl} alt={job.jobTitle} />

          {isLoggedIn && !isEmployee && (
            <JobActions
              onEdit={handleEditJobOffer}
              onRemove={handleRemoveJobOffer}
              isDeleting={isDeleting}
            />
          )}
        </div>
      </div>

      {isLoggedIn && !isEmployee && (
        <CandidatesTable
          candidates={candidates}
          loading={loadingCandidates}
          error={candidatesError}
          onStatusChange={handleStatusChange}
          updatingCandidateId={updatingCandidateId}
        />
      )}

      {showHirePopup && selectedCandidate && (
        <HireCandidatePopup
          isOpen={showHirePopup}
          onClose={() => {
            setShowHirePopup(false);
            setSelectedCandidate(null);
          }}
          onConfirm={handleHireConfirm}
          candidateId={selectedCandidate.id}
          candidateName={selectedCandidate.fullName || ''}
        />
      )}
    </div>
  );
};

export default JobDetail;
