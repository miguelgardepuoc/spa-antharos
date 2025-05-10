import { JobTitle } from '../../../types/jobTitle';

export interface JobOfferForm {
  id: string;
  jobTitleId: string;
  description: string;
  minSalary: number;
  maxSalary: number;
  remote: number;
  requirement: string;
}

export interface FormState {
  selectedJobTitle: JobTitle | null;
  remotePercentage: string;
  minSalary: string;
  maxSalary: string;
  description: string;
  requirements: string[];
}

export interface FormErrors {
  jobTitle?: string;
  remotePercentage?: string;
  minSalary?: string;
  maxSalary?: string;
  description?: string;
  requirements?: string;
}

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
}

export interface TextFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  maxLength?: number;
  type?: string;
  onBlur?: () => void;
}

export interface DropdownProps<T> {
  label: string;
  value: string;
  options: T[];
  loading: boolean;
  error: string | null;
  renderOption: (option: T) => React.ReactNode;
  onSelect: (option: T) => void;
  placeholder?: string;
}

export interface RequirementsListProps {
  requirements: string[];
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  required?: boolean;
}
