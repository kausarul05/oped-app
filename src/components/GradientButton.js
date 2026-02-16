// src/components/GradientButton.js
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';

const GradientButton = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  variant = 'PRIMARY',
  size = 'LARGE',
  gradientColors: customGradientColors, // Rename prop to avoid conflict
  customShadowColor,
  customTextColor,
  gradientStart = { x: 0, y: 0 },
  gradientEnd = { x: 1, y: 1 },
  style,
  textStyle,
  iconStyle,
  fullWidth = true,
}) => {
  const { colors } = useTheme();

  // Define button variants
  const BUTTON_VARIANTS = {
    PRIMARY: {
      gradientColors: ['#343E87', '#3448D6', '#343E87'],
      shadowColor: '#343E87',
      shadowOpacity: 0.06,
      textColor: '#FFFFFF',
    },
    SECONDARY: {
      gradientColors: ['#6C63FF', '#4A47B1', '#6C63FF'],
      shadowColor: '#6C63FF',
      shadowOpacity: 0.08,
      textColor: '#FFFFFF',
    },
    DISABLED: {
      gradientColors: ['#CCCCCC', '#BBBBBB', '#CCCCCC'],
      shadowColor: '#999999',
      shadowOpacity: 0.04,
      textColor: '#666666',
    },
  };

  // Define size variants
  const BUTTON_SIZES = {
    SMALL: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      fontSize: 14,
      borderRadius: 20,
    },
    MEDIUM: {
      paddingVertical: 14,
      paddingHorizontal: 20,
      fontSize: 16,
      borderRadius: 25,
    },
    LARGE: {
      paddingVertical: 16,
      paddingHorizontal: 24,
      fontSize: 18,
      borderRadius: 30,
    },
  };

  // Get variant styles
  const variantStyle = BUTTON_VARIANTS[variant] || BUTTON_VARIANTS.PRIMARY;
  
  // Get size styles
  const sizeStyle = BUTTON_SIZES[size] || BUTTON_SIZES.LARGE;

  // Determine colors - use custom if provided, otherwise use variant
  let finalGradientColors;
  let finalShadowColor;
  let finalTextColor;

  if (disabled) {
    finalGradientColors = BUTTON_VARIANTS.DISABLED.gradientColors;
    finalShadowColor = BUTTON_VARIANTS.DISABLED.shadowColor;
    finalTextColor = BUTTON_VARIANTS.DISABLED.textColor;
  } else {
    finalGradientColors = customGradientColors || variantStyle.gradientColors;
    finalShadowColor = customShadowColor || variantStyle.shadowColor;
    finalTextColor = customTextColor || variantStyle.textColor;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.container,
        fullWidth && styles.fullWidth,
        {
          shadowColor: finalShadowColor,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: variantStyle.shadowOpacity,
          shadowRadius: 8,
          elevation: 4,
        },
        style,
      ]}>
      <LinearGradient
        colors={finalGradientColors}
        start={gradientStart}
        end={gradientEnd}
        style={[
          styles.gradient,
          {
            borderRadius: sizeStyle.borderRadius,
            paddingVertical: sizeStyle.paddingVertical,
            paddingHorizontal: sizeStyle.paddingHorizontal,
          },
        ]}>
        {loading ? (
          <ActivityIndicator color={finalTextColor} />
        ) : (
          <View style={styles.contentContainer}>
            {icon && iconPosition === 'left' && (
              <Ionicons
                name={icon}
                size={sizeStyle.fontSize + 2}
                color={finalTextColor}
                style={[styles.leftIcon, iconStyle]}
              />
            )}
            <Text
              style={[
                styles.text,
                {
                  color: finalTextColor,
                  fontSize: sizeStyle.fontSize,
                  fontWeight: '400',
                  fontFamily: 'CoFoRaffineBold',
                  letterSpacing: 1
                },
                textStyle,
              ]}>
              {title}
            </Text>
            {icon && iconPosition === 'right' && (
              <Ionicons
                name={icon}
                size={sizeStyle.fontSize + 2}
                color={finalTextColor}
                style={[styles.rightIcon, iconStyle]}
              />
            )}
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  fullWidth: {
    width: '100%',
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});

export default GradientButton;