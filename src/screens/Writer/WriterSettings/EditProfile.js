import GradientButton from '@/src/components/GradientButton';
import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import authService from '../../../services/authService';

export default function EditProfile({ navigation }) {
    const { colors } = useTheme();

    // Form state
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [age, setAge] = useState('');
    const [address, setAddress] = useState('');
    const [bio, setBio] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [originalProfileImage, setOriginalProfileImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchingProfile, setFetchingProfile] = useState(true);

    // Fetch current profile data
    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            const result = await authService.getWriterProfile();
            if (result.success && result.data) {
                const userData = result.data;
                setFullName(userData.name || '');
                setEmail(userData.email || '');
                setPhoneNumber(userData.phoneNumber || '');
                setAge(userData.age ? userData.age.toString() : '');
                setAddress(userData.address || '');
                setBio(userData.bio || '');
                if (userData.profileImage) {
                    setOriginalProfileImage(userData.profileImage);
                }
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            Alert.alert('Error', 'Failed to load profile data');
        } finally {
            setFetchingProfile(false);
        }
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
            quality: 0.3, // Reduced from 0.8 to 0.3 to make image smaller
            base64: false,
        });

        if (!result.canceled) {
            // Get file info to check size
            const fileInfo = result.assets[0];
            console.log('Selected image size:', fileInfo.fileSize ? `${(fileInfo.fileSize / 1024).toFixed(2)} KB` : 'Unknown');
            
            setProfileImage(fileInfo);
        }
    };

    const compressImage = async (uri) => {
        // If you want to compress further, you can use this
        // For now, we're using the quality parameter above
        return uri;
    };

    const handleSaveChanges = async () => {
        // Validation
        if (!fullName.trim()) {
            Alert.alert('Error', 'Please enter your full name');
            return;
        }
        if (!email.trim()) {
            Alert.alert('Error', 'Please enter your email');
            return;
        }
        if (age && (isNaN(age) || age < 1 || age > 120)) {
            Alert.alert('Error', 'Please enter a valid age');
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            
            // Append text fields
            formData.append('name', fullName.trim());
            if (phoneNumber.trim()) formData.append('phoneNumber', phoneNumber.trim());
            if (bio.trim()) formData.append('bio', bio.trim());
            if (address.trim()) formData.append('address', address.trim());
            if (age) formData.append('age', parseInt(age));

            // Append profile image if changed
            if (profileImage) {
                // Get file extension
                const uri = profileImage.uri;
                const filename = uri.split('/').pop();
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : 'image/jpeg';
                
                formData.append('profileImage', {
                    uri: uri,
                    type: type,
                    name: filename || `profile_${Date.now()}.jpg`,
                });
            }

            console.log('Sending profile update request...');
            
            const result = await authService.updateWriterProfile(formData);
            
            if (result.success) {
                // Update local user data
                const userDataString = await AsyncStorage.getItem('userData');
                if (userDataString) {
                    const userData = JSON.parse(userDataString);
                    const updatedUserData = {
                        ...userData,
                        name: fullName.trim(),
                        phoneNumber: phoneNumber.trim(),
                        bio: bio.trim(),
                        address: address.trim(),
                        age: age ? parseInt(age) : null,
                        profileImage: result.data?.profileImage || originalProfileImage,
                    };
                    await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
                }
                
                Alert.alert('Success', 'Profile updated successfully!');
                navigation.goBack();
            } else {
                Alert.alert('Error', result.error || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', error.message || 'Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (fetchingProfile) {
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
                    <ThemedText style={styles.headerTitle}>Edit Profile Details</ThemedText>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Profile Image Section */}
                    <View style={styles.profileContainer}>
                        <View style={styles.profileImageContainer}>
                            <Image
                                source={{ uri: profileImage ? profileImage.uri : (originalProfileImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png') }}
                                style={styles.profileImage}
                            />
                            <TouchableOpacity style={styles.addPhotoButton} onPress={pickImage}>
                                <Ionicons name="camera" size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                        <ThemedText style={styles.imageHint}>
                            Tap camera icon to change profile picture
                        </ThemedText>
                    </View>

                    {/* Form Fields */}
                    <View style={styles.formContainer}>
                        {/* Full Name */}
                        <View style={styles.inputWrapper}>
                            <ThemedText style={styles.inputLabel}>Full Name *</ThemedText>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your full name"
                                placeholderTextColor="#999"
                                value={fullName}
                                onChangeText={setFullName}
                            />
                        </View>

                        {/* Email (Read-only) */}
                        <View style={styles.inputWrapper}>
                            <ThemedText style={styles.inputLabel}>Email</ThemedText>
                            <TextInput
                                style={[styles.input, styles.readOnlyInput]}
                                placeholder="Email"
                                placeholderTextColor="#999"
                                value={email}
                                editable={false}
                            />
                        </View>

                        {/* Phone Number */}
                        <View style={styles.inputWrapper}>
                            <ThemedText style={styles.inputLabel}>Phone Number</ThemedText>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your phone number"
                                placeholderTextColor="#999"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                keyboardType="phone-pad"
                            />
                        </View>

                        {/* Your Age */}
                        <View style={styles.inputWrapper}>
                            <ThemedText style={styles.inputLabel}>Your Age</ThemedText>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your age"
                                placeholderTextColor="#999"
                                value={age}
                                onChangeText={setAge}
                                keyboardType="numeric"
                            />
                        </View>

                        {/* Address */}
                        <View style={styles.inputWrapper}>
                            <ThemedText style={styles.inputLabel}>Address</ThemedText>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your address"
                                placeholderTextColor="#999"
                                value={address}
                                onChangeText={setAddress}
                            />
                        </View>

                        {/* Bio */}
                        <View style={styles.inputWrapper}>
                            <ThemedText style={styles.inputLabel}>Bio</ThemedText>
                            <TextInput
                                style={[styles.input, styles.bioInput]}
                                placeholder="Tell us about yourself"
                                placeholderTextColor="#999"
                                value={bio}
                                onChangeText={setBio}
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                        </View>
                    </View>

                    {/* Save Button */}
                    <View style={styles.saveButtonContainer}>
                        <GradientButton
                            title="Save Changes"
                            onPress={handleSaveChanges}
                            loading={loading}
                            variant="PRIMARY"
                            size="LARGE"
                            fullWidth={true}
                            style={styles.saveButton}
                            gradientColors={['#343E87', '#3448D6', '#343E87']}
                        />
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
        flex: 1,
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
    },
    profileImageContainer: {
        position: 'relative',
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
    imageHint: {
        fontSize: 12,
        fontFamily: 'tenez',
        color: '#999',
        marginTop: 8,
    },
    formContainer: {
        paddingHorizontal: 16,
        paddingTop: 20,
        gap: 20,
    },
    inputWrapper: {
        gap: 4,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '400',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
    },
    input: {
        borderWidth: 1,
        borderColor: '#C1D0E5',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#333',
        backgroundColor: '#fff',
    },
    readOnlyInput: {
        backgroundColor: '#F5F5F5',
        color: '#999',
    },
    bioInput: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    saveButtonContainer: {
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    saveButton: {
        width: '100%',
    },
});