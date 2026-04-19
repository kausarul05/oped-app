import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

const podcastService = {
    // Get all podcasts with pagination
    getPodcasts: async (category = 'politics', page = 1, limit = 10) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.get('/api/v1/podcast/reader/all', {
                params: { category, page, limit },
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            if (response.data && response.data.success) {
                return {
                    success: true,
                    data: response.data.data,
                    pagination: response.data.pagination
                };
            }
            return { success: false, data: [], error: 'No data found' };
        } catch (error) {
            console.error('Get podcasts error:', error);
            return { success: false, data: [], error: error.message };
        }
    },

    // Get single podcast by ID
    getPodcastById: async (podcastId) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.get(`/api/v1/podcast/reader/detail/${podcastId}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Get podcast by ID error:', error);
            return { success: false, error: error.message };
        }
    },

    // Create a new podcast (Writer)
    createPodcast: async (formData) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.post('/api/v1/podcast/writer/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: token ? `Bearer ${token}` : ''
                }
            });

            if (response.data && response.data.success) {
                return { success: true, data: response.data };
            }
            return { success: false, error: response.data?.message || 'Failed to create podcast' };
        } catch (error) {
            console.error('Create podcast error:', error);
            return { success: false, error: error.response?.data?.message || error.message };
        }
    },

    // Like a podcast
    likePodcast: async (podcastId) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.post(`/api/v1/podcast/${podcastId}/like`, {}, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Unlike a podcast
    unlikePodcast: async (podcastId) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.delete(`/api/v1/podcast/${podcastId}/like`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Bookmark a podcast
    bookmarkPodcast: async (podcastId) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.post(`/api/v1/podcast/${podcastId}/bookmark`, {}, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Unbookmark a podcast
    unbookmarkPodcast: async (podcastId) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.delete(`/api/v1/podcast/${podcastId}/bookmark`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Get writer's podcasts
    getWriterPodcasts: async (status = 'draft', category = 'politics', page = 1, limit = 10) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.get('/api/v1/podcast/writer/my-podcasts', {
                params: { status, category, page, limit },
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            if (response.data && response.data.success) {
                return {
                    success: true,
                    data: response.data.data,
                    pagination: response.data.pagination
                };
            }
            return { success: false, data: [], error: 'No data found' };
        } catch (error) {
            console.error('Get writer podcasts error:', error);
            return { success: false, data: [], error: error.message };
        }
    },
};

export default podcastService;