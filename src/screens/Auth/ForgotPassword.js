import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GradientButton from '../../components/GradientButton';
import {
  ThemedText,
  ThemedView
} from '../../components/ThemedComponents';
import { useTheme } from '../../hooks/useTheme';

export default function ForgotPassword() {
    const { colors } = useTheme();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const navigation = useNavigation();

    const handleContinue = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            // Navigate to verification screen
            navigation.navigate('FPVerification');
        }, 2000);
    };

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Back Button */}
                    <TouchableOpacity 
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>

                    {/* Header with Logo */}
                    <View style={styles.headerContainer}>
                        <Image
                            source={require('../../../assets/images/brand.png')}
                            style={styles.logo}
                        />
                    </View>

                    {/* Title */}
                    <ThemedText style={styles.title}>Reset Password</ThemedText>

                    {/* Description */}
                    <ThemedText style={styles.description}>
                        Enter your email, we will send a verification code to your email.
                    </ThemedText>

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

                    {/* Continue Button */}
                    <GradientButton
                        title="Continue"
                        onPress={handleContinue}
                        loading={loading}
                        variant="PRIMARY"
                        size="LARGE"
                        fullWidth={true}
                        style={styles.continueButton}
                        disabled={!email.trim()} // Disable if email is empty
                    />

                    {/* Additional Info */}
                    {/* <View style={styles.infoContainer}>
                        <ThemedText style={styles.infoText}>
                            We'll send a 4-digit verification code to your email.
                        </ThemedText>
                    </View> */}

                    {/* Back to Login Link */}
                    {/* <View style={styles.loginContainer}>
                        <ThemedText style={styles.loginText}>
                            Remember your password?{' '}
                        </ThemedText>
                        <TouchableOpacity onPress={() => navigation.navigate('login')}>
                            <ThemedText style={[styles.loginLink, { color: colors.primary }]}>
                                Login
                            </ThemedText>
                        </TouchableOpacity>
                    </View> */}
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
    backButton: {
        marginBottom: 20,
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
    title: {
        fontSize: 32,
        fontWeight: '400',
        marginBottom: 12,
        fontFamily: 'CoFoRaffineMedium',
        textAlign: 'center',
        letterSpacing: 1,
    },
    description: {
        fontSize: 16,
        fontWeight: '400',
        marginBottom: 32,
        fontFamily: 'tenez',
        textAlign: 'center',
        paddingHorizontal: 20,
        lineHeight: 24,
        color: '#000000'
    },
    inputWrapper: {
        marginBottom: 30,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '400',
        marginBottom: 4,
        fontFamily: 'CoFoRaffineBold',
        letterSpacing: 1,
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
        fontFamily: 'CoFoRaffineMedium',
        letterSpacing: 1,
    },
    continueButton: {
        marginBottom: 20,
    },
    infoContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    infoText: {
        fontSize: 14,
        fontWeight: '400',
        fontFamily: 'CoFoRaffineMedium',
        textAlign: 'center',
        opacity: 0.7,
        letterSpacing: 0.5,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    loginText: {
        fontSize: 16,
        fontWeight: '400',
        fontFamily: 'CoFoRaffineMedium',
        letterSpacing: 0.5,
    },
    loginLink: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        letterSpacing: 0.5,
    },
});