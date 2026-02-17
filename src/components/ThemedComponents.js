import React from 'react';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useTheme } from '../hooks/useTheme';

// Import icons directly
import { Ionicons } from '@expo/vector-icons';

// Themed Text Component
export const ThemedText = ({ style, children, ...props }) => {
  const { colors } = useTheme();
  return (
    <Text style={[{ color: colors.text, fontFamily: 'CoFoRaffine' }, style]} {...props}>
      {children}
    </Text>
  );
};

// Themed View Component
export const ThemedView = ({ style, children, ...props }) => {
  const { colors } = useTheme();
  return (
    <View style={[{ backgroundColor: colors.background }, style]} {...props}>
      {children}
    </View>
  );
};

// Themed Input Component with Icon
export const ThemedInput = ({ style, icon, ...props }) => {
  const { colors, spacing, borderRadius } = useTheme();
  
  return (
    <View style={{ position: 'relative', width: '100%' }}>
      {icon && (
        <View style={{
          position: 'absolute',
          left: spacing.md,
          top: 0,
          bottom: 0,
          justifyContent: 'center',
          zIndex: 1,
        }}>
          <Ionicons
            name={icon}
            size={20}
            color={colors.textSecondary}
          />
        </View>
      )}
      <TextInput
        style={[
          {
            backgroundColor: colors.inputBackground,
            borderColor: colors.inputBorder,
            borderWidth: 1,
            borderRadius: borderRadius.md,
            paddingHorizontal: icon ? spacing.xl : spacing.md,
            paddingVertical: spacing.md,
            color: colors.text,
            fontFamily: 'CoFoRaffine',
            width: '100%',
          },
          style,
        ]}
        placeholderTextColor={colors.textTertiary}
        {...props}
      />
    </View>
  );
};

// Themed Button Component
export const ThemedButton = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}) => {
  const { colors, borderRadius, spacing } = useTheme();

  const getButtonColors = () => {
    if (disabled) {
      return {
        bg: colors.buttonDisabled,
        text: colors.textInverse,
      };
    }
    switch (variant) {
      case 'primary':
        return {
          bg: colors.buttonPrimary,
          text: colors.buttonPrimaryText,
        };
      case 'secondary':
        return {
          bg: colors.buttonSecondary,
          text: colors.buttonSecondaryText,
        };
      case 'outline':
        return {
          bg: 'transparent',
          text: colors.primary,
          border: colors.border,
        };
      default:
        return {
          bg: colors.buttonPrimary,
          text: colors.buttonPrimaryText,
        };
    }
  };

  const buttonColors = getButtonColors();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        {
          backgroundColor: buttonColors.bg,
          borderRadius: borderRadius.round,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          borderWidth: variant === 'outline' ? 1 : 0,
          borderColor: buttonColors.border,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={buttonColors.text} />
      ) : (
        <>
          {icon && (
            <Ionicons
              name={icon}
              size={20}
              color={buttonColors.text}
              style={{ marginRight: spacing.sm }}
            />
          )}
          <Text
            style={[
              {
                color: buttonColors.text,
                fontSize: 18,
                fontWeight: '600',
                fontFamily: 'CoFoRaffine',
              },
              textStyle,
            ]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

// Theme Toggle Button
export const ThemeToggle = ({ style }) => {
  const { colors, theme, toggleTheme, spacing } = useTheme();
  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={[
        {
          padding: spacing.sm,
        },
        style,
      ]}>
      <Ionicons
        name={theme === 'dark' ? 'sunny' : 'moon'}
        size={24}
        color={colors.text}
      />
    </TouchableOpacity>
  );
};