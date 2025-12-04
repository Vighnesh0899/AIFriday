import axios from 'axios';

/**
 * API Service for communicating with the FastAPI backend
 * Handles all HTTP requests and error handling
 */

// Base URL for API - can be configured via environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000, // 2 minutes timeout for AI processing
});

/**
 * Request interceptor for logging and adding auth tokens if needed
 */
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for error handling
 */
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.config.url}`, response.status);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Upload delivery data file (CSV or JSON)
 * @param {File} file - The file to upload
 * @returns {Promise} Response with parsed delivery data
 */
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to upload file');
  }
};

/**
 * Generate optimized routes using AI
 * @param {Object} payload - Contains delivery data and constraints
 * @returns {Promise} Response with optimized routes
 */
export const generateRoutes = async (payload) => {
  try {
    const response = await apiClient.post('/generate-routes', payload);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to generate routes');
  }
};

/**
 * Get sample delivery data for demo purposes
 * @returns {Promise} Response with sample delivery data
 */
export const getSampleData = async () => {
  try {
    const response = await apiClient.get('/get-sample-data');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch sample data');
  }
};

/**
 * Health check endpoint
 * @returns {Promise} Server health status
 */
export const healthCheck = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('Backend server is not responding');
  }
};

export default {
  uploadFile,
  generateRoutes,
  getSampleData,
  healthCheck,
};
