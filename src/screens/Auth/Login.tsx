import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Note: The font "CoFo Raffine" needs to be added to your project assets
// and linked properly (React Native CLI) or configured (Expo).
// Instructions:
// 1. Place font files (e.g., CoFoRaffine-Regular.ttf, CoFoRaffine-Bold.ttf) in assets/fonts/
// 2. For React Native CLI: run npx react-native link
// 3. For Expo: use useFonts hook from expo-font

export default function Login() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>HOPED</Text>

      {/* Welcome Back */}
      <Text style={styles.welcome}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Sign in to continue your account</Text>

      {/* Email Field */}
      <Text style={styles.label}>Email Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email address"
        placeholderTextColor="#A0A0A0"
      />

      {/* Password Field */}
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="**********"
        placeholderTextColor="#A0A0A0"
        secureTextEntry
      />

      {/* Remember me & Forgot Password */}
      <View style={styles.row}>
        <View style={styles.rememberContainer}>
          <View style={styles.checkbox} />
          <Text style={styles.rememberText}>Remember Me</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      {/* OR Separator */}
      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>

      {/* Sign Up Link */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account? </Text>
        <TouchableOpacity>
          <Text style={styles.signupLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    fontFamily: 'CoFo Raffine', // Ensure this matches the exact font name after linking
    fontSize: 48,
    fontWeight: '700', // if available in the font family
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 2,
  },
  welcome: {
    fontFamily: 'CoFo Raffine',
    fontSize: 28,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'CoFo Raffine',
    fontSize: 16,
    fontWeight: '400',
    color: '#7C7C7C',
    marginBottom: 32,
  },
  label: {
    fontFamily: 'CoFo Raffine',
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 6,
  },
  input: {
    fontFamily: 'CoFo Raffine',
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    backgroundColor: '#F9F9F9',
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
    borderColor: '#333333',
    borderRadius: 4,
    marginRight: 8,
  },
  rememberText: {
    fontFamily: 'CoFo Raffine',
    fontSize: 14,
    fontWeight: '400',
    color: '#333333',
  },
  forgot: {
    fontFamily: 'CoFo Raffine',
    fontSize: 14,
    fontWeight: '400',
    color: '#0066CC',
  },
  loginButton: {
    backgroundColor: '#000000',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonText: {
    fontFamily: 'CoFo Raffine',
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  orText: {
    fontFamily: 'CoFo Raffine',
    fontSize: 14,
    fontWeight: '400',
    color: '#7C7C7C',
    marginHorizontal: 16,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontFamily: 'CoFo Raffine',
    fontSize: 16,
    fontWeight: '400',
    color: '#333333',
  },
  signupLink: {
    fontFamily: 'CoFo Raffine',
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    textDecorationLine: 'underline',
  },
});
