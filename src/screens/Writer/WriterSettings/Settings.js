import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useRole } from '@/src/context/RoleContext';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import authService from '../../../services/authService';

export default function Settings({ navigation }) {
    const { colors } = useTheme();
    const { clearUserRole } = useRole();
    const [profileImage, setProfileImage] = useState(null);
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        profileImage: null,
    });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Fetch user profile data
    const fetchUserProfile = async () => {
        try {
            // First try to get from AsyncStorage
            const userDataString = await AsyncStorage.getItem('userData');
            if (userDataString) {
                const parsedData = JSON.parse(userDataString);
                // Handle different response structures
                const user = parsedData.data || parsedData;
                setUserData({
                    name: user.name || '',
                    email: user.email || '',
                    profileImage: user.profileImage || null,
                });
                if (user.profileImage) {
                    setProfileImage(user.profileImage);
                }
            }
            
            // Then fetch fresh data from API
            const result = await authService.getWriterProfile();
            if (result.success && result.data) {
                const profile = result.data;
                setUserData({
                    name: profile.name || '',
                    email: profile.email || '',
                    profileImage: profile.profileImage || null,
                });
                if (profile.profileImage) {
                    setProfileImage(profile.profileImage);
                }
                // Update AsyncStorage
                await AsyncStorage.setItem('userData', JSON.stringify(profile));
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchUserProfile();
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please grant camera roll permissions to add a photo.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.3, // Compress image to avoid network issues
        });

        if (!result.canceled) {
            setUploading(true);
            try {
                // Upload image to server
                const formData = new FormData();
                const imageUri = result.assets[0].uri;
                const filename = imageUri.split('/').pop();
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : 'image/jpeg';
                
                formData.append('profileImage', {
                    uri: imageUri,
                    type: type,
                    name: filename || `profile_${Date.now()}.jpg`,
                });
                
                const uploadResult = await authService.updateProfileImage(formData);
                
                if (uploadResult.success) {
                    setProfileImage(result.assets[0].uri);
                    // Update userData with new image
                    setUserData(prev => ({
                        ...prev,
                        profileImage: result.assets[0].uri,
                    }));
                    Alert.alert('Success', 'Profile picture updated successfully!');
                    // Refresh profile data
                    await fetchUserProfile();
                } else {
                    Alert.alert('Error', uploadResult.error || 'Failed to update profile picture');
                }
            } catch (error) {
                console.error('Error uploading image:', error);
                Alert.alert('Error', 'Failed to upload image. Please try again.');
            } finally {
                setUploading(false);
            }
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Logout', 
                    onPress: async () => {
                        try {
                            await clearUserRole();
                            await AsyncStorage.removeItem('authToken');
                            await AsyncStorage.removeItem('userData');
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'login' }],
                            });
                        } catch (error) {
                            console.error('Logout error:', error);
                            Alert.alert('Error', 'Failed to logout. Please try again.');
                        }
                    },
                    style: 'destructive'
                }
            ]
        );
    };

    const handleNavigation = (screen) => {
        navigation.navigate(screen);
    };

    if (loading) {
        return (
            <ThemedView style={[styles.container, styles.centerContainer]}>
                <ActivityIndicator size="large" color="#4B59B3" />
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <ThemedText style={styles.headerTitle}>Profile & Settings</ThemedText>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView 
                    showsVerticalScrollIndicator={false} 
                    contentContainerStyle={styles.scrollContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    {/* Profile Section */}
                    <View style={styles.profileContainer}>
                        <View style={styles.profileImageContainer}>
                            <Image 
                                source={profileImage ? { uri: profileImage } : { uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' }} 
                                style={styles.profileImage} 
                            />
                            <TouchableOpacity 
                                style={styles.addPhotoButton} 
                                onPress={pickImage}
                                disabled={uploading}
                            >
                                {uploading ? (
                                    <ActivityIndicator size="small" color="#FFFFFF" />
                                ) : (
                                    <Ionicons name="camera" size={20} color="#FFFFFF" />
                                )}
                            </TouchableOpacity>
                        </View>
                        <View style={styles.profileInfo}>
                            <ThemedText style={styles.profileName}>{userData.name}</ThemedText>
                            <ThemedText style={styles.profileEmail}>{userData.email}</ThemedText>
                        </View>
                    </View>

                    {/* Personal Details Section */}
                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Personal Details</ThemedText>
                        
                        <TouchableOpacity 
                            style={styles.menuItem}
                            onPress={() => handleNavigation('EditProfile')}
                        >
                            <View style={styles.menuItemLeft}>
                                <Ionicons name="person-outline" size={20} color="#666" />
                                <ThemedText style={styles.menuItemText}>Edit Profile Details</ThemedText>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#999" />
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.menuItem}
                            onPress={() => handleNavigation('ChangePassword')}
                        >
                            <View style={styles.menuItemLeft}>
                                <Ionicons name="lock-closed-outline" size={20} color="#666" />
                                <ThemedText style={styles.menuItemText}>Change Password</ThemedText>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#999" />
                        </TouchableOpacity>
                    </View>

                    {/* Others Settings Section */}
                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Others Settings</ThemedText>
                        
                        <TouchableOpacity 
                            style={styles.menuItem}
                            onPress={() => handleNavigation('PrivacyPolicy')}
                        >
                            <View style={styles.menuItemLeft}>
                                <Ionicons name="shield-outline" size={20} color="#666" />
                                <ThemedText style={styles.menuItemText}>Privacy policy</ThemedText>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#999" />
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.menuItem}
                            onPress={() => handleNavigation('TermsConditions')}
                        >
                            <View style={styles.menuItemLeft}>
                                <Ionicons name="document-text-outline" size={20} color="#666" />
                                <ThemedText style={styles.menuItemText}>Terms & Conditions</ThemedText>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#999" />
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.menuItem}
                            onPress={() => handleNavigation('AboutUs')}
                        >
                            <View style={styles.menuItemLeft}>
                                <Ionicons name="information-circle-outline" size={20} color="#666" />
                                <ThemedText style={styles.menuItemText}>About Us</ThemedText>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#999" />
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[styles.menuItem, styles.logoutItem]}
                            onPress={handleLogout}
                        >
                            <View style={styles.menuItemLeft}>
                                <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
                                <ThemedText style={[styles.menuItemText, styles.logoutText]}>Logout</ThemedText>
                            </View>
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
        backgroundColor: '#FFFFFF',
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    centerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
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
    profileContainer: {
        alignItems: 'center',
        paddingVertical: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    profileImageContainer: {
        position: 'relative',
        marginBottom: 12,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#4B59B3',
    },
    addPhotoButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#4B59B3',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    profileInfo: {
        alignItems: 'center',
    },
    profileName: {
        fontSize: 24,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#666',
    },
    section: {
        marginTop: 24,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '400',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        marginBottom: 16,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    menuItemText: {
        fontSize: 16,
        fontFamily: 'CoFoRaffineMedium',
        color: '#333',
    },
    logoutItem: {
        borderBottomWidth: 0,
        marginTop: 8,
    },
    logoutText: {
        color: '#FF3B30',
    },
});