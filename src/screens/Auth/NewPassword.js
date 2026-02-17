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

export default function NewPassword() {
    const { colors } = useTheme();
    const [loading, setLoading] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigation = useNavigation();

    const handleContinue = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            // Navigate to success screen or login
            navigation.navigate('login');
        }, 2000);
    };

    // Check if passwords match and are not empty
    const isValid = newPassword.length > 0 && 
                    confirmPassword.length > 0 && 
                    newPassword === confirmPassword;

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Back Button */}
                    <TouchableOpacity 
                        onPress={() => navigation.goBack()} 
                        style={styles.backButton}
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
                    <ThemedText style={styles.title}>Create New Password</ThemedText>

                    {/* Description */}
                    <ThemedText style={styles.description}>
                        Your password must be different from previous used password.
                    </ThemedText>

                    {/* New Password Field */}
                    <View style={styles.inputWrapper}>
                        <ThemedText style={styles.inputLabel}>New Password</ThemedText>
                        <View style={[styles.inputContainer, { borderColor: colors.border }]}>
                            <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                value={newPassword}
                                onChangeText={setNewPassword}
                                placeholder="*********"
                                placeholderTextColor={colors.textTertiary}
                                secureTextEntry={!showNewPassword}
                                style={[
                                    styles.input,
                                    {
                                        color: colors.text,
                                        fontFamily: 'CoFoRaffineMedium',
                                        letterSpacing: 1
                                    }
                                ]}
                            />
                            <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                                <Ionicons
                                    name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                                    size={20}
                                    color={colors.textSecondary}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Confirm Password Field */}
                    <View style={styles.inputWrapper}>
                        <ThemedText style={styles.inputLabel}>Confirm Password</ThemedText>
                        <View style={[styles.inputContainer, { borderColor: colors.border }]}>
                            <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder="*********"
                                placeholderTextColor={colors.textTertiary}
                                secureTextEntry={!showConfirmPassword}
                                style={[
                                    styles.input,
                                    {
                                        color: colors.text,
                                        fontFamily: 'CoFoRaffineMedium',
                                        letterSpacing: 1
                                    }
                                ]}
                            />
                            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                <Ionicons
                                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                                    size={20}
                                    color={colors.textSecondary}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Password Match Indicator */}
                    {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                        <View style={styles.errorContainer}>
                            <Ionicons name="alert-circle-outline" size={16} color="#EE1F24" />
                            <ThemedText style={styles.errorText}>
                                Passwords do not match
                            </ThemedText>
                        </View>
                    )}

                    {/* Continue Button */}
                    <GradientButton
                        title="Continue"
                        onPress={handleContinue}
                        loading={loading}
                        variant="PRIMARY"
                        size="LARGE"
                        fullWidth={true}
                        style={styles.continueButton}
                        disabled={!isValid} // Disable if passwords don't match or are empty
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
        letterSpacing: 2,
    },
    description: {
        fontSize: 14,
        fontWeight: '400',
        marginBottom: 32,
        fontFamily: 'tenez',
        textAlign: 'center',
        paddingHorizontal: 20,
        lineHeight: 20,
        letterSpacing: 1,
    },
    inputWrapper: {
        marginBottom: 20,
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
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        marginTop: -8,
    },
    errorText: {
        fontSize: 12,
        color: '#EE1F24',
        marginLeft: 6,
        fontFamily: 'tenez',
        letterSpacing: 0.5,
    },
    continueButton: {
        marginTop: 20,
    },
});