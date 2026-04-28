import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_URL,
});

// Add token to headers
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle expired tokens (401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't redirect if the error is from a login attempt
      if (error.config.url?.includes('/auth/login')) {
        return Promise.reject(error);
      }

      // Clear session data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login page (triggering a reload will cause App.tsx to show LoginPage)
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Auth endpoints
  register: (username: string, email: string, password: string) =>
    apiClient.post('/auth/register', { username, email, password }),

  login: (username: string, password: string) =>
    apiClient.post('/auth/login', { username, password }),

  // File endpoints
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getFiles: () => apiClient.get('/files/files'),

  deleteFile: (fileId: number) => apiClient.delete(`/files/files/${fileId}`),

  downloadFile: (fileId: number) =>
    apiClient.get(`/files/download/${fileId}`, { responseType: 'blob' }),

  listS3Files: () => apiClient.get('/files/s3/list'),
};
