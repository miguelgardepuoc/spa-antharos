import { ChangeEvent, FormEvent } from 'react';

export interface TextFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  maxLength?: number;
  type?: string;
  onBlur?: () => void;
  error?: string;
}

export interface DropdownProps<T> {
  label: string;
  value: string;
  options: T[];
  loading: boolean;
  error?: string | null;
  renderOption: (option: T) => JSX.Element;
  onSelect: (option: T) => void;
  placeholder?: string;
  required?: boolean;
  errorMessage?: string;
}

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
}

export interface RequirementsListProps {
  requirements: string[];
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  required?: boolean;
  error?: string;
}
