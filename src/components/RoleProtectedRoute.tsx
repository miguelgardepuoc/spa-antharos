import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  role: string;
  exp: number;
}

const RoleProtectedRoute: React.FC<{ allowedRoles: string[] }> = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(decoded.role)) {
      return <Navigate to="/job-offers" replace />;
    }

    return <Outlet />;
  } catch (error) {
    return <Navigate to="/login" replace />;
  }
};

export default RoleProtectedRoute;
