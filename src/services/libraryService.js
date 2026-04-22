// services/libraryService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

const libraryService = {
    // Toggle save/unsave content (story, podcast, etc.)
    toggleSave: async ({ contentType, contentId, listType = 'saved' }) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            
            const response = await api.post('/api/v1/library/toggle', {
                contentType,
                contentId,
                listType
            }, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            if (response.data && response.data.success) {
                return {
                    success: true,
                    message: response.data.message,
                    data: response.data.data
                };
            }
            return { 
                success: false, 
                error: response.data?.message || 'Failed to save content' 
            };
        } catch (error) {
            console.error('Toggle save error:', error);
            if (error.response) {
                return { 
                    success: false, 
                    error: error.response.data?.message || 'Server error' 
                };
            }
            return { 
                success: false, 
                error: error.message || 'Failed to save content' 
            };
        }
    },

    // Get saved items
    getSavedItems: async (listType = 'saved', page = 1, limit = 10) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.get('/api/v1/library/items', {
                params: { listType, page, limit },
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
            console.error('Get saved items error:', error);
            return { success: false, data: [], error: error.message };
        }
    },

    // Check if content is saved
    isContentSaved: async (contentId) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.get(`/api/v1/library/check/${contentId}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            if (response.data && response.data.success) {
                return {
                    success: true,
                    isSaved: response.data.data?.isSaved || false
                };
            }
            return { success: false, isSaved: false };
        } catch (error) {
            console.error('Check content saved error:', error);
            return { success: false, isSaved: false };
        }
    }
};

export default libraryService;