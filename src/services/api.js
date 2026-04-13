import axios from 'axios';

// Base API URL
const BASE_URL = 'https://katheleen-unerrant-consolingly.ngrok-free.dev';

// Create axios instance
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
    async (config) => {
        // You can add token here when you have login functionality
        // const token = await AsyncStorage.getItem('authToken');
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Server responded with error status
            console.error('API Error:', error.response.data);
            return Promise.reject(error.response.data);
        } else if (error.request) {
            // Request was made but no response
            console.error('Network Error:', error.request);
            return Promise.reject({ message: 'Network error. Please check your connection.' });
        } else {
            // Something else happened
            console.error('Error:', error.message);
            return Promise.reject({ message: error.message });
        }
    }
);

export default api;