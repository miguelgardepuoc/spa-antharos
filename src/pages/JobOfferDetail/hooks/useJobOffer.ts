import { useState, useEffect } from 'react';
import { NavigateFunction } from 'react-router-dom';
import Swal from 'sweetalert2';
import { fetchJobOfferDetail, deleteJobOffer } from '../../../services/jobOfferService';
import { JobOfferDetail } from '../../../types/jobOffer';
import { REMOTE_PERCENTAGE_MAP } from '../../../utils/constants';

export const useJobOffer = (jobOfferId: string, navigate: NavigateFunction) => {
  const [job, setJob] = useState<JobOfferDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    const getJobDetail = async () => {
      if (!jobOfferId) return;

      try {
        setLoading(true);
        const jobData = await fetchJobOfferDetail(jobOfferId);
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
  }, [jobOfferId]);

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
        description: job.jobTitle,
      },
      remotePercentage: getRemotePercentageOption(job.remote),
      minSalary: job.minSalary.toString(),
      maxSalary: job.maxSalary.toString(),
      description: job.description,
      requirements: job.requirement ? job.requirement.split(';').map((req) => req.trim()) : [''],
      isEditMode: true,
    };

    sessionStorage.setItem('editJobOfferData', JSON.stringify(formData));
    navigate('/add-job-offer');
  };

  const handleRemoveJobOffer = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'La oferta de trabajo será eliminada permanentemente. Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed && job) {
        try {
          setIsDeleting(true);

          await deleteJobOffer(job.id);

          Swal.fire({
            title: 'Eliminada',
            text: 'La oferta de trabajo ha sido eliminada correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          }).then(() => {
            navigate('/');
          });
        } catch (error) {
          console.error('Error deleting job offer:', error);

          Swal.fire({
            title: 'Error',
            text:
              error instanceof Error
                ? error.message
                : 'Ha ocurrido un error al eliminar la oferta de trabajo.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        } finally {
          setIsDeleting(false);
        }
      }
    });
  };

  return {
    job,
    loading,
    error,
    isDeleting,
    handleEditJobOffer,
    handleRemoveJobOffer,
  };
};
