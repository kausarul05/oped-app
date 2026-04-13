import api from './api';

const authService = {
    // Reader Signup
    readerSignup: async (userData) => {
        try {
            const response = await api.post('/api/v1/reader/auth/signup', {
                name: userData.name,
                email: userData.email,
                password: userData.password,
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message || 'Signup failed' };
        }
    },

    // Writer Signup (if needed)
    writerSignup: async (userData) => {
        try {
            const response = await api.post('/api/v1/writer/auth/signup', {
                name: userData.name,
                email: userData.email,
                password: userData.password,
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message || 'Signup failed' };
        }
    },

    // Login
    login: async (email, password) => {
        try {
            const response = await api.post('/api/v1/auth/login', {
                email,
                password,
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message || 'Login failed' };
        }
    },

    // Forgot Password
    forgotPassword: async (email) => {
        try {
            const response = await api.post('/api/v1/auth/forgot-password', { email });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message || 'Request failed' };
        }
    },

    // Verify OTP
    verifyOTP: async (email, otp) => {
        try {
            const response = await api.post('/api/v1/auth/verify-otp', { email, otp });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message || 'Verification failed' };
        }
    },

    // Reset Password
    resetPassword: async (email, newPassword, confirmPassword) => {
        try {
            const response = await api.post('/api/v1/auth/reset-password', {
                email,
                newPassword,
                confirmPassword,
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message || 'Password reset failed' };
        }
    },
};

export default authService;