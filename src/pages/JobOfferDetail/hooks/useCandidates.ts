import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
  fetchCandidatesByJobOffer,
  rejectCandidate,
  interviewCandidate,
} from '../../../services/candidateService';
import { hireCandidate } from '../../../services/employeeService';
import { Candidate } from '../../../types/candidate';
import { HireData } from '../../../types/hireCandidateForm';

export const useCandidates = (jobOfferId: string) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingCandidateId, setUpdatingCandidateId] = useState<string | null>(null);
  const [showHirePopup, setShowHirePopup] = useState<boolean>(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (token && jobOfferId) {
      fetchCandidatesData();
    }
  }, [jobOfferId]);

  const fetchCandidatesData = async () => {
    try {
      setLoading(true);
      const data = await fetchCandidatesByJobOffer(jobOfferId);
      setCandidates(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching candidates:', err);
      setError('Unable to load candidates. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (candidateId: string, newStatus: string) => {
    try {
      setUpdatingCandidateId(candidateId);

      const candidate = candidates.find((c) => c.id === candidateId);

      if (!candidate) {
        console.error(`Candidate with ID ${candidateId} not found`);
        return;
      }

      if (newStatus === 'HIRED') {
        setSelectedCandidate(candidate);
        setShowHirePopup(true);
        setUpdatingCandidateId(null);
        return;
      }

      switch (newStatus) {
        case 'REJECTED':
          await rejectCandidate(candidateId);
          break;
        case 'INTERVIEWING':
          await interviewCandidate(candidateId);
          break;
        default:
          console.warn(`Status change to ${newStatus} not implemented`);
          setUpdatingCandidateId(null);
          return;
      }

      setCandidates((prevCandidates) =>
        prevCandidates.map((c) =>
          c.id === candidateId
            ? {
                ...c,
                status: newStatus as 'APPLIED' | 'INTERVIEWING' | 'HIRED' | 'REJECTED',
              }
            : c
        )
      );

      Swal.fire({
        title: 'Estado actualizado',
        text: `El estado del candidato ha sido actualizado a ${
          newStatus === 'REJECTED'
            ? 'Rechazado'
            : newStatus === 'INTERVIEWING'
              ? 'Entrevistando'
              : newStatus
        }`,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error('Error updating candidate status:', error);

      Swal.fire({
        title: 'Error',
        text: 'Ha ocurrido un error al actualizar el estado del candidato.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    } finally {
      setUpdatingCandidateId(null);
    }
  };

  const handleHireConfirm = async (hireData: HireData) => {
    if (!selectedCandidate) return;

    try {
      await hireCandidate(hireData);

      setCandidates((prevCandidates) =>
        prevCandidates.map((candidate) =>
          candidate.id === selectedCandidate.id ? { ...candidate, status: 'HIRED' } : candidate
        )
      );

      setShowHirePopup(false);
      setSelectedCandidate(null);

      Swal.fire({
        title: 'Contratado',
        text: 'El candidato ha sido contratado exitosamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
    } catch (error: any) {
      console.error('Error hiring candidate:', error);

      let errorMessage = '';
      if (error?.response?.status === 400) {
        const errorCode = error?.response?.data?.errors[0].code;

        switch (errorCode) {
          case 'INVALID_DEPARTMENT':
            errorMessage = 'El departamento no es válido. Por favor, revisa la información.';
            break;
          case 'INVALID_DNI':
            errorMessage = 'El DNI ingresado no es válido. Por favor, verifica.';
            break;
          case 'INVALID_HIRING_DATE':
            errorMessage = 'La fecha de contratación no es válida. Por favor, revisa.';
            break;
          case 'INVALID_JOB_TITLE':
            errorMessage = 'El título del trabajo no es válido. Por favor, verifica.';
            break;
          case 'INVALID_NAME':
            errorMessage = 'El nombre ingresado no es válido. Por favor, verifica.';
            break;
          case 'INVALID_SURNAME':
            errorMessage = 'El apellido ingresado no es válido. Por favor, revisa.';
            break;
          case 'INVALID_PHONE_FORMAT':
            errorMessage = 'El formato del teléfono no es válido. Por favor, revisa.';
            break;
          case 'INVALID_SALARY':
            errorMessage = 'El salario ingresado no es válido. Por favor, verifica.';
            break;
          default:
            errorMessage = 'Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.';
            break;
        }
      }

      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    }
  };

  return {
    candidates,
    loading,
    error,
    updatingCandidateId,
    showHirePopup,
    selectedCandidate,
    setShowHirePopup,
    setSelectedCandidate,
    handleStatusChange,
    handleHireConfirm,
  };
};
