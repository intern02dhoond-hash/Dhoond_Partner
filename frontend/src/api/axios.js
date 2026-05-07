/**
 * Axios Instance
 * Pre-configured HTTP client for all API calls
 */

import axios from 'axios';
import ENV from '../config/env';
import { API_TIMEOUT } from '../utils/constants';
import TokenService from '../services/token.service';

// Create axios instance with base config
const api = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach auth token to every request
api.interceptors.request.use(
  async (config) => {
    const token = await TokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor — handle common errors globally
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Server responded with an error status
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // No response received
      console.error('Network Error: No response from server');
    } else {
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
