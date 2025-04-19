import React, { useEffect, useState } from 'react';
import {fetchDepartments} from '../api/departmentsApi.tsx';
import { Department } from '../types/Department.tsx';
import { HireCandidateData } from '../types/Candidate.tsx';
import './HireCandidatePopup.css';

interface HireCandidatePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (hireData: HireCandidateData) => void;
  candidateName: string;
}

const HireCandidatePopup: React.FC<HireCandidatePopupProps> = ({
  isOpen,
  onClose,
  onConfirm,
  candidateName
}) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<HireCandidateData>({
    dni: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    salary: '',
    departmentId: '',
    startDate: ''
  });
  
  // Fetch departments when the component mounts
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
              <label htmlFor="firstName">Nombre</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Apellidos</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phoneNumber">Número de teléfono</label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
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
              <label htmlFor="startDate">Fecha de inicio</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
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