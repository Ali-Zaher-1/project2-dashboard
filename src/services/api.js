import axios from 'axios';

// Use Railway backend URL directly (no environment variable needed for now)
const API_BASE_URL = 'https://project2-api.up.railway.app';
const API_VERSION = '/api/v1';

console.log('🔗 API connected to:', API_BASE_URL);

const API = axios.create({
  baseURL: `${API_BASE_URL}${API_VERSION}`,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Users
export const getUsers = (page = 1, limit = 5) => API.get(`/users?page=${page}&limit=${limit}`);
export const getUserById = (id) => API.get(`/users/${id}`);
export const createUser = (data) => API.post('/users', data);
export const updateUser = (id, data) => API.put(`/users/${id}`, data);
export const deleteUser = (id) => API.delete(`/users/${id}`);

// Auth
export const login = async (credentials) => {
  console.log('📤 Login request to:', `${API_BASE_URL}${API_VERSION}/auth/login`);
  try {
    const response = await axios.post(`${API_BASE_URL}${API_VERSION}/auth/login`, credentials);
    console.log('✅ Login response:', response.data);
    
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('project2_user', JSON.stringify(response.data.user));
    }
    return response;
  } catch (error) {
    console.error('❌ Login error:', error.response?.data || error.message);
    throw error;
  }
};

export const register = async (userData) => {
  console.log('📝 Register request to:', `${API_BASE_URL}${API_VERSION}/auth/register`);
  try {
    const response = await axios.post(`${API_BASE_URL}${API_VERSION}/auth/register`, userData);
    console.log('✅ Register response:', response.data);
    
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('project2_user', JSON.stringify(response.data.user));
    }
    return response;
  } catch (error) {
    console.error('❌ Register error:', error.response?.data || error.message);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await API.get('/auth/me');
    return response;
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
};

// Health check
export const getHealth = () => axios.get(`${API_BASE_URL}/health`);

// Chat
export const getChatUsers = () => API.get('/chat-users');
export const getMessages = (room = 'general') => API.get(`/messages/${room}`);

export default API;