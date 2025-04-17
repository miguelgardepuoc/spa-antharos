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
  error?: string;
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

// src/utils/constants.ts
export const REMOTE_PERCENTAGE_MAP: Record<string, number> = {
  '100% Remoto': 100,
  '75% Remoto': 75,
  '50% Remoto': 50,
  '25% Remoto': 25,
  'Presencial': 0
};

export const REMOTE_OPTIONS = ['100% Remoto', '75% Remoto', '50% Remoto', '25% Remoto', 'Presencial'];