import { createContext, Dispatch, SetStateAction } from 'react';

export interface UserRoleContextType {
  userRole: string | null;
  setUserRole: Dispatch<SetStateAction<string | null>>;
}

export const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);
