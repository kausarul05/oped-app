import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
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
import podcastService from '../../../services/podcastService';

export default function AddPodcast({ navigation }) {
    const { colors } = useTheme();
    const [audioFile, setAudioFile] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [episodeDescription, setEpisodeDescription] = useState('');
    const [category, setCategory] = useState('politics');
    const [tags, setTags] = useState('');
    const [audioDuration, setAudioDuration] = useState('');
    const [isPremium, setIsPremium] = useState(false);
    const [loading, setLoading] = useState(false);

    const categories = [
        { label: 'Politics', value: 'politics' },
        { label: 'Technology', value: 'technology' },
        { label: 'Business', value: 'business' },
        { label: 'Culture', value: 'culture' },
        { label: 'Travel', value: 'travel' },
        { label: 'Finance', value: 'finance' },
    ];

    const pickAudioFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['audio/mpeg', 'audio/wav', 'audio/mp3'],
                copyToCacheDirectory: true
            });

            if (result.assets && result.assets[0]) {
                const file = result.assets[0];
                if (file.size && file.size > 100 * 1024 * 1024) {
                    Alert.alert('Error', 'File must be less than 100MB');
                    return;
                }
                setAudioFile(file);
            }
        } catch (error) {
            console.log('Error picking audio:', error);
        }
    };

    const pickCoverImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please grant camera roll permissions to upload an image.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setCoverImage(result.assets[0]);
        }
    };

    const handlePublish = async () => {
        // Validation
        // if (!audioFile) {
        //     Alert.alert('Error', 'Please upload an audio file');
        //     return;
        // }
        if (!coverImage) {
            Alert.alert('Error', 'Please upload a cover image');
            return;
        }
        if (!title.trim()) {
            Alert.alert('Error', 'Please enter a title');
            return;
        }
        if (!summary.trim()) {
            Alert.alert('Error', 'Please enter a summary');
            return;
        }
        if (!episodeDescription.trim()) {
            Alert.alert('Error', 'Please enter episode description');
            return;
        }
        if (!audioDuration.trim()) {
            Alert.alert('Error', 'Please enter audio duration');
            return;
        }

        setLoading(true);

        try {
            // Create FormData
            const formData = new FormData();
            
            // Append text fields
            formData.append('title', title.trim());
            formData.append('summary', summary.trim());
            formData.append('aboutEpisode', episodeDescription.trim());
            formData.append('audioDuration', parseInt(audioDuration));
            formData.append('category', category);
            formData.append('isPremium', isPremium);
            
            // Append tags as JSON string
            const tagsArray = tags.split(',').map(tag => tag.trim());
            formData.append('tags', JSON.stringify(tagsArray));
            
            // Append audio file
            formData.append('audioFile', {
                uri: audioFile.uri,
                type: audioFile.mimeType || 'audio/mpeg',
                name: audioFile.name || 'audio.mp3',
            });
            
            // Append cover image
            formData.append('coverImage', {
                uri: coverImage.uri,
                type: coverImage.mimeType || 'image/jpeg',
                name: coverImage.fileName || 'cover.jpg',
            });

            const result = await podcastService.createPodcast(formData);
            
            if (result.success) {
                Alert.alert('Success', 'Podcast published successfully!');
                navigation.goBack();
            } else {
                Alert.alert('Error', result.error || 'Failed to publish podcast');
            }
        } catch (error) {
            console.error('Error publishing podcast:', error);
            Alert.alert('Error', 'Failed to publish podcast. Please try again.');
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
                    <ThemedText style={styles.headerTitle}>Add Podcast</ThemedText>
                    <TouchableOpacity
                        style={styles.publishButton}
                        onPress={handlePublish}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <ThemedText style={styles.publishText}>Send to Editor</ThemedText>
                        )}
                    </TouchableOpacity>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Upload Audio File Section */}
                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Upload Audio File *</ThemedText>

                        <TouchableOpacity
                            style={styles.uploadBox}
                            onPress={pickAudioFile}
                        >
                            {audioFile ? (
                                <View style={styles.fileInfoContainer}>
                                    <Ionicons name="musical-notes" size={32} color="#4B59B3" />
                                    <ThemedText style={styles.fileName} numberOfLines={1}>
                                        {audioFile.name}
                                    </ThemedText>
                                    <ThemedText style={styles.fileSize}>
                                        {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                                    </ThemedText>
                                </View>
                            ) : (
                                <>
                                    <View style={styles.uploadIconContainer}>
                                        <Ionicons name="cloud-upload-outline" size={32} color="#999" />
                                    </View>
                                    <ThemedText style={styles.uploadText}>Upload Audio</ThemedText>
                                    <ThemedText style={styles.uploadHint}>
                                        MP3 or WAV format, max 100MB
                                    </ThemedText>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Upload Cover Section */}
                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Upload Cover *</ThemedText>

                        <TouchableOpacity
                            style={styles.uploadBox}
                            onPress={pickCoverImage}
                        >
                            {coverImage ? (
                                <Image source={{ uri: coverImage.uri }} style={styles.uploadedImage} />
                            ) : (
                                <>
                                    <View style={styles.uploadIconContainer}>
                                        <Ionicons name="image-outline" size={32} color="#999" />
                                    </View>
                                    <ThemedText style={styles.uploadText}>Upload Cover</ThemedText>
                                    <ThemedText style={styles.uploadHint}>
                                        JPG or PNG format, minimum 300x300 pixels
                                    </ThemedText>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Title Section */}
                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Title *</ThemedText>
                        <TextInput
                            style={styles.titleInput}
                            placeholder="Enter podcast title"
                            placeholderTextColor="#999"
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>

                    {/* Summary Section */}
                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Summary *</ThemedText>
                        <TextInput
                            style={styles.summaryInput}
                            placeholder="Enter podcast summary (max 150 characters)"
                            placeholderTextColor="#999"
                            value={summary}
                            onChangeText={setSummary}
                            multiline
                            numberOfLines={3}
                            maxLength={150}
                        />
                        <ThemedText style={styles.charCount}>{summary.length}/150</ThemedText>
                    </View>

                    {/* About Episode Section */}
                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>About this episode *</ThemedText>
                        <TextInput
                            style={styles.episodeInput}
                            placeholder="Enter episode description..."
                            placeholderTextColor="#999"
                            value={episodeDescription}
                            onChangeText={setEpisodeDescription}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </View>

                    {/* Audio Duration Section */}
                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Audio Duration (minutes) *</ThemedText>
                        <TextInput
                            style={styles.titleInput}
                            placeholder="Enter duration in minutes (e.g., 6)"
                            placeholderTextColor="#999"
                            value={audioDuration}
                            onChangeText={setAudioDuration}
                            keyboardType="numeric"
                        />
                    </View>

                    {/* Category Section */}
                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Category *</ThemedText>
                        <View style={styles.categoryContainer}>
                            {categories.map((cat) => (
                                <TouchableOpacity
                                    key={cat.value}
                                    style={[
                                        styles.categoryChip,
                                        category === cat.value && styles.categoryChipActive
                                    ]}
                                    onPress={() => setCategory(cat.value)}
                                >
                                    <ThemedText
                                        style={[
                                            styles.categoryText,
                                            category === cat.value && styles.categoryTextActive
                                        ]}
                                    >
                                        {cat.label}
                                    </ThemedText>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Tags Section */}
                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Tags</ThemedText>
                        <TextInput
                            style={styles.titleInput}
                            placeholder="Enter tags separated by commas (e.g., politics, nato, turkey)"
                            placeholderTextColor="#999"
                            value={tags}
                            onChangeText={setTags}
                        />
                        <ThemedText style={styles.uploadHint}>
                            Separate multiple tags with commas
                        </ThemedText>
                    </View>

                    {/* Premium Section */}
                    {/* <View style={styles.section}>
                        <View style={styles.premiumContainer}>
                            <ThemedText style={styles.sectionTitle}>Premium Content</ThemedText>
                            <Switch
                                value={isPremium}
                                onValueChange={setIsPremium}
                                trackColor={{ false: '#E0E0E0', true: '#4B59B3' }}
                                thumbColor={isPremium ? '#FFFFFF' : '#FFFFFF'}
                            />
                        </View>
                        <ThemedText style={styles.uploadHint}>
                            Enable if this podcast is for premium users only
                        </ThemedText>
                    </View> */}
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
        letterSpacing: 1
    },
    publishButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#4B59B3',
        borderRadius: 20,
        minWidth: 80,
        alignItems: 'center',
    },
    publishText: {
        fontSize: 14,
        fontFamily: 'CoFoRaffineBold',
        color: '#FFFFFF',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 30,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        marginBottom: 8,
        letterSpacing: 1
    },
    uploadBox: {
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderStyle: 'dashed',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 120,
    },
    uploadIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F0F3FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    uploadText: {
        fontSize: 14,
        fontFamily: 'CoFoRaffineMedium',
        color: '#4B59B3',
    },
    uploadHint: {
        fontSize: 12,
        fontFamily: 'tenez',
        color: '#999',
        marginTop: 4,
    },
    fileInfoContainer: {
        alignItems: 'center',
        gap: 4,
    },
    fileName: {
        fontSize: 13,
        fontFamily: 'CoFoRaffineMedium',
        color: '#4B59B3',
        marginTop: 4,
        maxWidth: 200,
    },
    fileSize: {
        fontSize: 12,
        fontFamily: 'tenez',
        color: '#666',
    },
    uploadedImage: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        resizeMode: 'cover',
    },
    titleInput: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#333',
        backgroundColor: '#F8F9FA',
    },
    summaryInput: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#333',
        backgroundColor: '#F8F9FA',
        minHeight: 80,
        textAlignVertical: 'top',
    },
    episodeInput: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#333',
        backgroundColor: '#F8F9FA',
        minHeight: 120,
        textAlignVertical: 'top',
    },
    charCount: {
        fontSize: 12,
        fontFamily: 'tenez',
        color: '#999',
        textAlign: 'right',
        marginTop: 4,
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: '#FFFFFF',
    },
    categoryChipActive: {
        backgroundColor: '#4B59B3',
        borderColor: '#4B59B3',
    },
    categoryText: {
        fontSize: 14,
        fontFamily: 'CoFoRaffineMedium',
        color: '#666',
    },
    categoryTextActive: {
        color: '#FFFFFF',
    },
    premiumContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});