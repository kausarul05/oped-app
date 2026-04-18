import api from './api';

const liveNewsService = {
    // Get all live news with pagination
    getLiveNews: async (page = 1, limit = 20) => {
        try {
            const response = await api.get('/api/v1/live-news/reader/all', {
                params: {
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
            console.error('Get live news error:', error);
            return { success: false, data: [], error: error.message };
        }
    },

    // Get single live news by ID
    getLiveNewsById: async (newsId) => {
        try {
            const response = await api.get(`/api/v1/live-news/reader/${newsId}`);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Get live news by id error:', error);
            return { success: false, error: error.message };
        }
    },
};

export default liveNewsService;