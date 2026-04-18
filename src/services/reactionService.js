// src/services/reactionService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

const reactionService = {
    // Get reactions for a story
    getReactions: async (contentId) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            console.log("token", token)
            const response = await api.get(`/api/v1/react/story/${contentId}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            return { success: true, data: response.data?.data };
        } catch (error) {
            console.error('Get reactions error:', error);
            return { success: false, error: error.message };
        }
    },

    // Add reaction to a story
    addReaction: async (contentType, contentId, reactionType) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.post('/api/v1/react/add', {
                contentType,
                contentId,
                reactionType
            }, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Add reaction error:', error);
            return { success: false, error: error.message };
        }
    },

    // Remove reaction from a story
    removeReaction: async (contentType, contentId) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.post('/api/v1/react/add', {
                contentType,
                contentId
            }, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Remove reaction error:', error);
            return { success: false, error: error.message };
        }
    },
};

export default reactionService;