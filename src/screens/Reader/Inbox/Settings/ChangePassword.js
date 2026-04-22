import GradientButton from '@/src/components/GradientButton';
import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import authService from '../../../../services/authService';

export default function ChangePassword({ navigation }) {
    const { colors } = useTheme();

    // Form state
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleConfirmChanges = async () => {
        // Validate form
        if (!oldPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New password and confirm password do not match');
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long');
            return;
        }

        if (oldPassword === newPassword) {
            Alert.alert('Error', 'New password cannot be the same as old password');
            return;
        }

        setLoading(true);

        try {
            const result = await authService.readerChangePassword({
                oldPassword: oldPassword,
                newPassword: newPassword,
            });

            if (result.success) {
                Alert.alert('Success', 'Password changed successfully!');
                // Clear form
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                navigation.goBack();
            } else {
                Alert.alert('Error', result.error || 'Failed to change password');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            Alert.alert('Error', 'Failed to change password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <ThemedText style={styles.headerTitle}>Change Password</ThemedText>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Form Fields */}
                    <View style={styles.formContainer}>
                        {/* Old Password */}
                        <View style={styles.inputWrapper}>
                            <ThemedText style={styles.inputLabel}>Old Password</ThemedText>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="Enter your old password"
                                    placeholderTextColor="#999"
                                    value={oldPassword}
                                    onChangeText={setOldPassword}
                                    secureTextEntry={!showOldPassword}
                                />
                                <TouchableOpacity 
                                    style={styles.eyeIcon}
                                    onPress={() => setShowOldPassword(!showOldPassword)}
                                >
                                    <Ionicons 
                                        name={showOldPassword ? "eye-off-outline" : "eye-outline"} 
                                        size={20} 
                                        color="#999" 
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* New Password */}
                        <View style={styles.inputWrapper}>
                            <ThemedText style={styles.inputLabel}>New Password</ThemedText>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="Enter new password (min 6 characters)"
                                    placeholderTextColor="#999"
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    secureTextEntry={!showNewPassword}
                                />
                                <TouchableOpacity 
                                    style={styles.eyeIcon}
                                    onPress={() => setShowNewPassword(!showNewPassword)}
                                >
                                    <Ionicons 
                                        name={showNewPassword ? "eye-off-outline" : "eye-outline"} 
                                        size={20} 
                                        color="#999" 
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Confirm Password */}
                        <View style={styles.inputWrapper}>
                            <ThemedText style={styles.inputLabel}>Confirm Password</ThemedText>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="Confirm your new password"
                                    placeholderTextColor="#999"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirmPassword}
                                />
                                <TouchableOpacity 
                                    style={styles.eyeIcon}
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    <Ionicons 
                                        name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                                        size={20} 
                                        color="#999" 
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Password Requirements */}
                        <View style={styles.requirementsContainer}>
                            <ThemedText style={styles.requirementsTitle}>Password Requirements:</ThemedText>
                            <View style={styles.requirementItem}>
                                <Ionicons 
                                    name={newPassword.length >= 6 ? "checkmark-circle" : "ellipse-outline"} 
                                    size={16} 
                                    color={newPassword.length >= 6 ? "#4B59B3" : "#999"} 
                                />
                                <ThemedText style={styles.requirementText}>At least 6 characters</ThemedText>
                            </View>
                            <View style={styles.requirementItem}>
                                <Ionicons 
                                    name={newPassword !== oldPassword && newPassword ? "checkmark-circle" : "ellipse-outline"} 
                                    size={16} 
                                    color={newPassword !== oldPassword && newPassword ? "#4B59B3" : "#999"} 
                                />
                                <ThemedText style={styles.requirementText}>Different from old password</ThemedText>
                            </View>
                            <View style={styles.requirementItem}>
                                <Ionicons 
                                    name={newPassword === confirmPassword && confirmPassword ? "checkmark-circle" : "ellipse-outline"} 
                                    size={16} 
                                    color={newPassword === confirmPassword && confirmPassword ? "#4B59B3" : "#999"} 
                                />
                                <ThemedText style={styles.requirementText}>Passwords match</ThemedText>
                            </View>
                        </View>
                    </View>

                    {/* Confirm Changes Button */}
                    <GradientButton
                        title="Confirm Changes"
                        onPress={handleConfirmChanges}
                        loading={loading}
                        variant="PRIMARY"
                        size="LARGE"
                        fullWidth={true}
                        style={styles.confirmButton}
                        gradientColors={['#343E87', '#3448D6', '#343E87']}
                    />
                </ScrollView>
            </SafeAreaView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '400',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
    },
    scrollContent: {
        paddingBottom: 30,
    },
    formContainer: {
        paddingHorizontal: 16,
        paddingTop: 30,
        gap: 24,
    },
    inputWrapper: {
        gap: 8,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '400',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#C1D0E5',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    passwordInput: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#333',
    },
    eyeIcon: {
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    requirementsContainer: {
        marginTop: 8,
        padding: 16,
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        gap: 8,
    },
    requirementsTitle: {
        fontSize: 14,
        fontWeight: '500',
        fontFamily: 'CoFoRaffineMedium',
        color: '#666',
        marginBottom: 4,
    },
    requirementItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    requirementText: {
        fontSize: 12,
        fontFamily: 'tenez',
        color: '#666',
    },
    confirmButton: {
        paddingHorizontal: 16,
        marginTop: 40,
        marginBottom: 20,
    },
});