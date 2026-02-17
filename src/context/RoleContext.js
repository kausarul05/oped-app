import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
    const [userRole, setUserRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadUserRole();
    }, []);

    const loadUserRole = async () => {
        try {
            const savedRole = await AsyncStorage.getItem('userRole');
            if (savedRole) {
                setUserRole(savedRole);
            }
        } catch (error) {
            console.error('Error loading user role:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveUserRole = async (role) => {
        try {
            await AsyncStorage.setItem('userRole', role);
            setUserRole(role);
        } catch (error) {
            console.error('Error saving user role:', error);
        }
    };

    const clearUserRole = async () => {
        try {
            await AsyncStorage.removeItem('userRole');
            setUserRole(null);
        } catch (error) {
            console.error('Error clearing user role:', error);
        }
    };

    return (
        <RoleContext.Provider
            value={{
                userRole,
                isLoading,
                saveUserRole,
                clearUserRole,
            }}>
            {children}
        </RoleContext.Provider>
    );
};

export const useRole = () => {
    const context = useContext(RoleContext);
    if (!context) {
        throw new Error('useRole must be used within a RoleProvider');
    }
    return context;
};