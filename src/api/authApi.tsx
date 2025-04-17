interface AuthResponse {
    token: string;
  }
  
  interface ApiError {
    message: string;
    status?: number;
  }

  export const signup = async (username: string, password: string): Promise<AuthResponse | ApiError> => {
    try {
      const response = await fetch('http://localhost:8080/bff/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        return { 
          message: data.message || 'Signup failed', 
          status: response.status 
        };
      }
  
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
  
      return data;
    } catch (error) {
      console.error('Signup error:', error);
      return { message: 'Network error. Please try again.' };
    }
  };

  export const login = async (username: string, password: string): Promise<AuthResponse | ApiError> => {
    try {
      const response = await fetch('http://localhost:8080/bff/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        return { 
          message: data.message || 'Login failed', 
          status: response.status 
        };
      }
  
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
  
      return data;
    } catch (error) {
      console.error('Login error:', error);
      return { message: 'Network error. Please try again.' };
    }
  };
  
  export const getToken = (): string | null => {
    return localStorage.getItem('authToken');
  };
  
  export const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const token = getToken();
    
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    };
  
    return fetch(url, {
      ...options,
      headers,
    });
  };
  
  export const logout = (): void => {
    localStorage.removeItem('authToken');
    // Add any additional cleanup like redirecting to login page
  };
  
  export const isAuthenticated = (): boolean => {
    return !!getToken();
  };