import React, { useState, useEffect } from 'react';
import { Candidate } from '../../types/Candidate';
import { 
  fetchCandidatesByJobOffer, 
  downloadCv, 
  rejectCandidate, 
  interviewCandidate 
} from '../../services/candidateService';
import Table, { Column } from '../common/Table/Table';
import Swal from 'sweetalert2';

interface CandidatesTableProps {
  jobOfferId: string;
}

const CandidatesTable: React.FC<CandidatesTableProps> = ({ jobOfferId }) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingCandidateId, setUpdatingCandidateId] = useState<string | null>(null);

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCandidatesByJobOffer(jobOfferId);
        setCandidates(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los candidatos');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCandidates();
  }, [jobOfferId]);

  const handleStatusChange = async (candidateId: string, newStatus: string) => {
    try {
      setUpdatingCandidateId(candidateId);
      
      let updatedCandidate;
      
      switch (newStatus) {
        case 'REJECTED':
          updatedCandidate = await rejectCandidate(candidateId);
          break;
        case 'INTERVIEWING':
          updatedCandidate = await interviewCandidate(candidateId);
          break;
        case 'HIRED':
          // Lógica para mostrar el popup de contratación
          Swal.fire({
            title: '¿Contratar candidato?',
            text: 'Esta acción abrirá el formulario de contratación',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Continuar',
            cancelButtonText: 'Cancelar'
          });
          setUpdatingCandidateId(null);
          return;
        default:
          console.warn(`Status change to ${newStatus} not implemented`);
          setUpdatingCandidateId(null);
          return;
      }
      
      setCandidates(prevCandidates => 
        prevCandidates.map(c => 
          c.id === candidateId 
            ? { ...c, status: newStatus as 'APPLIED' | 'INTERVIEWING' | 'HIRED' | 'REJECTED' } 
            : c
        )
      );
      
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

  const columns: Column<Candidate>[] = [
    { header: 'Nombre completo', key: 'fullName' },
    { 
      header: 'Estado del proceso',
      render: (candidate) => (
        <>
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
        </>
      )
    },
    { header: 'Email', key: 'personalEmail' },
    { 
      header: 'CV',
      render: (candidate) => (
        candidate.cvFilename ? (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              downloadCv(candidate.cvFilename!);
            }}
            className="download-cv"
            title="Descargar CV"
          >
            <span className="download-icon">📄</span>
          </a>
        ) : null
      )
    }
  ];

  return (
    <Table
      columns={columns}
      data={candidates}
      keyExtractor={(candidate) => candidate.id}
      isLoading={isLoading}
      error={error}
      loadingText="Cargando candidatos..."
      className="candidates-table"
      emptyMessage="No hay candidatos disponibles para esta oferta"
    />
  );
};

export default CandidatesTable;