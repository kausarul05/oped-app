// services/exploreService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

const exploreService = {
    // Get writer profile by ID
    getWriterProfile: async (writerId) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.get(`/api/v1/explore/writer/${writerId}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            if (response.data && response.data.success) {
                return {
                    success: true,
                    data: response.data.data
                };
            }
            return { success: false, error: 'No data found' };
        } catch (error) {
            console.error('Get writer profile error:', error);
            return { success: false, error: error.message };
        }
    },

    // Get writer stories with pagination
    getWriterStories: async (writerId, page = 1, limit = 10) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.get(`/api/v1/explore/writer/${writerId}/stories`, {
                params: { page, limit },
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            if (response.data && response.data.success) {
                return {
                    success: true,
                    data: response.data.data,
                    pagination: response.data.pagination
                };
            }
            return { success: false, data: [] };
        } catch (error) {
            console.error('Get writer stories error:', error);
            return { success: false, data: [] };
        }
    },

    // Get writer podcasts with pagination
    getWriterPodcasts: async (writerId, page = 1, limit = 10) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.get(`/api/v1/explore/writer/${writerId}/podcasts`, {
                params: { page, limit },
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            if (response.data && response.data.success) {
                return {
                    success: true,
                    data: response.data.data,
                    pagination: response.data.pagination
                };
            }
            return { success: false, data: [] };
        } catch (error) {
            console.error('Get writer podcasts error:', error);
            return { success: false, data: [] };
        }
    },
};

export default exploreService;