import apiClient from './api';

export interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  credits: number;
  description: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  head: string;
  contact: string;
}

export interface Facility {
  id: string;
  name: string;
  type: string;
  location: string;
  hours: string;
  description: string;
}

export const universityService = {
  // Courses
  getCourses: async (search?: string): Promise<Course[]> => {
    try {
      const response = await apiClient.get('/courses', {
        params: { search },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCourseById: async (id: string): Promise<Course> => {
    try {
      const response = await apiClient.get(`/courses/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Events
  getEvents: async (category?: string): Promise<Event[]> => {
    try {
      const response = await apiClient.get('/events', {
        params: { category },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUpcomingEvents: async (limit: number = 10): Promise<Event[]> => {
    try {
      const response = await apiClient.get('/events/upcoming', {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Departments
  getDepartments: async (): Promise<Department[]> => {
    try {
      const response = await apiClient.get('/departments');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getDepartmentById: async (id: string): Promise<Department> => {
    try {
      const response = await apiClient.get(`/departments/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Facilities
  getFacilities: async (type?: string): Promise<Facility[]> => {
    try {
      const response = await apiClient.get('/facilities', {
        params: { type },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search
  searchAll: async (query: string): Promise<any> => {
    try {
      const response = await apiClient.get('/search', {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
