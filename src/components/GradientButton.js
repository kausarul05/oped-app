import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { BUTTON_SIZES, BUTTON_VARIANTS } from './GradientButton.variants';

const GradientButton = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  variant = 'PRIMARY',
  size = 'LARGE',
  customGradientColors,
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

  // Get variant styles
  const variantStyle = BUTTON_VARIANTS[variant] || BUTTON_VARIANTS.PRIMARY;
  
  // Get size styles
  const sizeStyle = BUTTON_SIZES[size] || BUTTON_SIZES.LARGE;

  // Use custom colors if provided, otherwise use variant colors
  const gradientColors = customGradientColors || variantStyle.gradientColors;
  const shadowColor = customShadowColor || variantStyle.shadowColor;
  const textColor = customTextColor || variantStyle.textColor;

  // If disabled, use disabled variant
  if (disabled) {
    const disabledStyle = BUTTON_VARIANTS.DISABLED;
    gradientColors = disabledStyle.gradientColors;
    shadowColor = disabledStyle.shadowColor;
    textColor = disabledStyle.textColor;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.container,
        fullWidth && styles.fullWidth,
        {
          shadowColor: shadowColor,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: variantStyle.shadowOpacity,
          shadowRadius: 8,
          elevation: 4,
        },
        style,
      ]}>
      <LinearGradient
        colors={gradientColors}
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
          <ActivityIndicator color={textColor} />
        ) : (
          <View style={styles.contentContainer}>
            {icon && iconPosition === 'left' && (
              <Ionicons
                name={icon}
                size={sizeStyle.fontSize + 2}
                color={textColor}
                style={[styles.leftIcon, iconStyle]}
              />
            )}
            <Text
              style={[
                styles.text,
                {
                  color: textColor,
                  fontSize: sizeStyle.fontSize,
                  fontWeight: '600',
                  fontFamily: 'CoFoRaffineBold',
                },
                textStyle,
              ]}>
              {title}
            </Text>
            {icon && iconPosition === 'right' && (
              <Ionicons
                name={icon}
                size={sizeStyle.fontSize + 2}
                color={textColor}
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