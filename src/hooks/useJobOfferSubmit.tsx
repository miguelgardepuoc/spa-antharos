import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { JobOfferForm } from '../types/AddJobOfferForm';
import { createJobOffer } from '../api/jobsApi';
import { REMOTE_PERCENTAGE_MAP } from '../utils/constants';

export interface SubmitState {
  isSubmitting: boolean;
  submitSuccess: boolean | null;
  submitError: string | null;
}

export const useJobOfferSubmit = () => {
  const [submitState, setSubmitState] = useState<SubmitState>({
    isSubmitting: false,
    submitSuccess: null,
    submitError: null
  });
  const navigate = useNavigate();

  const submitJobOffer = async (formData: JobOfferForm) => {
    setSubmitState({
      isSubmitting: true,
      submitSuccess: null,
      submitError: null
    });
    
    try {
      await createJobOffer(formData);
      
      setSubmitState({
        isSubmitting: false,
        submitSuccess: true,
        submitError: null
      });
      
      Swal.fire({
        title: '¡Éxito!',
        text: 'Oferta de trabajo añadida con éxito',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/');
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      
      setSubmitState({
        isSubmitting: false,
        submitSuccess: false,
        submitError: (error as Error).message
      });
      
      Swal.fire({
        title: 'Error',
        text: (error as Error).message || 'Hubo un error al crear la oferta. Por favor, inténtalo de nuevo.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      
      return false;
    }
  };

  return {
    submitState,
    submitJobOffer
  };
};