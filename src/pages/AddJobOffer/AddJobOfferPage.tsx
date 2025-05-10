import { FormEvent, useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { TextField } from '../../components/common/TextField';
import { Dropdown } from '../../components/common/Dropdown';
import { Button } from '../../components/common/Button';
import { RequirementsList } from './components/RequirementsList';
import { useJobTitles } from '../../hooks/useJobTitles';
import { useForm } from '../../hooks/useForm';
import { useJobOfferSubmit } from './hooks/useJobOfferSubmit';
import { JobTitle } from '../../types/jobTitle';
import { FormState } from './types/addJobOfferForm';
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

interface JobOfferRouteState extends FormState {
  jobOfferId?: string;
}

export const AddJobOfferPage = () => {
  const { id: jobOfferId } = useParams();
  const location = useLocation();
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

  const [isEditMode, setIsEditMode] = useState(false);
  const [jobTitleText, setJobTitleText] = useState('');

  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;
  
    const editJobOfferData = sessionStorage.getItem('editJobOfferData');
    const editData = editJobOfferData
      ? JSON.parse(editJobOfferData)
      : (location.state as JobOfferRouteState | undefined);
  
    if (editData) {
      setIsEditMode(true);
      setFormState({        
        selectedJobTitle: editData.selectedJobTitle,
        remotePercentage: editData.remotePercentage,
        minSalary: editData.minSalary,
        maxSalary: editData.maxSalary,
        description: editData.description,
        requirements: editData.requirements
      });
  
      if (editData.selectedJobTitle) {
        setJobTitleText(editData.selectedJobTitle.description);
      }
  
      sessionStorage.setItem('editJobId', editData.jobOfferId);
      sessionStorage.removeItem('editJobOfferData');
      document.title = 'Editar oferta de trabajo';
    } else {
      document.title = 'Publicar nueva oferta de trabajo';
    }
  }, []);

  useEffect(() => {
    if (formState.selectedJobTitle) {
      setJobTitleText(formState.selectedJobTitle.description);
    }
  }, [formState.selectedJobTitle]);

  useEffect(() => {
    if (submitSuccess && !isSubmitting) {
      const editJobId = sessionStorage.getItem('editJobId');
      if (editJobId) {
        sessionStorage.removeItem('editJobId');
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

    if (Object.keys(formErrors).length > 0) return;
    const id = isEditMode 
    ? sessionStorage.getItem('editJobId') ?? jobOfferId ?? uuidv4() 
    : uuidv4();
    const jobOffer = {
      id,
      jobTitleId: formState.selectedJobTitle!.id,
      description: formState.description,
      minSalary: Number(formState.minSalary),
      maxSalary: Number(formState.maxSalary),
      remote: REMOTE_PERCENTAGE_MAP[formState.remotePercentage] || 0,
      requirement: (formState.requirements as string[])
      .filter((req: string) => req.trim() !== '')
      .join(';')
    };

    if (isEditMode) {
      await updateJobOffer(jobOffer);
    } else {
      await submitJobOffer(jobOffer);
    }
  };

  const renderJobTitleField = () => {
    if (isEditMode) {
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
          {formState.selectedJobTitle && (
            <input type="hidden" name="jobTitleId" value={formState.selectedJobTitle.id} />
          )}
        </div>
      );
    }

    return (
      <Dropdown<JobTitle>
        label="Empleo (sólo aquellos para los que todavía no existe oferta)"
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
        errorMessage={touched.selectedJobTitle ? errors.jobTitle : undefined}
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
          errorMessage={touched.remotePercentage ? errors.remotePercentage : undefined}
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

export default AddJobOfferPage;