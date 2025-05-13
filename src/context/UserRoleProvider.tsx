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
        const decoded = jwtDecode<DecodedToken>(token);
        setUserRole(decoded.role);
      } catch (error) {
        console.error('Failed to decode token:', error);
        setUserRole(null);
      }
    }
  }, []);

  return (
    <UserRoleContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </UserRoleContext.Provider>
  );
};
