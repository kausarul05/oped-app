import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

// Light Theme Colors
const lightTheme = {
  // Backgrounds
  background: '#FFFFFF',
  surface: '#F5F5F5',
  card: '#F9F9F9',
  
  // Text
  text: '#000000',
  textSecondary: '#7C7C7C',
  textTertiary: '#A0A0A0',
  textInverse: '#FFFFFF',
  
  // Brand
  primary: '#000000',
  secondary: '#0066CC',
  accent: '#4A9EFF',
  
  // Status
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#2196F3',
  
  // Borders & Lines
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  borderDark: '#CCCCCC',
  
  // Inputs
  inputBackground: '#F9F9F9',
  inputBorder: '#E0E0E0',
  
  // Buttons
  buttonPrimary: '#000000',
  buttonPrimaryText: '#FFFFFF',
  buttonSecondary: '#F5F5F5',
  buttonSecondaryText: '#000000',
  buttonDisabled: '#CCCCCC',
  
  // Social
  socialButtonBg: '#F5F5F5',
  socialButtonBorder: '#E0E0E0',
  
  // Icons
  icon: '#000000',
  iconSecondary: '#666666',
  
  // Checkbox
  checkboxBorder: '#333333',
  checkboxBg: '#FFFFFF',
  checkboxCheck: '#000000',
  
  // Links
  link: '#0066CC',
  
  // Separators
  line: '#E0E0E0',
  
  // Shadows
  shadowColor: '#000000',
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2,
  
  // Navigation
  tabBar: '#FFFFFF',
  tabBarActive: '#000000',
  tabBarInactive: '#7C7C7C',
  header: '#FFFFFF',
};

// Dark Theme Colors
const darkTheme = {
  // Backgrounds
  background: '#121212',
  surface: '#1E1E1E',
  card: '#242424',
  
  // Text
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  textTertiary: '#888888',
  textInverse: '#000000',
  
  // Brand
  primary: '#FFFFFF',
  secondary: '#4A9EFF',
  accent: '#7CB9FF',
  
  // Status
  success: '#66BB6A',
  warning: '#FFD54F',
  error: '#EF5350',
  info: '#42A5F5',
  
  // Borders & Lines
  border: '#333333',
  borderLight: '#424242',
  borderDark: '#212121',
  
  // Inputs
  inputBackground: '#1E1E1E',
  inputBorder: '#333333',
  
  // Buttons
  buttonPrimary: '#FFFFFF',
  buttonPrimaryText: '#000000',
  buttonSecondary: '#333333',
  buttonSecondaryText: '#FFFFFF',
  buttonDisabled: '#444444',
  
  // Social
  socialButtonBg: '#1E1E1E',
  socialButtonBorder: '#333333',
  
  // Icons
  icon: '#FFFFFF',
  iconSecondary: '#AAAAAA',
  
  // Checkbox
  checkboxBorder: '#AAAAAA',
  checkboxBg: '#1E1E1E',
  checkboxCheck: '#FFFFFF',
  
  // Links
  link: '#4A9EFF',
  
  // Separators
  line: '#333333',
  
  // Shadows
  shadowColor: '#000000',
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 2,
  
  // Navigation
  tabBar: '#1E1E1E',
  tabBarActive: '#FFFFFF',
  tabBarInactive: '#888888',
  header: '#121212',
};

// Spacing System
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

// Typography System
export const typography = {
  h1: {
    fontSize: 48,
    fontWeight: '700',
    lineHeight: 56,
  },
  h2: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  },
  h3: {
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 36,
  },
  h4: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  body1: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  button: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
};

// Border Radius System
export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 30,
  circle: 999,
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState('light'); // Default to light
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('userTheme');
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        setTheme(systemColorScheme || 'light');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
      setTheme(systemColorScheme || 'light');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('userTheme', newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const setThemeMode = async (mode) => {
    setTheme(mode);
    try {
      await AsyncStorage.setItem('userTheme', mode);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const colors = theme === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colors,
        isDark: theme === 'dark',
        toggleTheme,
        setThemeMode,
        isLoading,
        spacing,
        typography,
        borderRadius,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};