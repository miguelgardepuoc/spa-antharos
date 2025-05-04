import axios from 'axios';
import { config } from '../config/environment';

const apiClient = axios.create({
  baseURL: config.api.baseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use(
    config => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  apiClient.interceptors.response.use(
    response => response,
    error => {
      console.log("Error on BFF response: ", error);
      // TODO: Revisar
      //if (
      //error.response &&
      //error.response.status === 401 &&
      //error.response.data?.error === 'session_expired'
      //) {
        alert("Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.");
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      //}
      return Promise.reject(error);
    }
  );

export default apiClient;