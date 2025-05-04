import React from 'react';
import { Candidate } from '../../../types/candidate';
import { downloadCv } from '../../../services/candidateService';

interface CandidatesTableProps {
  candidates: Candidate[];
  loading: boolean;
  error: string | null;
  onStatusChange: (candidateId: string, newStatus: string) => Promise<void>;
  updatingCandidateId: string | null;
}

const FINAL_STATUSES = ['HIRED', 'REJECTED'];

const CandidatesTable: React.FC<CandidatesTableProps> = ({
  candidates,
  loading,
  error,
  onStatusChange,
  updatingCandidateId,
}) => {
  if (loading) {
    return <div className="loading-candidates">Cargando candidatos...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (candidates.length === 0) {
    return (
      <div className="candidates-section">
        <h2>Candidatos</h2>
        <p className="no-candidates">
          Todavía no hay candidatos para esta oferta de trabajo
        </p>
      </div>
    );
  }

  return (
    <div className="candidates-section">
      <h2>Candidatos</h2>
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
            {candidates.map((candidate) => {
              const isFinalStatus = FINAL_STATUSES.includes(candidate.status);
              const isUpdating = updatingCandidateId === candidate.id;

              return (
                <tr key={candidate.id}>
                  <td>{candidate.fullName || 'Desconocido'}</td>
                  <td>
                    <select
                      value={candidate.status}
                      onChange={(e) => onStatusChange(candidate.id, e.target.value)}
                      className={`status-select status-${candidate.status.toLowerCase()}`}
                      disabled={isFinalStatus || isUpdating}
                    >
                      <option value="APPLIED">Inscrito</option>
                      <option value="INTERVIEWING">Entrevistando</option>
                      <option value="HIRED">Contratado</option>
                      <option value="REJECTED">Rechazado</option>
                    </select>
                    {isUpdating && <span className="updating-indicator"> ⟳</span>}
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CandidatesTable;