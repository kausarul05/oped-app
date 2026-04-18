import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

const commentService = {
    // Get comments for a story
    getComments: async (contentId, page = 1, limit = 10) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.get(`/api/v1/comment/story/${contentId}`, {
                params: { page, limit },
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            return { success: true, data: response.data?.data, pagination: response.data?.pagination };
        } catch (error) {
            console.error('Get comments error:', error);
            return { success: false, error: error.message };
        }
    },

    // Add a comment
    addComment: async (contentType, contentId, content) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.post('/api/v1/comment/add', {
                contentType,
                contentId,
                content
            }, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Add comment error:', error);
            return { success: false, error: error.message };
        }
    },

    // Add a reply to a comment
    addReply: async (contentType, contentId, content, parentComment) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.post('/api/v1/comment/add', {
                contentType,
                contentId,
                content,
                parentComment
            }, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Add reply error:', error);
            return { success: false, error: error.message };
        }
    },

    // Like a comment
    likeComment: async (commentId) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.patch(`/api/v1/comment/like/${commentId}`, {}, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Like comment error:', error);
            return { success: false, error: error.message };
        }
    },

    // Dislike a comment
    dislikeComment: async (commentId) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.patch(`/api/v1/comment/dislike/${commentId}`, {}, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Dislike comment error:', error);
            return { success: false, error: error.message };
        }
    },

    // Delete a comment
    deleteComment: async (commentId) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.delete(`/api/v1/comment/delete/${commentId}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Delete comment error:', error);
            return { success: false, error: error.message };
        }
    },
};

export default commentService;