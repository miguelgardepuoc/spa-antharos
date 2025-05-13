import { jwtDecode } from 'jwt-decode';
import { ReactNode, useEffect, useState } from 'react';
import { UserRoleContext } from './UserRoleContext';

interface UserRoleProviderProps {
  children: ReactNode;
}

interface DecodedToken {
  role: string;
  exp: number;
}

export const UserRoleProvider: React.FC<UserRoleProviderProps> = ({ children }) => {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        changeUserRole(token);
      } catch (error) {
        console.error('Failed to decode token:', error);
        setUserRole(null);
      }
    }
  }, []);

  const changeUserRole = (token: string) => {
    const decoded = jwtDecode<DecodedToken>(token);
    setUserRole(decoded.role);
  };

  const clearUserRole = () => {
    setUserRole(null);
  };

  return (
    <UserRoleContext.Provider value={{ userRole, changeUserRole, clearUserRole }}>
      {children}
    </UserRoleContext.Provider>
  );
};
