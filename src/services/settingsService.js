// services/settingsService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

const settingsService = {
    // Get all settings
    getSettings: async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await api.get('/api/v1/admin/dashboard/settings', {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            if (response.data && response.data.success) {
                return {
                    success: true,
                    data: response.data.data
                };
            }
            return { success: false, error: 'No data found' };
        } catch (error) {
            console.error('Get settings error:', error);
            return { success: false, error: error.message };
        }
    },
};

export default settingsService;