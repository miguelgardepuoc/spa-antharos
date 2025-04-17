import { FormEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { TextField } from '../../components/common/TextField';
import { Dropdown } from '../../components/common/Dropdown';
import { Button } from '../../components/common/Button';
import { RequirementsList } from '../../components/forms/requirements';
import { useJobTitles } from '../../hooks/useJobTitles';
import { useForm } from '../../hooks/useForm';
import { useJobOfferSubmit } from '../../hooks/useJobOfferSubmit';
import { JobTitle } from '../../types/JobTitle';
import { FormState } from '../../types/AddJobOfferForm';
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

export const AddJobOfferPage = () => {
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
    touchAllFields 
  } = useForm(initialFormState);
  const { submitState, submitJobOffer } = useJobOfferSubmit();
  
  const { isSubmitting, submitSuccess, submitError } = submitState;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    touchAllFields();
    
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      return;
    }
    
    const jobOffer = {
      id: uuidv4(),
      jobTitleId: formState.selectedJobTitle!.id,
      description: formState.description,
      minSalary: Number(formState.minSalary),
      maxSalary: Number(formState.maxSalary),
      remote: REMOTE_PERCENTAGE_MAP[formState.remotePercentage] || 0,
      requirement: formState.requirements.filter(req => req.trim() !== '').join(';')
    };
    
    await submitJobOffer(jobOffer);
  };

  return (
    <div className="job-form-container">
      <form onSubmit={handleSubmit} className="job-form" noValidate>
        <h2 className="form-title">Publicar nueva oferta de empleo</h2>
        
        {submitSuccess === true && !isSubmitting && (
          <div className="form-success-message" role="alert">
            ¡Oferta de empleo creada con éxito!
          </div>
        )}
        
        {submitSuccess === false && !isSubmitting && (
          <div className="form-error-message" role="alert">
            {submitError || 'Hubo un error al crear la oferta. Por favor, inténtalo de nuevo.'}
          </div>
        )}
        
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
        
        <Button 
          type="submit" 
          variant="primary" 
          fullWidth 
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Publicar oferta
        </Button>
      </form>
    </div>
  );
};