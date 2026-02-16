import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GradientButton from '../../components/GradientButton';
import {
    ThemedText,
    ThemedView
} from '../../components/ThemedComponents';
import { useTheme } from '../../hooks/useTheme';

export default function SignUp() {
    const { colors } = useTheme();
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState('reader'); // 'reader' or 'writer'
    const navigation = useNavigation()

    const handleSignUp = () => {
        setLoading(true);
        // Simulate API call
        // setTimeout(() => setLoading(false), 2000);
        navigation.navigate('Verification');
    };

    // Gradient colors for selected role
    const gradientColors = ['#343E87', '#3448D6', '#343E87'];

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header with Logo */}
                    <View style={styles.headerContainer}>
                        <Image
                            source={require('../../../assets/images/brand.png')}
                            style={styles.logo}
                        />
                    </View>

                    {/* Choose Your Role */}
                    <ThemedText style={styles.roleTitle}>Choose Your Role</ThemedText>

                    {/* Role Selection Cards with Gradient */}
                    <View style={[styles.roleContainer]}>
                        {selectedRole === 'reader' ? (
                            <LinearGradient
                                colors={gradientColors}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={[styles.roleCard, styles.selectedRoleCard]}
                            >
                                <ThemedText style={[styles.roleText, { color: '#FFFFFF' }]}>
                                    Reader
                                </ThemedText>
                            </LinearGradient>
                        ) : (
                            <TouchableOpacity
                                style={[
                                    styles.roleCard,
                                    {
                                        backgroundColor: 'transparent',
                                    }
                                ]}
                                onPress={() => setSelectedRole('reader')}
                            >
                                <ThemedText style={[styles.roleText, { color: colors.text }]}>
                                    Reader
                                </ThemedText>
                            </TouchableOpacity>
                        )}

                        {selectedRole === 'writer' ? (
                            <LinearGradient
                                colors={gradientColors}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={[styles.roleCard, styles.selectedRoleCard]}
                            >
                                <ThemedText style={[styles.roleText, { color: '#FFFFFF' }]}>
                                    Writer
                                </ThemedText>
                            </LinearGradient>
                        ) : (
                            <TouchableOpacity
                                style={[
                                    styles.roleCard,
                                    {
                                        backgroundColor: 'transparent',
                                    }
                                ]}
                                onPress={() => setSelectedRole('writer')}
                            >
                                <ThemedText style={[styles.roleText, { color: colors.text }]}>
                                    Writer
                                </ThemedText>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Create new Account Title */}
                    <ThemedText style={styles.createAccountTitle}>Create new Account</ThemedText>
                    <ThemedText style={styles.createAccountSubtitle}>
                        Sign in to continue your account
                    </ThemedText>

                    {/* Name Field */}
                    <View style={styles.inputWrapper}>
                        <ThemedText style={styles.inputLabel}>Name</ThemedText>
                        <View style={[styles.inputContainer, { borderColor: colors.border }]}>
                            <Ionicons name="person-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                value={name}
                                onChangeText={setName}
                                placeholder="Enter your name"
                                placeholderTextColor={colors.textTertiary}
                                style={[
                                    styles.input,
                                    {
                                        color: colors.text,
                                        fontFamily: 'CoFoRaffineMedium',
                                        letterSpacing: 1
                                    }
                                ]}
                            />
                        </View>
                    </View>

                    {/* Email Field */}
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
                                        fontFamily: 'CoFoRaffineMedium',
                                        letterSpacing: 1
                                    }
                                ]}
                            />
                        </View>
                    </View>

                    {/* Password Field with Eye Icon */}
                    <View style={styles.inputWrapper}>
                        <ThemedText style={styles.inputLabel}>Password</ThemedText>
                        <View style={[styles.inputContainer, { borderColor: colors.border }]}>
                            <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                placeholder="********"
                                placeholderTextColor={colors.textTertiary}
                                secureTextEntry={!showPassword}
                                style={[
                                    styles.input,
                                    {
                                        color: colors.text,
                                        fontFamily: 'CoFoRaffineMedium',
                                        letterSpacing: 1
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

                    {/* Remember Me */}
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

                    {/* Continue Button */}
                    <GradientButton
                        title="Continue"
                        onPress={handleSignUp}
                        loading={loading}
                        variant="PRIMARY"
                        size="LARGE"
                        fullWidth={true}
                        style={styles.continueButton}
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

                    {/* Login Link */}
                    <View style={styles.loginContainer}>
                        <ThemedText style={styles.loginText}>
                            Already have an account?{' '}
                        </ThemedText>
                        <TouchableOpacity onPress={() => navigation.navigate('login')}>
                            <ThemedText style={[styles.loginLink, { color: colors.primary }]}>
                                Login
                            </ThemedText>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingVertical: 20,
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
        marginBottom: 32,
    },
    roleTitle: {
        fontSize: 32,
        fontWeight: '400',
        marginBottom: 12,
        fontFamily: 'CoFoRaffineBold',
        textAlign: 'center',
        letterSpacing: 1
    },
    roleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 4,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: '#0000001A',
        borderRadius: 50,
        padding: 4,
    },
    roleCard: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedRoleCard: {
        shadowColor: '#343E87',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    roleText: {
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        letterSpacing: 1
    },
    createAccountTitle: {
        fontSize: 26,
        fontWeight: '400',
        marginBottom: 4,
        fontFamily: 'CoFoRaffineMedium',
        textAlign: 'center',
        letterSpacing: 1
    },
    createAccountSubtitle: {
        fontSize: 14,
        fontWeight: '400',
        marginBottom: 24,
        fontFamily: 'tenez',
        textAlign: 'center',
        letterSpacing: 1
    },
    inputWrapper: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        fontFamily: 'CoFoRaffineBold',
        letterSpacing: 1
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
        fontSize: 16,
        fontFamily: 'CoFoRaffine',
        fontWeight: '400',
        letterSpacing: 1
    },
    rememberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
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
        fontFamily: 'CoFoRaffineMedium',
        letterSpacing: 1
    },
    continueButton: {
        marginBottom: 20,
    },
    orContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
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
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
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
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    loginText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'tenez',
        letterSpacing: 1
    },
    loginLink: {
        fontSize: 16,
        fontWeight: '600',
        // textDecorationLine: 'underline',
        fontFamily: 'tenez',
        letterSpacing: 1
    },
});