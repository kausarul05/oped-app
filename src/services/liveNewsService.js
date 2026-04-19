import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const liveNewsService = {
    // Get all live news with pagination
    getLiveNews: async (page = 1, limit = 20) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.get('/api/v1/live-news/reader/all', {
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
            return { success: false, data: [], error: 'No data found' };
        } catch (error) {
            console.error('Get live news error:', error);
            return { success: false, data: [], error: error.message };
        }
    },

    // Get single live news by ID
    getLiveNewsById: async (newsId) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.get(`/api/v1/live-news/reader/${newsId}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Get live news by id error:', error);
            return { success: false, error: error.message };
        }
    },

    // Create live news (Writer)
    createLiveNews: async (content) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.post('/api/v1/live-news/writer/post', 
                { content },
                { headers: token ? { Authorization: `Bearer ${token}` } : {} }
            );
            
            if (response.data && response.data.success) {
                return { success: true, data: response.data };
            }
            return { success: false, error: response.data?.message || 'Failed to create live news' };
        } catch (error) {
            console.error('Create live news error:', error);
            return { success: false, error: error.response?.data?.message || error.message };
        }
    },
};

export default liveNewsService;