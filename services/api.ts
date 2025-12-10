import axios from 'axios';

// Configure Groq API base URL
const GROQ_API_URL = 'https://api.groq.com/openai/v1';

const apiClient = axios.create({
  baseURL: GROQ_API_URL,
  timeout: 30000, // 30 seconds for AI responses
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
apiClient.interceptors.request.use(
  async (config) => {
    // Add Groq API key from environment variable
    const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;
    if (apiKey) {
      config.headers.Authorization = `Bearer ${apiKey}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Groq API authentication failed. Check your API key.');
    } else if (error.response?.status === 429) {
      console.error('Rate limit exceeded. Please try again later.');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
