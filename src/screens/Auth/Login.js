import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ThemedText,
  ThemedView
} from '../../components/ThemedComponents';
import { useTheme } from '../../hooks/useTheme';

export default function LoginScreen() {
  const { colors, spacing } = useTheme();
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.content}>
        {/* Header with Logo */}
        <View style={styles.headerContainer}>
          <Image
            source={require('../../../assets/images/brand.png')}
            style={styles.logo}
          />
        </View>

        {/* Welcome Back */}
        <ThemedText style={styles.welcome}>Welcome Back!</ThemedText>
        <ThemedText style={styles.subtitle}>
          Sign in to continue your account
        </ThemedText>

        {/* Email Field with Label */}
        <View style={styles.inputWrapper}>
          <ThemedText style={styles.inputLabel}>Email Address</ThemedText>
          <View style={[styles.inputContainer, { borderColor: colors.border }]}>
            <Ionicons name="mail-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <ThemedInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email address"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
          </View>
        </View>

        {/* Password Field with Label */}
        <View style={styles.inputWrapper}>
          <ThemedText style={styles.inputLabel}>Password</ThemedText>
          <View style={[styles.inputContainer, { borderColor: colors.border }]}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <ThemedInput
              value={password}
              onChangeText={setPassword}
              placeholder="**********"
              secureTextEntry
              style={styles.input}
            />
          </View>
        </View>

        {/* Remember me & Forgot Password */}
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.rememberContainer}
            onPress={() => setRememberMe(!rememberMe)}>
            <View
              style={[
                styles.checkbox,
                {
                  borderColor: colors.checkboxBorder,
                  backgroundColor: rememberMe
                    ? colors.checkboxCheck
                    : colors.checkboxBg,
                },
              ]}>
              {rememberMe && (
                <ThemedText style={styles.checkmark}>✓</ThemedText>
              )}
            </View>
            <ThemedText style={styles.rememberText}>Remember Me</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity>
            <ThemedText style={[styles.forgot, { color: colors.link }]}>
              Forgot Password?
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Login Button with Gradient */}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          style={styles.gradientButtonContainer}>
          <LinearGradient
            colors={['#343E87', '#3448D6', '#343E87']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientButton}
          >
            <ThemedText style={styles.gradientButtonText}>
              {loading ? 'Logging in...' : 'Login'}
            </ThemedText>
          </LinearGradient>
        </TouchableOpacity>

        {/* Social Login - Icons Only */}
        <View style={styles.socialContainer}>
          <TouchableOpacity
            style={[
              styles.socialIconButton,
              {
                backgroundColor: colors.socialButtonBg,
                borderColor: colors.socialButtonBorder,
              },
            ]}>
            <Ionicons name="logo-google" size={24} color={colors.icon} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.socialIconButton,
              {
                backgroundColor: colors.socialButtonBg,
                borderColor: colors.socialButtonBorder,
              },
            ]}>
            <Ionicons name="logo-apple" size={24} color={colors.icon} />
          </TouchableOpacity>
        </View>

        {/* OR Separator */}
        <View style={styles.orContainer}>
          <View style={[styles.line, { backgroundColor: colors.line }]} />
          <ThemedText style={styles.orText}>OR</ThemedText>
          <View style={[styles.line, { backgroundColor: colors.line }]} />
        </View>

        {/* Sign Up Link */}
        <View style={styles.signupContainer}>
          <ThemedText style={styles.signupText}>
            Don't have an account?{' '}
          </ThemedText>
          <TouchableOpacity>
            <ThemedText style={[styles.signupLink, { color: colors.primary }]}>
              Sign Up
            </ThemedText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

// Custom ThemedInput component for this screen
const ThemedInput = ({ style, ...props }) => {
  const { colors } = useTheme();
  return (
    <ThemedText
      style={[
        {
          color: colors.text,
          fontFamily: 'CoFo Raffine',
          fontSize: 16,
          flex: 1,
          paddingVertical: 12,
        },
        style,
      ]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  logo: {
    width: 220,
    height: 70,
    resizeMode: 'contain',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcome: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'CoFo Raffine',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 32,
    fontFamily: 'CoFo Raffine',
    textAlign: 'center',
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    fontFamily: 'CoFo Raffine',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  rememberText: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'CoFo Raffine',
  },
  forgot: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'CoFo Raffine',
  },
  gradientButtonContainer: {
    marginBottom: 20,
    shadowColor: '#343E87',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06, // #343E870F has opacity ~0.06
    shadowRadius: 8,
    elevation: 4,
  },
  gradientButton: {
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'CoFo Raffine',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    gap: 16,
  },
  socialIconButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  line: {
    flex: 1,
    height: 1,
  },
  orText: {
    fontSize: 14,
    fontWeight: '400',
    marginHorizontal: 16,
    fontFamily: 'CoFo Raffine',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'CoFo Raffine',
  },
  signupLink: {
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
    fontFamily: 'CoFo Raffine',
  },
});