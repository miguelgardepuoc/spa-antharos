import React from 'react';

interface SubmissionStatus {
  type: 'success' | 'error' | 'warning' | null;
  message: string;
}

interface ApplicationFormProps {
  email: string;
  setEmail: (email: string) => void;
  file: File | null;
  emailError: string;
  fileError: string;
  submitting: boolean;
  status: SubmissionStatus;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({
  email,
  setEmail,
  file,
  emailError,
  fileError,
  submitting,
  status,
  handleFileChange,
  handleSubmit
}) => {
  return (
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
  );
};

export default ApplicationForm;