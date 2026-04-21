import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

const libraryService = {
    // Toggle saved status (add/remove from library)
    toggleSaved: async ({ contentType, contentId, listType }) => {
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
                return { success: true, data: response.data.data };
            }
            return { success: false, error: response.data?.message || 'Failed to save to library' };
        } catch (error) {
            console.error('Toggle saved error:', error);
            return { success: false, error: error.response?.data?.message || error.message };
        }
    },

    // Check if an item is saved
    checkSavedStatus: async (contentType, contentId) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.get(`/api/v1/library/check/${contentType}/${contentId}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            
            if (response.data && response.data.success) {
                return { success: true, data: response.data.data };
            }
            return { success: false, isSaved: false };
        } catch (error) {
            console.error('Check saved status error:', error);
            return { success: false, isSaved: false };
        }
    },

    // Get all saved items
    getSavedItems: async (listType = 'saved', page = 1, limit = 20) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.get('/api/v1/library/items', {
                params: { listType, page, limit },
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            
            if (response.data && response.data.success) {
                return { success: true, data: response.data.data, pagination: response.data.pagination };
            }
            return { success: false, data: [] };
        } catch (error) {
            console.error('Get saved items error:', error);
            return { success: false, data: [] };
        }
    },
};

export default libraryService;