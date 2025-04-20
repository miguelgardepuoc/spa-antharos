import { FormEvent, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { TextField } from '../../components/common/text-field';
import { Dropdown } from '../../components/common/dropdown';
import { Button } from '../../components/common/button';
import { RequirementsList } from '../../components/forms/requirements';
import { useJobTitles } from '../../hooks/useJobTitles';
import { useForm } from '../../hooks/useForm';
import { useJobOfferSubmit } from '../../hooks/useJobOfferSubmit';
import { JobTitle } from '../../types/jobTitle';
import { FormState } from '../../types/addJobOfferForm';
import { REMOTE_OPTIONS, REMOTE_PERCENTAGE_MAP } from '../../utils/constants';
import './AddJobOfferPage.css';

const initialFormState: FormState = {
  selectedJobTitle: null,
  remotePercentage: '',
  minSalary: '',
  maxSalary: '',
  description: '',
  requirements: ['']
};

interface EditJobOfferData extends FormState {
  jobOfferId: string;
  isEditMode: boolean;
}

export const AddJobOfferPage = () => {
  const navigate = useNavigate();
  const { jobTitles, loading: loadingJobs, error: jobsError } = useJobTitles();
  const { 
    formState, 
    errors, 
    touched, 
    updateFormField, 
    handleBlur, 
    validateForm, 
    handleRequirementChange, 
    addRequirement, 
    removeRequirement, 
    touchAllFields,
    setFormState 
  } = useForm(initialFormState);
  const { submitState, submitJobOffer, updateJobOffer } = useJobOfferSubmit();
  
  const { isSubmitting, submitSuccess, submitError } = submitState;
  
  // Estado adicional para controlar explícitamente el modo de edición
  const [isEditMode, setIsEditMode] = useState(false);
  // Estado para el título del trabajo mostrado en modo edición
  const [jobTitleText, setJobTitleText] = useState('');
  
  useEffect(() => {
    // Check if there's edit data in sessionStorage
    const editDataJson = sessionStorage.getItem('editJobOfferData');
    const editJobId = sessionStorage.getItem('editJobId');
    
    // Actualizar el estado de edición explícitamente
    setIsEditMode(editJobId !== null);
    
    if (editDataJson) {
      try {
        const editData = JSON.parse(editDataJson) as EditJobOfferData;
        
        // Set the form state with edit data
        setFormState({
          selectedJobTitle: editData.selectedJobTitle,
          remotePercentage: editData.remotePercentage,
          minSalary: editData.minSalary,
          maxSalary: editData.maxSalary,
          description: editData.description,
          requirements: editData.requirements
        });
        
        // Establecer explícitamente el texto del título del trabajo
        if (editData.selectedJobTitle) {
          setJobTitleText(editData.selectedJobTitle.description);
        }
        
        // Store the job ID for updating
        sessionStorage.setItem('editJobId', editData.jobOfferId);
        
        document.title = 'Editar oferta de trabajo';
        
        // Clear the edit data from sessionStorage to avoid issues on refresh
        sessionStorage.removeItem('editJobOfferData');
      } catch (error) {
        console.error('Error parsing edit data:', error);
      }
    }
  }, [setFormState]);
  
  // Actualizar el texto del título del trabajo cuando cambia formState.selectedJobTitle
  useEffect(() => {
    if (formState.selectedJobTitle) {
      setJobTitleText(formState.selectedJobTitle.description);
    }
  }, [formState.selectedJobTitle]);

  useEffect(() => {
    // Redirect to job details if form submission was successful
    if (submitSuccess && !isSubmitting) {
      // If we were in edit mode, redirect back to job details
      const editJobId = sessionStorage.getItem('editJobId');
      if (editJobId) {
        // Clear edit data
        sessionStorage.removeItem('editJobId');
        // Redirect after short delay to allow success message to be seen
        setTimeout(() => {
          navigate(`/job-offer/${editJobId}`);
        }, 1500);
      }
    }
  }, [submitSuccess, isSubmitting, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    touchAllFields();
    
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      return;
    }

    const jobOffer = {
      id: isEditMode ? sessionStorage.getItem('editJobId')! : uuidv4(),
      jobTitleId: formState.selectedJobTitle!.id,
      description: formState.description,
      minSalary: Number(formState.minSalary),
      maxSalary: Number(formState.maxSalary),
      remote: REMOTE_PERCENTAGE_MAP[formState.remotePercentage] || 0,
      requirement: formState.requirements.filter(req => req.trim() !== '').join(';')
    };

    
    if (isEditMode) {
      await updateJobOffer(jobOffer);
    } else {
      await submitJobOffer(jobOffer);
    }
  };

  // Renderizar el campo de empleo según si estamos en modo edición o no
  const renderJobTitleField = () => {
    if (isEditMode) {
      // En modo edición, mostrar un campo de texto no editable
      return (
        <div className="form-field">
          <label className="form-label" htmlFor="jobTitle">
            Empleo <span className="required-indicator">*</span>
          </label>
          <input
            type="text"
            id="jobTitle"
            className="form-input readonly-input"
            value={jobTitleText}
            readOnly
            disabled
          />
          {/* Mantener el valor seleccionado en un campo oculto para el envío del formulario */}
          {formState.selectedJobTitle && (
            <input 
              type="hidden" 
              name="jobTitleId" 
              value={formState.selectedJobTitle.id} 
            />
          )}
        </div>
      );
    } else {
      // En modo creación, mostrar el dropdown
      return (
        <Dropdown<JobTitle>
          label="Empleo"
          value={formState.selectedJobTitle?.description || ''}
          options={jobTitles}
          loading={loadingJobs}
          error={jobsError}
          onSelect={(job) => {
            updateFormField('selectedJobTitle', job);
            handleBlur('selectedJobTitle');
          }}
          placeholder="Seleccionar puesto"
          required={true}
          error={touched.selectedJobTitle ? errors.jobTitle : undefined}
          renderOption={(job) => (
            <div className="job-option">
              <div className="job-option-content">
                <span className={formState.selectedJobTitle?.id === job.id ? 'selected' : ''}>
                  {job.description}
                </span>
              </div>
              {formState.selectedJobTitle?.id === job.id && <span className="check-mark">✓</span>}
            </div>
          )}
        />
      );
    }
  };

  return (
    <div className="job-form-container">
      <form onSubmit={handleSubmit} className="job-form" noValidate>
        <h2 className="form-title">
          {isEditMode ? 'Editar oferta de empleo' : 'Publicar nueva oferta de empleo'}
        </h2>
        
        {submitSuccess === true && !isSubmitting && (
          <div className="form-success-message" role="alert">
            {isEditMode 
              ? '¡Oferta de empleo actualizada con éxito!' 
              : '¡Oferta de empleo creada con éxito!'}
          </div>
        )}
        
        {submitSuccess === false && !isSubmitting && (
          <div className="form-error-message" role="alert">
            {submitError || 'Hubo un error al procesar la oferta. Por favor, inténtalo de nuevo.'}
          </div>
        )}
        
        {renderJobTitleField()}

        <Dropdown<string>
          label="Porcentaje de teletrabajo"
          value={formState.remotePercentage}
          options={REMOTE_OPTIONS}
          loading={false}
          onSelect={(option) => {
            updateFormField('remotePercentage', option);
            handleBlur('remotePercentage');
          }}
          placeholder="Seleccionar modalidad"
          required={true}
          error={touched.remotePercentage ? errors.remotePercentage : undefined}
          renderOption={(option) => (
            <div className="remote-option">
              <span className={formState.remotePercentage === option ? 'selected' : ''}>
                {option}
              </span>
              {formState.remotePercentage === option && <span className="check-mark">✓</span>}
            </div>
          )}
        />

        <div className="salary-fields">
          <TextField
            label="Salario mínimo"
            id="minSalary"
            value={formState.minSalary}
            onChange={(e) => updateFormField('minSalary', e.target.value)}
            onBlur={() => handleBlur('minSalary')}
            placeholder="Ej. 30000"
            type="number"
            required={true}
            error={touched.minSalary ? errors.minSalary : undefined}
          />

          <TextField
            label="Salario máximo"
            id="maxSalary"
            value={formState.maxSalary}
            onChange={(e) => updateFormField('maxSalary', e.target.value)}
            onBlur={() => handleBlur('maxSalary')}
            placeholder="Ej. 40000"
            type="number"
            required={true}
            error={touched.maxSalary ? errors.maxSalary : undefined}
          />
        </div>

        <TextField
          label="Descripción"
          id="description"
          value={formState.description}
          onChange={(e) => updateFormField('description', e.target.value)}
          onBlur={() => handleBlur('description')}
          placeholder="Describe las responsabilidades y detalles del puesto..."
          multiline={true}
          rows={6}
          required={true}
          maxLength={1000}
          error={touched.description ? errors.description : undefined}
        />

        <RequirementsList
          requirements={formState.requirements}
          onChange={handleRequirementChange}
          onAdd={addRequirement}
          onRemove={removeRequirement}
          required={true}
          error={touched.requirements ? errors.requirements : undefined}
        />
        
        <div className="form-actions">
          {isEditMode && (
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => {
                // Clear edit data and redirect back to job details
                const editJobId = sessionStorage.getItem('editJobId');
                sessionStorage.removeItem('editJobId');
                navigate(`/job-offer/${editJobId}`);
              }}
            >
              Cancelar
            </Button>
          )}
          
          <Button 
            type="submit" 
            variant="primary" 
            fullWidth={!isEditMode}
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            {isEditMode ? 'Guardar cambios' : 'Publicar oferta'}
          </Button>
        </div>
      </form>
    </div>
  );
};