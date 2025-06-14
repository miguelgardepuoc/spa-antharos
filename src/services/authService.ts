import apiClient from './apiClient';
import { AuthResponse, ApiError } from '../types/login';

export const signup = async (
  username: string,
  password: string
): Promise<AuthResponse | ApiError> => {
  try {
    const response = await apiClient.post('/auth/signup', {
      username,
      password,
    });

    return response.data;
  } catch (error: any) {
    console.error('Signup error:', error);
    if (error.response) {
      return {
        message: error.response.data.message || 'Signup failed',
        status: error.response.status,
      };
    }
    return { message: 'Network error. Please try again.' };
  }
};

export const login = async (
  username: string,
  password: string
): Promise<AuthResponse | ApiError> => {
  try {
    const response = await apiClient.post('/auth/login', {
      username,
      password,
    });

    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }

    return response.data;
  } catch (error: any) {
    console.error('Login error:', error);
    if (error.response) {
      return {
        message: error.response.data.message || 'Login fallido',
        status: error.response.status,
      };
    }
    return { message: 'Network error. Please try again.' };
  }
};

export const getToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};
