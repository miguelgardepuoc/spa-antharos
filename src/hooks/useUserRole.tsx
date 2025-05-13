import { useContext } from 'react';
import { UserRoleContext, UserRoleContextType } from '../context/UserRoleContext';

const useUserRole = (): UserRoleContextType => {
  const context = useContext(UserRoleContext);
  if (!context) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
};

export default useUserRole;
