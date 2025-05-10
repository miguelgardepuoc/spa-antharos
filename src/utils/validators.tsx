import { FormState } from '../pages/AddJobOffer/types/addJobOfferForm';

export interface FormErrors {
  [key: string]: string;
}

export const validateJobOfferForm = (formState: FormState): FormErrors => {
  const errors: FormErrors = {};
  
  if (!formState.selectedJobTitle) {
    errors.jobTitle = 'El empleo es obligatorio';
  }
  
  if (!formState.remotePercentage) {
    errors.remotePercentage = 'El porcentaje de teletrabajo es obligatorio';
  }
  
  if (!formState.minSalary) {
    errors.minSalary = 'El salario mínimo es obligatorio';
  } else if (isNaN(Number(formState.minSalary)) || Number(formState.minSalary) <= 0) {
    errors.minSalary = 'El salario mínimo debe ser un número positivo';
  }
  
  if (!formState.maxSalary) {
    errors.maxSalary = 'El salario máximo es obligatorio';
  } else if (isNaN(Number(formState.maxSalary)) || Number(formState.maxSalary) <= 0) {
    errors.maxSalary = 'El salario máximo debe ser un número positivo';
  } else if (Number(formState.maxSalary) < Number(formState.minSalary)) {
    errors.maxSalary = 'El salario máximo no puede ser menor que el salario mínimo';
  }
  
  if (!formState.description) {
    errors.description = 'La descripción es obligatoria';
  }
  
  const hasAnyRequirement = formState.requirements.some(req => req.trim() !== '');
  if (!hasAnyRequirement) {
    errors.requirements = 'Al menos un requisito es obligatorio';
  }
  
  return errors;
};