import api from './api';

const storyService = {
    // Get all stories with pagination
    getStories: async (category = 'technology', page = 1, limit = 10) => {
        try {
            const response = await api.get(`/api/v1/story/reader/all`, {
                params: {
                    category,
                    page,
                    limit
                }
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
            console.error('Get stories error:', error);
            return { success: false, data: [], error: error.message };
        }
    },

    // Get single story by ID
    getStoryById: async (storyId) => {
        try {
            const response = await api.get(`/api/v1/story/reader/detail/${storyId}`);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Like a story
    likeStory: async (storyId) => {
        try {
            const response = await api.post(`/api/v1/story/${storyId}/like`);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Unlike a story
    unlikeStory: async (storyId) => {
        try {
            const response = await api.delete(`/api/v1/story/${storyId}/like`);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Bookmark a story
    bookmarkStory: async (storyId) => {
        try {
            const response = await api.post(`/api/v1/story/${storyId}/bookmark`);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Unbookmark a story
    unbookmarkStory: async (storyId) => {
        try {
            const response = await api.delete(`/api/v1/story/${storyId}/bookmark`);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Get stories by category
    getStoriesByCategory: async (category, page = 1, limit = 10) => {
        try {
            const response = await api.get(`/api/v1/story/reader/all`, {
                params: { category, page, limit }
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
};

export default storyService;