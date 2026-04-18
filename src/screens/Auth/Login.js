import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GradientButton from '../../components/GradientButton';
import {
    ThemedText,
    ThemedView
} from '../../components/ThemedComponents';
import { useRole } from '../../context/RoleContext';
import { useTheme } from '../../hooks/useTheme';
import authService from '../../services/authService';

export default function LoginScreen() {
    const { colors } = useTheme();
    const { saveUserRole } = useRole(); // Get saveUserRole from context
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigation = useNavigation();

    const handleLogin = async () => {
        // Validation
        if (!email.trim()) {
            Alert.alert('Error', 'Please enter your email');
            return;
        }
        if (!password.trim()) {
            Alert.alert('Error', 'Please enter your password');
            return;
        }

        setLoading(true);

        try {
            const result = await authService.login(email.trim().toLowerCase(), password.trim());
            
            if (result.success) {
                // Save user role (assuming API returns role)
                const userRole = result.data.role || 'reader'; // Default to reader if not specified
                await saveUserRole(userRole);

                console.log("result", result)
                console.log("token", result.data.access_token)
                
                // Save auth token
                if (result.data?.access_token) {
                    await AsyncStorage.setItem('authToken', result?.data?.access_token);
                }
                
                // Save user data
                if (result.data?.data) {
                    await AsyncStorage.setItem('userData', JSON.stringify(result.data));
                }
                
                // Save remember me preference
                if (rememberMe) {
                    await AsyncStorage.setItem('rememberMe', 'true');
                    await AsyncStorage.setItem('savedEmail', email.trim().toLowerCase());
                } else {
                    await AsyncStorage.removeItem('rememberMe');
                    await AsyncStorage.removeItem('savedEmail');
                }
                
                Alert.alert('Success', 'Logged in successfully!');
                // Navigation will be handled automatically by RootNavigator
            } else {
                Alert.alert('Login Failed', result.error || 'Invalid email or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            Alert.alert('Error', 'Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Load saved email if remember me was checked
    React.useEffect(() => {
        const loadSavedEmail = async () => {
            try {
                const saved = await AsyncStorage.getItem('rememberMe');
                if (saved === 'true') {
                    const savedEmail = await AsyncStorage.getItem('savedEmail');
                    if (savedEmail) {
                        setEmail(savedEmail);
                        setRememberMe(true);
                    }
                }
            } catch (error) {
                console.error('Error loading saved email:', error);
            }
        };
        loadSavedEmail();
    }, []);

    // Social Login Handler
    const handleSocialLogin = async (provider, userData) => {
        setLoading(true);
        try {
            const result = await authService.socialLogin({
                name: userData.name,
                email: userData.email,
                photo: userData.photo,
            });
            
            if (result.success) {
                // Save user role
                const userRole = result.data.role || 'reader';
                await saveUserRole(userRole);
                
                // Store user data
                await AsyncStorage.setItem('userData', JSON.stringify(userData));
                if (result.data.token) {
                    await AsyncStorage.setItem('authToken', result.data.token);
                }
                
                Alert.alert('Success', `Logged in with ${provider}`);
                // Navigation will be handled automatically by RootNavigator
            } else {
                Alert.alert('Login Failed', result.error || 'Social login failed');
            }
        } catch (error) {
            console.error('Social login error:', error);
            Alert.alert('Error', 'Social login failed. Please try again.');
        } finally {
            setLoading(false);
        }
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
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email address"
                            placeholderTextColor={colors.textTertiary}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            style={[
                                styles.input,
                                {
                                    color: colors.text,
                                    fontFamily: 'CoFoRaffine',
                                }
                            ]}
                        />
                    </View>
                </View>

                {/* Password Field with Label */}
                <View style={styles.inputWrapper}>
                    <ThemedText style={styles.inputLabel}>Password</ThemedText>
                    <View style={[styles.inputContainer, { borderColor: colors.border }]}>
                        <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="**********"
                            placeholderTextColor={colors.textTertiary}
                            secureTextEntry={!showPassword}
                            style={[
                                styles.input,
                                {
                                    color: colors.text,
                                    fontFamily: 'CoFoRaffine',
                                }
                            ]}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons
                                name={showPassword ? "eye-off-outline" : "eye-outline"}
                                size={20}
                                color={colors.textSecondary}
                            />
                        </TouchableOpacity>
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

                    <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                        <ThemedText style={[styles.forgot, { color: colors.link }]}>
                            Forgot Password?
                        </ThemedText>
                    </TouchableOpacity>
                </View>

                {/* Login Button - Using GradientButton */}
                <GradientButton
                    title="Log In"
                    onPress={handleLogin}
                    loading={loading}
                    variant="PRIMARY"
                    size="LARGE"
                    fullWidth={true}
                    style={styles.loginButton}
                />

                {/* OR Separator */}
                <View style={styles.orContainer}>
                    <View style={[styles.line, { backgroundColor: colors.line }]} />
                    <ThemedText style={styles.orText}>OR</ThemedText>
                    <View style={[styles.line, { backgroundColor: colors.line }]} />
                </View>

                {/* Social Login - Icons Only */}
                <View style={styles.socialContainer}>
                    <TouchableOpacity
                        style={[
                            styles.socialIconButton,
                            {
                                backgroundColor: colors.socialButtonBg,
                                borderColor: colors.socialButtonBorder,
                            },
                        ]}
                        onPress={() => {
                            // For now, show alert that Google login needs setup
                            Alert.alert('Info', 'Google login will be available soon');
                        }}
                    >
                        <Ionicons name="logo-google" size={24} color={colors.icon} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.socialIconButton,
                            {
                                backgroundColor: colors.socialButtonBg,
                                borderColor: colors.socialButtonBorder,
                            },
                        ]}
                        onPress={() => {
                            // For now, show alert that Apple login needs setup
                            Alert.alert('Info', 'Apple login will be available soon');
                        }}
                    >
                        <Ionicons name="logo-apple" size={24} color={colors.icon} />
                    </TouchableOpacity>
                </View>

                {/* Sign Up Link */}
                <View style={styles.signupContainer}>
                    <ThemedText style={styles.signupText}>
                        Don't have an account?{' '}
                    </ThemedText>
                    <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                        <ThemedText style={[styles.signupLink, { color: colors.primary }]}>
                            Sign Up
                        </ThemedText>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </ThemedView>
    );
}

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
        marginBottom: 40,
    },
    welcome: {
        fontSize: 24,
        fontWeight: '400',
        marginBottom: 8,
        fontFamily: 'CoFoRaffineBold',
        textAlign: 'center',
        letterSpacing: 2
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '400',
        marginBottom: 32,
        fontFamily: 'tenez',
        textAlign: 'center',
        color: '#000000',
    },
    inputWrapper: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 4,
        fontFamily: 'CoFoRaffineBold',
        letterSpacing: 1
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#C1D0E5',
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
        fontSize: 16,
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
        fontFamily: 'tenez',
        letterSpacing: 1
    },
    forgot: {
        fontSize: 14,
        fontWeight: '400',
        fontFamily: 'CoFoRaffineBold',
        letterSpacing: 1
    },
    loginButton: {
        marginBottom: 32,
        fontFamily: 'CoFoRaffineBold',
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
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
        fontFamily: 'tenez',
        letterSpacing: 1
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signupText: {
        fontSize: 16,
        fontWeight: '400',
        fontFamily: 'tenez',
        color: '#636F85',
        letterSpacing: 1
    },
    signupLink: {
        fontSize: 16,
        fontWeight: '400',
        fontFamily: 'tenez',
        letterSpacing: 1
    },
});