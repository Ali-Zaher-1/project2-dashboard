import axios from 'axios';

// Use your real backend API
const API = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  timeout: 10000,
});

// Add token to requests if it exists
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

// Auth - Connect to your REAL backend
export const login = async (credentials) => {
  console.log('Sending login request to backend:', credentials);
  try {
    const response = await axios.post('http://localhost:3000/api/v1/auth/login', credentials);
    console.log('Login response:', response.data);
    
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('project2_user', JSON.stringify(response.data.user));
    }
    return response;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};

export const register = async (userData) => {
  console.log('Sending register request to backend:', userData);
  try {
    const response = await axios.post('http://localhost:3000/api/v1/auth/register', userData);
    console.log('Register response:', response.data);
    
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('project2_user', JSON.stringify(response.data.user));
    }
    return response;
  } catch (error) {
    console.error('Register error:', error.response?.data || error.message);
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
export const getHealth = () => axios.get('http://localhost:3000/health');

// Chat
export const getChatUsers = () => API.get('/chat-users');
export const getMessages = (room = 'general') => API.get(`/messages/${room}`);

export default API;