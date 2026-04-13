import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GradientButton from '../../components/GradientButton';
import {
  ThemedText,
  ThemedView
} from '../../components/ThemedComponents';
import { useRole } from '../../context/RoleContext';
import { useTheme } from '../../hooks/useTheme';
import authService from '../../services/authService';

export default function Verification() {
    const { colors } = useTheme();
    const { saveUserRole } = useRole();
    const route = useRoute();
    const navigation = useNavigation();
    const { email, role } = route.params || {};
    
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState(['', '', '', '']);
    const [timer, setTimer] = useState(59);
    const [canResend, setCanResend] = useState(false);
    
    const inputRefs = useRef([]);

    // Timer effect
    useEffect(() => {
        let interval = null;
        if (timer > 0 && !canResend) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (timer === 0) {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [timer, canResend]);

    const handleCodeChange = (text, index) => {
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);

        // Auto-focus next input
        if (text && index < 3) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyPress = (e, index) => {
        // Handle backspace to focus previous input
        if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleResendCode = async () => {
        if (canResend && email) {
            try {
                setLoading(true);
                const result = await authService.resendOTP(email);
                if (result.success) {
                    setTimer(59);
                    setCanResend(false);
                    Alert.alert('Success', 'Verification code resent!');
                } else {
                    Alert.alert('Error', result.error);
                }
            } catch (error) {
                Alert.alert('Error', 'Failed to resend code');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleVerify = async () => {
        const otpCode = code.join('');
        
        if (otpCode.length !== 4) {
            Alert.alert('Error', 'Please enter the 4-digit verification code');
            return;
        }

        if (!email) {
            Alert.alert('Error', 'Email not found. Please sign up again.');
            navigation.navigate('SignUp');
            return;
        }

        setLoading(true);

        try {
            const result = await authService.verifyOTP(email, otpCode);
            
            if (result.success) {
                // Save user role
                if (role) {
                    await saveUserRole(role);
                }
                
                // Clear temporary email
                await AsyncStorage.removeItem('tempEmail');
                
                Alert.alert('Success', 'Email verified successfully!');
                // Navigation will be handled automatically by RootNavigator
            } else {
                Alert.alert('Verification Failed', result.error || 'Invalid verification code');
                // Clear the entered code
                setCode(['', '', '', '']);
                // Focus on first input
                inputRefs.current[0]?.focus();
            }
        } catch (error) {
            console.error('Verification error:', error);
            Alert.alert('Error', 'Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Back Button */}
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
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
                    <ThemedText style={styles.title}>Verification Code</ThemedText>
                    
                    {/* Description */}
                    <ThemedText style={styles.description}>
                        Enter the verification code that we have sent to your email.
                    </ThemedText>

                    {/* OTP Input Fields */}
                    <View style={styles.otpContainer}>
                        {[0, 1, 2, 3].map((index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => (inputRefs.current[index] = ref)}
                                style={[
                                    styles.otpInput,
                                    {
                                        borderColor: code[index] ? colors.primary : colors.border,
                                        color: colors.text,
                                        backgroundColor: colors.inputBackground,
                                    }
                                ]}
                                maxLength={1}
                                keyboardType="number-pad"
                                value={code[index]}
                                onChangeText={(text) => handleCodeChange(text, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                selectTextOnFocus
                            />
                        ))}
                    </View>

                    {/* Resend Links Container */}
                    <View style={styles.resendContainer}>
                        <View style={styles.resendRow}>
                            <ThemedText style={styles.resendText}>
                                Didn't receive the code?{' '}
                            </ThemedText>
                            <TouchableOpacity 
                                onPress={handleResendCode}
                                disabled={!canResend || loading}
                            >
                                <ThemedText 
                                    style={[
                                        styles.resendLink,
                                        { 
                                            color: canResend ? '#EE1F24' : colors.textTertiary,
                                            opacity: canResend ? 1 : 0.5
                                        }
                                    ]}
                                >
                                    Resend code
                                </ThemedText>
                            </TouchableOpacity>
                        </View>

                        {/* Timer */}
                        {!canResend && (
                            <ThemedText style={styles.timerText}>
                                Resend code at 00:{timer.toString().padStart(2, '0')}
                            </ThemedText>
                        )}
                    </View>

                    {/* Continue Button */}
                    <GradientButton
                        title="Continue"
                        onPress={handleVerify}
                        loading={loading}
                        variant="PRIMARY"
                        size="LARGE"
                        fullWidth={true}
                        style={styles.continueButton}
                        disabled={code.some(digit => digit === '') || loading}
                    />
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
        fontSize: 24,
        fontWeight: '400',
        marginBottom: 12,
        fontFamily: 'CoFoRaffineBold',
        textAlign: 'center',
        letterSpacing: 2
    },
    description: {
        fontSize: 16,
        fontWeight: '400',
        marginBottom: 40,
        fontFamily: 'tenez',
        textAlign: 'center',
        paddingHorizontal: 20,
        letterSpacing: 1
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 30,
        gap: 12,
    },
    otpInput: {
        width: 60,
        height: 60,
        borderWidth: 1,
        borderRadius: 12,
        textAlign: 'center',
        fontSize: 24,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
    },
    resendContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    resendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    resendText: {
        fontSize: 14,
        fontWeight: '400',
        fontFamily: 'tenez',
        letterSpacing: 1,
    },
    resendLink: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'tenez',
        color: '#EE1F24'
    },
    timerText: {
        fontSize: 14,
        fontWeight: '400',
        fontFamily: 'tenez',
        letterSpacing: 1,
    },
    continueButton: {
        marginTop: 20,
        fontFamily: 'CoFoRaffineBold',
        fontWeight: '400'
    },
});