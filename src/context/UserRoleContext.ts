import { createContext } from 'react';

export interface UserRoleContextType {
  userRole: string | null;
  changeUserRole: (token: string) => void;
  clearUserRole: () => void;
}

export const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);
