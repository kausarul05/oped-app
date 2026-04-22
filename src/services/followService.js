// services/followService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

const followService = {
    // Toggle follow/unfollow an author
    toggleFollow: async (authorId) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            
            const response = await api.post(`/api/v1/follow/toggle/${authorId}`, {}, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            if (response.data && response.data.success) {
                return {
                    success: true,
                    isFollowing: response.data.data?.isFollowing || false,
                    message: response.data.message
                };
            }
            return { 
                success: false, 
                error: response.data?.message || 'Failed to update follow status' 
            };
        } catch (error) {
            console.error('Toggle follow error:', error);
            if (error.response) {
                return { 
                    success: false, 
                    error: error.response.data?.message || 'Server error' 
                };
            }
            return { 
                success: false, 
                error: error.message || 'Failed to update follow status' 
            };
        }
    },

    // Check if current user is following an author
    checkFollowStatus: async (authorId) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            
            const response = await api.get(`/api/v1/follow/status/${authorId}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            if (response.data && response.data.success) {
                return {
                    success: true,
                    isFollowing: response.data.data?.isFollowing || false
                };
            }
            return { success: false, isFollowing: false };
        } catch (error) {
            console.error('Check follow status error:', error);
            return { success: false, isFollowing: false };
        }
    },

    // Get follower count for an author
    getFollowerCount: async (authorId) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            
            const response = await api.get(`/api/v1/follow/count/${authorId}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            if (response.data && response.data.success) {
                return {
                    success: true,
                    count: response.data.data?.followerCount || 0
                };
            }
            return { success: false, count: 0 };
        } catch (error) {
            console.error('Get follower count error:', error);
            return { success: false, count: 0 };
        }
    },

    // Get list of followers for an author
    getFollowers: async (authorId, page = 1, limit = 10) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            
            const response = await api.get(`/api/v1/follow/followers/${authorId}`, {
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
            console.error('Get followers error:', error);
            return { success: false, data: [] };
        }
    },

    // Get list of users that an author is following
    getFollowing: async (authorId, page = 1, limit = 10) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            
            const response = await api.get(`/api/v1/follow/my-following?page=${page}&limit=${limit}`, {
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
            console.error('Get following error:', error);
            return { success: false, data: [] };
        }
    }
};

export default followService;