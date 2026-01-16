import axios from 'axios';

// API Configuration
// const RAILWAY_API_URL = 'https://ocrbackend-production-b237.up.railway.app';
const RAILWAY_API_URL = 'http://localhost:5050';

// Create axios instance with default config
const api = axios.create({
  baseURL: RAILWAY_API_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding loading states
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        url: error.response.config.url,
      });
    } else if (error.request) {
      console.error('API No Response:', error.request);
    } else {
      console.error('API Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// File upload and extraction
export const uploadAndExtract = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('/api/extract', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percentCompleted);
        }
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error ||
      error.message ||
      'Failed to process file'
    );
  }
};

// Download extracted data
export const downloadFile = async (format, endpoint, data, filename) => {
  try {
    const response = await api.get(endpoint, {
      params: { data: JSON.stringify(data) },
      responseType: 'blob',
    });

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename || `extracted-data.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
};

// Health check
export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('Service unavailable');
  }
};

// File validation
export const validateFile = (file) => {
  const errors = [];

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    errors.push(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
  }

  // Check file type
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (!allowedTypes.includes(file.type)) {
    const extension = file.name.split('.').pop().toLowerCase();
    const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'];

    if (!allowedExtensions.includes(extension)) {
      errors.push('File type not supported');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export default api;