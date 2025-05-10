import React, { useEffect, useState } from 'react';
import {fetchDepartments} from '../../../../services/departmentService.ts';
import { Department } from '../../../../types/department.ts';
import { HireData } from '../../../../types/hireCandidateForm.ts';
import { v4 as uuidv4 } from 'uuid';
import './HireCandidatePopup.css';

interface HireCandidatePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (hireData: HireData) => void;
  candidateId: string;
  candidateName: string;  
}

const HireCandidatePopup: React.FC<HireCandidatePopupProps> = ({
  isOpen,
  onClose,
  onConfirm,
  candidateId,
  candidateName
}) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  function splitFullName(fullName: string): { name: string; surname: string } {
    const parts = fullName.trim().split(/\s+/);
    const name = parts[0] || '';
    const surname = parts.slice(1).join(' ') || '';
    return { name, surname };
  }
  
  const { name, surname } = splitFullName(candidateName);
  
  const [formData, setFormData] = useState<HireData>({
    id: uuidv4(),
    dni: '',
    name,
    surname,
    telephoneNumber: '',
    salary: '',
    departmentId: '',
    hiringDate: '',
    jobTitleId: '',
    candidateId: candidateId
  });
  
  useEffect(() => {
    const getDepartments = async () => {
      if (!isOpen) return;      
      try {
        setLoading(true);
        const data = await fetchDepartments();
        setDepartments(data);
        setError(null);
      } catch (err) {
        setError('Failed to load departments. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    getDepartments();
  }, [isOpen]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(formData);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h2>Contratar candidato</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="popup-content">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="dni">DNI</label>
              <input
                type="text"
                id="dni"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="surname">Apellidos</label>
              <input
                type="text"
                id="surname"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="telephoneNumber">Número de teléfono</label>
              <input
                type="text"
                id="telephoneNumber"
                name="telephoneNumber"
                value={formData.telephoneNumber}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="salary">Salario</label>
              <input
                type="text"
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="departmentId">Departamento</label>
              {loading ? (
                <div className="loading-departments">Cargando departamentos...</div>
              ) : error ? (
                <div className="error">{error}</div>
              ) : (
                <select
                  id="departmentId"
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar departamento</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>
                      {dept.description}
                    </option>
                  ))}
                </select>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="hiringDate">Fecha de inicio</label>
              <input
                type="date"
                id="hiringDate"
                name="hiringDate"
                value={formData.hiringDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="hire-button">
                Contratar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HireCandidatePopup;