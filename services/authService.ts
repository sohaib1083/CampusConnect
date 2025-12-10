import apiClient from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  studentId: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    studentId: string;
  };
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  signup: async (data: SignupData): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post('/auth/signup', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      throw error;
    }
  },

  verifyToken: async (token: string): Promise<boolean> => {
    try {
      const response = await apiClient.post('/auth/verify', { token });
      return response.data.valid;
    } catch (error) {
      return false;
    }
  },

  resetPassword: async (email: string): Promise<void> => {
    try {
      await apiClient.post('/auth/reset-password', { email });
    } catch (error) {
      throw error;
    }
  },
};
