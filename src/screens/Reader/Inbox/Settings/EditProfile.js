import GradientButton from '@/src/components/GradientButton';
import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
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
import authService from '../../../../services/authService';

export default function EditProfile({ navigation }) {
    const { colors } = useTheme();

    // Form state
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [age, setAge] = useState('');
    const [city, setCity] = useState('');
    const [bio, setBio] = useState('');
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [profileImage, setProfileImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchingProfile, setFetchingProfile] = useState(true);
    const [originalProfileImage, setOriginalProfileImage] = useState(null);

    // Interests data
    const interests = [
        'Technology',
        'Sports',
        'Travel',
        'Business',
        'Politics',
        'Culture',
        'Finance',
        'Health',
        'Entertainment',
        'Science',
    ];

    // Fetch user profile data using authService
    const fetchUserProfile = async () => {
        try {
            const result = await authService.getReaderProfile();
            
            if (result.success && result.data) {
                const profile = result.data;
                setFullName(profile.name || '');
                setEmail(profile.email || '');
                setPhoneNumber(profile.phoneNumber || '');
                setAge(profile.age ? profile.age.toString() : '');
                setCity(profile.city || '');
                setBio(profile.bio || '');
                setSelectedInterests(profile.interests || []);
                if (profile.profileImage) {
                    setProfileImage(profile.profileImage);
                    setOriginalProfileImage(profile.profileImage);
                }
            } else {
                Alert.alert('Error', result.error || 'Failed to load profile data');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            Alert.alert('Error', 'Failed to load profile data');
        } finally {
            setFetchingProfile(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const toggleInterest = (interest) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter(item => item !== interest));
        } else {
            setSelectedInterests([...selectedInterests, interest]);
        }
    };

    const pickImage = async () => {
        // Request permission
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please grant camera roll permissions to add a photo.');
            return;
        }

        // Launch image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const handleSaveChanges = async () => {
        // Validate form
        if (!fullName.trim()) {
            Alert.alert('Error', 'Please enter your full name');
            return;
        }

        if (!email.trim()) {
            Alert.alert('Error', 'Please enter your email');
            return;
        }

        if (!phoneNumber.trim()) {
            Alert.alert('Error', 'Please enter your phone number');
            return;
        }

        setLoading(true);

        try {
            // Create form data for multipart upload
            const formData = new FormData();
            
            // Add text fields
            formData.append('name', fullName);
            formData.append('email', email);
            formData.append('phoneNumber', phoneNumber);
            formData.append('age', age);
            formData.append('city', city);
            formData.append('bio', bio);
            
            // Add interests as JSON string
            formData.append('interests', JSON.stringify(selectedInterests));
            
            // Add profile image if changed
            if (profileImage && profileImage !== originalProfileImage) {
                const filename = profileImage.split('/').pop();
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : 'image/jpeg';
                
                formData.append('profileImage', {
                    uri: profileImage,
                    name: filename,
                    type: type,
                });
            }

            const result = await authService.updateReaderProfile(formData);

            if (result.success) {
                Alert.alert('Success', 'Profile updated successfully!');
                navigation.goBack();
            } else {
                Alert.alert('Error', result.error || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', 'Failed to update profile');
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
                                source={profileImage ? { uri: profileImage } : { uri: 'https://t4.ftcdn.net/jpg/06/08/55/73/360_F_608557356_ELcD2pwQO9pduTRL30umabzgJoQn5fnd.jpg' }}
                                style={styles.profileImage}
                            />
                            <TouchableOpacity style={styles.addPhotoButton} onPress={pickImage}>
                                <Ionicons name="camera" size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Form Fields */}
                    <View style={styles.formContainer}>
                        {/* Full Name */}
                        <View style={styles.inputWrapper}>
                            <ThemedText style={styles.inputLabel}>Full Name</ThemedText>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your full name"
                                placeholderTextColor="#999"
                                value={fullName}
                                onChangeText={setFullName}
                            />
                        </View>

                        {/* Email */}
                        <View style={styles.inputWrapper}>
                            <ThemedText style={styles.inputLabel}>Email</ThemedText>
                            <TextInput
                                style={[styles.input, styles.disabledInput]}
                                placeholder="Enter your email"
                                placeholderTextColor="#999"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
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

                        {/* Bio */}
                        <View style={styles.inputWrapper}>
                            <ThemedText style={styles.inputLabel}>Bio</ThemedText>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Tell us about yourself"
                                placeholderTextColor="#999"
                                value={bio}
                                onChangeText={setBio}
                                multiline
                                numberOfLines={3}
                                textAlignVertical="top"
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

                        {/* City */}
                        <View style={styles.inputWrapper}>
                            <ThemedText style={styles.inputLabel}>City</ThemedText>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your city"
                                placeholderTextColor="#999"
                                value={city}
                                onChangeText={setCity}
                            />
                        </View>

                        {/* My Interests */}
                        <View style={styles.inputWrapper}>
                            <ThemedText style={styles.inputLabel}>My Interests</ThemedText>
                            <ThemedText style={styles.interestDescription}>
                                Choose topics you like to see in your feed
                            </ThemedText>

                            <View style={styles.interestsContainer}>
                                {interests.map((interest) => (
                                    <TouchableOpacity
                                        key={interest}
                                        style={[
                                            styles.interestChip,
                                            selectedInterests.includes(interest) && styles.interestChipSelected
                                        ]}
                                        onPress={() => toggleInterest(interest)}
                                    >
                                        <ThemedText
                                            style={[
                                                styles.interestText,
                                                selectedInterests.includes(interest) && styles.interestTextSelected
                                            ]}
                                        >
                                            {interest}
                                        </ThemedText>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* Save Button */}
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
    disabledInput: {
        backgroundColor: '#F5F5F5',
        color: '#999',
    },
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    interestDescription: {
        fontSize: 12,
        fontFamily: 'tenez',
        color: '#666',
        marginBottom: 8,
    },
    interestsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    interestChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: '#FFFFFF',
    },
    interestChipSelected: {
        backgroundColor: '#4B59B3',
        borderColor: '#4B59B3',
    },
    interestText: {
        fontSize: 13,
        fontFamily: 'CoFoRaffineMedium',
        color: '#666',
    },
    interestTextSelected: {
        color: '#FFFFFF',
    },
    saveButton: {
        marginTop: 30,
        marginBottom: 20,
        paddingHorizontal: 16,
    },
});