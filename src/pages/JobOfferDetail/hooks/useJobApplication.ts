import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { addCandidate } from '../../../services/candidateService';

interface SubmissionStatus {
  type: 'success' | 'error' | 'warning' | null;
  message: string;
}

export const useJobApplication = (jobOfferId: string) => {
  const [email, setEmail] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [emailError, setEmailError] = useState<string>('');
  const [fileError, setFileError] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [status, setStatus] = useState<SubmissionStatus>({ type: null, message: '' });

  const validateEmail = (email: string): boolean => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const validateFile = (file: File | null): boolean => {
    if (!file) return false;
    return file.type === 'application/pdf';
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
    
    if (!jobOfferId) {
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
        jobOfferId: jobOfferId
      };
      
      await addCandidate(candidateData);
  
      setStatus({
        type: 'success',
        message: 'Enhorabuena! Te has inscrito correctamente en esta oferta de trabajo.'
      });
      
      // Reset form
      setEmail('');
      setFile(null);
      
    } catch (error: any) {
      console.error('Error submitting application:', error);
  
      if (error?.response?.status === 409) {
        setStatus({
          type: 'warning',
          message: 'Ya existe una inscripción para este email'
        });
      } else {
        setStatus({
          type: 'error',
          message: 'Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.'
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return {
    email,
    setEmail,
    file,
    emailError,
    fileError,
    submitting,
    status,
    handleFileChange,
    handleSubmit
  };
};