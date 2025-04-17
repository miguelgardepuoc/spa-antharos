import { useState, useCallback, useEffect } from 'react';
import { FormState, FormErrors } from '../types/AddJobOfferForm';
import { validateJobOfferForm } from '../utils/validators';

export interface UseFormResult {
  formState: FormState;
  errors: FormErrors;
  touched: Record<string, boolean>;
  updateFormField: (field: keyof FormState, value: any) => void;
  handleBlur: (field: keyof FormState) => void;
  validateForm: () => FormErrors;
  handleRequirementChange: (index: number, value: string) => void;
  addRequirement: () => void;
  removeRequirement: (index: number) => void;
  touchAllFields: () => void;
  resetForm: () => void;
}

export const useForm = (initialState: FormState): UseFormResult => {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateForm = useCallback(() => {
    return validateJobOfferForm(formState);
  }, [formState]);

  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      const validationErrors = validateForm();
      setErrors(validationErrors);
    }
  }, [formState, touched, validateForm]);

  const updateFormField = (field: keyof FormState, value: any) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: keyof FormState) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...formState.requirements];
    newRequirements[index] = value;
    updateFormField('requirements', newRequirements);
    
    setTouched(prev => ({ ...prev, requirements: true }));
  };

  const addRequirement = () => {
    updateFormField('requirements', [...formState.requirements, '']);
  };

  const removeRequirement = (index: number) => {
    if (formState.requirements.length <= 1) return;
    
    const newRequirements = [...formState.requirements];
    newRequirements.splice(index, 1);
    updateFormField('requirements', newRequirements);
  };

  const touchAllFields = () => {
    const allTouched = Object.keys(formState).reduce((acc, key) => {
      return { ...acc, [key]: true };
    }, {});
    setTouched(allTouched);
  };

  const resetForm = () => {
    setFormState(initialState);
    setErrors({});
    setTouched({});
  };

  return {
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
    resetForm
  };
};