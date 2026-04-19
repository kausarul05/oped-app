import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

const authService = {
    // Reader Login
    readerLogin: async (email, password) => {
        try {
            const response = await api.post('/api/v1/reader/auth/login', {
                email: email,
                password: password,
            });

            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || error.message || 'Login failed' };
        }
    },

    // Writer Login
    writerLogin: async (email, password) => {
        try {
            const response = await api.post('/api/v1/writer/auth/login', {
                email: email,
                password: password,
            });

            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || error.message || 'Login failed' };
        }
    },

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

    // Writer Signup
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

    // Reader Verify OTP
    verifyOTP: async (email, otp) => {
        try {
            const response = await api.post('/api/v1/reader/auth/verify-otp', {
                email: email,
                otp: otp,
            });

            // Save token if returned
            if (response.data.token) {
                await AsyncStorage.setItem('authToken', response.data.token);
            }

            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message || 'Verification failed' };
        }
    },

    // Writer Verify OTP
    writerVerifyOTP: async (email, otp) => {
        try {
            const response = await api.post('/api/v1/writer/auth/verify-otp', {
                email: email,
                otp: otp,
            });

            // Save token if returned
            if (response.data.token) {
                await AsyncStorage.setItem('authToken', response.data.token);
            }

            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message || 'Verification failed' };
        }
    },

    // Reader Resend OTP
    resendOTP: async (email) => {
        try {
            const response = await api.post('/api/v1/reader/auth/resend-otp', { email });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message || 'Resend failed' };
        }
    },

    // Writer Resend OTP
    resendOTPWriter: async (email) => {
        try {
            const response = await api.post('/api/v1/writer/auth/resend-otp', { email });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message || 'Resend failed' };
        }
    },

    // Social Login (Google/Apple)
    socialLogin: async (userData) => {
        try {
            const response = await api.post('/api/v1/reader/auth/social-login', {
                name: userData.name,
                email: userData.email,
                photo: userData.photo,
            });

            // Save token if returned
            if (response.data.token) {
                await AsyncStorage.setItem('authToken', response.data.token);
            }

            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message || 'Social login failed' };
        }
    },

    // Get Writer Profile
    getWriterProfile: async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.get('/api/v1/writer/profile/get-profile', {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            return { success: true, data: response.data?.data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Update Writer Profile
    updateWriterProfile: async (formData) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.patch('/api/v1/writer/profile/edit', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: token ? `Bearer ${token}` : ''
                }
            });

            if (response.data && response.data.success) {
                return { success: true, data: response.data.data };
            }
            return { success: false, error: response.data?.message || 'Failed to update profile' };
        } catch (error) {
            console.error('Update writer profile error:', error);
            return { success: false, error: error.response?.data?.message || error.message };
        }
    },

    // Update Profile Image only
    updateProfileImage: async (formData) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.patch('/api/v1/writer/profile/edit', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: token ? `Bearer ${token}` : ''
                },
                timeout: 60000,
            });

            if (response.data && response.data.success) {
                return { success: true, data: response.data.data };
            }
            return { success: false, error: response.data?.message || 'Failed to update profile image' };
        } catch (error) {
            console.error('Update profile image error:', error);
            return { success: false, error: error.message };
        }
    },

    // Change Password
    changePassword: async (passwordData) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.patch('/api/v1/writer/profile/change-password', {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword,
            }, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            if (response.data && response.data.success) {
                return { success: true, data: response.data };
            }
            return { success: false, error: response.data?.message || 'Failed to change password' };
        } catch (error) {
            console.error('Change password error:', error);
            return { success: false, error: error.response?.data?.message || error.message };
        }
    },
};

export default authService;