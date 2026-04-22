// services/notificationService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

const notificationService = {
    // Get all notifications
    getNotifications: async (page = 1, limit = 10) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.get('/api/v1/notification', {
                params: { page, limit },
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            if (response.data || response.data.success) {
                return {
                    success: true,
                    data: response.data.data,
                    unreadCount: response.data.unreadCount || 0,
                    pagination: response.data.pagination
                };
            }
            return { success: false, data: [], unreadCount: 0, error: 'No data found' };
        } catch (error) {
            console.error('Get notifications error:', error);
            return { success: false, data: [], unreadCount: 0, error: error.message };
        }
    },

    // Mark single notification as read
    markAsRead: async (notificationId) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.patch(`/api/v1/notification/${notificationId}/read`, {}, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            if (response.data && response.data.success) {
                return { success: true, data: response.data };
            }
            return { success: false, error: 'Failed to mark as read' };
        } catch (error) {
            console.error('Mark as read error:', error);
            return { success: false, error: error.message };
        }
    },

    // Mark all notifications as read
    markAllAsRead: async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.patch('/api/v1/notification/read-all', {}, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            if (response.data && response.data.success) {
                return { success: true, data: response.data };
            }
            return { success: false, error: 'Failed to mark all as read' };
        } catch (error) {
            console.error('Mark all as read error:', error);
            return { success: false, error: error.message };
        }
    },

    // Delete notification
    deleteNotification: async (notificationId) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.delete(`/api/v1/notification/${notificationId}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            if (response.data && response.data.success) {
                return { success: true, data: response.data };
            }
            return { success: false, error: 'Failed to delete notification' };
        } catch (error) {
            console.error('Delete notification error:', error);
            return { success: false, error: error.message };
        }
    },

    // Update FCM token for push notifications
    updateFCMToken: async (fcmToken) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.patch('/api/v1/notification/update-token', { fcmToken }, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            if (response.data && response.data.success) {
                return { success: true, data: response.data };
            }
            return { success: false, error: 'Failed to update token' };
        } catch (error) {
            console.error('Update FCM token error:', error);
            return { success: false, error: error.message };
        }
    },
};

export default notificationService;