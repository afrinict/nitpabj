import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3050/api';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  membershipType: 'student' | 'associate' | 'professional' | 'fellow';
}

export interface ComplaintData {
  title: string;
  description: string;
  category: string;
  location: string;
  contactInfo: string;
}

export const api = {
  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axiosInstance.post('/auth/register', data);
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },

  // Complaint endpoints
  async submitComplaint(data: ComplaintData): Promise<void> {
    await axiosInstance.post('/complaints', data);
  },

  // News endpoints
  async getNews(): Promise<any[]> {
    const response = await axiosInstance.get('/news');
    return response.data;
  },

  // Events endpoints
  async getEvents(): Promise<any[]> {
    const response = await axiosInstance.get('/events');
    return response.data;
  },

  // Membership endpoints
  async getMembershipTypes(): Promise<any[]> {
    const response = await axiosInstance.get('/membership/types');
    return response.data;
  }
}; 