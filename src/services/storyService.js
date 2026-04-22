import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

const storyService = {
    // Get all stories with pagination
    getStories: async (category = 'technology', page = 1, limit = 10) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.get('/api/v1/story/reader/all', {
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
            console.error('Get stories error:', error);
            return { success: false, data: [], error: error.message };
        }
    },

    // Get top stories from explore API
    getTopStories: async (category = '', page = 1, limit = 10) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const params = { page, limit };

            // Only add category if it's provided and not 'all'
            if (category && category !== 'all' && category !== 'All') {
                params.category = category;
            }

            const response = await api.get('/api/v1/explore/top-stories', {
                params: params,
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
            console.error('Get top stories error:', error);
            return { success: false, data: [], error: error.message };
        }
    },

    // Get single story by ID
    getStoryById: async (storyId) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.get(`/api/v1/story/reader/detail/${storyId}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Get single story by ID
    getWriterStoryById: async (storyId) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.get(`/api/v1/story/writer/my-stories/${storyId}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Create a new story (Writer)
    createStory: async (formData) => {
        try {
            const token = await AsyncStorage.getItem('authToken');

            // Log the form data for debugging
            for (let pair of formData._parts) {
                console.log('FormData:', pair[0], pair[1]?.uri || pair[1]);
            }

            const response = await api.post('/api/v1/story/writer/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: token ? `Bearer ${token}` : ''
                },
                timeout: 120000, // 2 minutes timeout for file upload
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    console.log('Upload progress:', percentCompleted + '%');
                }
            });

            if (response.data && response.data.success) {
                return { success: true, data: response.data };
            }
            return { success: false, error: response.data?.message || 'Failed to create story' };
        } catch (error) {
            console.error('Create story error:', error);

            // Detailed error logging
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                return { success: false, error: error.response.data?.message || 'Server error' };
            } else if (error.request) {
                console.error('No response received:', error.request);
                return { success: false, error: 'No response from server. Please check your connection.' };
            } else {
                console.error('Error setting up request:', error.message);
                return { success: false, error: error.message };
            }
        }
    },

    // Submit story to editor for review
    submitToEditor: async (storyId) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.patch(`/api/v1/story/writer/submit/${storyId}`, {}, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            if (response.data && response.data.success) {
                return {
                    success: true,
                    message: response.data.message,
                    data: response.data.data
                };
            }
            return { success: false, error: response.data?.message || 'Failed to submit to editor' };
        } catch (error) {
            console.error('Submit to editor error:', error);
            return { success: false, error: error.response?.data?.message || error.message };
        }
    },


    // Like a story
    likeStory: async (storyId) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.post(`/api/v1/story/${storyId}/like`, {}, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Unlike a story
    unlikeStory: async (storyId) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.delete(`/api/v1/story/${storyId}/like`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Bookmark a story
    bookmarkStory: async (storyId) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.post(`/api/v1/story/${storyId}/bookmark`, {}, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Unbookmark a story
    unbookmarkStory: async (storyId) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.delete(`/api/v1/story/${storyId}/bookmark`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Get writer's stories
    getWriterStories: async (status = '', page = 1, limit = 10) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const params = { page, limit };

            // Only add status param if it's provided and not empty
            if (status && status !== '') {
                params.status = status;
            }

            const response = await api.get('/api/v1/story/writer/my-stories', {
                params: params,
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
            console.error('Get writer stories error:', error);
            return { success: false, data: [], error: error.message };
        }
    },

    // Get scheduled stories (dedicated endpoint)
    getScheduledStories: async (page = 1, limit = 10) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.get('/api/v1/story/writer/scheduled', {
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
            console.error('Get scheduled stories error:', error);
            return { success: false, data: [], error: error.message };
        }
    },

    // Get feedback for a specific story
    getStoryFeedback: async (storyId) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.get(`/api/v1/story/writer/feedback/${storyId}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            return { success: true, data: response.data?.data };
        } catch (error) {
            console.error('Get story feedback error:', error);
            return { success: false, error: error.message };
        }
    },
};

export default storyService;