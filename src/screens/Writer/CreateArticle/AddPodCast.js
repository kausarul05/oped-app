import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddPodcast({ navigation }) {
    const { colors } = useTheme();
    const [audioFile, setAudioFile] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [episodeDescription, setEpisodeDescription] = useState('');

    const pickAudioFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['audio/mpeg', 'audio/wav', 'audio/mp3'],
                copyToCacheDirectory: true
            });

            if (result.assets && result.assets[0]) {
                const file = result.assets[0];
                // Check file size (100MB = 100 * 1024 * 1024 bytes)
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
            quality: 1,
        });

        if (!result.canceled) {
            setCoverImage(result.assets[0].uri);
        }
    };

    const handlePublish = () => {
        if (!audioFile) {
            Alert.alert('Error', 'Please upload an audio file');
            return;
        }
        if (!coverImage) {
            Alert.alert('Error', 'Please upload a cover image');
            return;
        }
        if (!title.trim()) {
            Alert.alert('Error', 'Please enter a title');
            return;
        }
        Alert.alert('Success', 'Podcast published successfully!');
        navigation.goBack();
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
                    >
                        <ThemedText style={styles.publishText}>Publish</ThemedText>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Upload Audio File Section */}
                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Upload Audio File</ThemedText>

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
                                        {audioFile.size ? (audioFile.size / (1024 * 1024)).toFixed(2) : '0'} MB
                                    </ThemedText>
                                </View>
                            ) : (
                                <>
                                    <View style={styles.uploadIconContainer}>
                                        <Ionicons name="cloud-upload-outline" size={32} color="#4B59B3" />
                                    </View>
                                    <ThemedText style={styles.uploadText}>Upload Audio</ThemedText>
                                    <ThemedText style={styles.uploadHint}>
                                        File must be in MP3 or WAV format and less than 100MB.
                                    </ThemedText>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Upload Cover Section */}
                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Upload Cover</ThemedText>

                        <TouchableOpacity
                            style={styles.uploadBox}
                            onPress={pickCoverImage}
                        >
                            {coverImage ? (
                                <Image source={{ uri: coverImage }} style={styles.uploadedImage} />
                            ) : (
                                <>
                                    <View style={styles.uploadIconContainer}>
                                        <Ionicons name="image-outline" size={32} color="#4B59B3" />
                                    </View>
                                    <ThemedText style={styles.uploadText}>Upload Cover</ThemedText>
                                    <ThemedText style={styles.uploadHint}>
                                        Image must be in JPG or PNG format and at least 300*300 pixels.
                                    </ThemedText>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Title Section */}
                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Title</ThemedText>
                        <TextInput
                            style={styles.titleInput}
                            placeholder="Enter your story title"
                            placeholderTextColor="#999"
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>

                    {/* Summary Section */}
                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Summary</ThemedText>
                        <TextInput
                            style={styles.summaryInput}
                            placeholder="Enter your article summary"
                            placeholderTextColor="#999"
                            value={summary}
                            onChangeText={setSummary}
                            multiline
                            numberOfLines={3}
                        />
                    </View>

                    {/* About this episode Section */}
                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>About this episode</ThemedText>
                        <TextInput
                            style={styles.episodeInput}
                            placeholder="Enter your episode description..."
                            placeholderTextColor="#999"
                            value={episodeDescription}
                            onChangeText={setEpisodeDescription}
                            multiline
                            numberOfLines={6}
                            textAlignVertical="top"
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
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        marginBottom: 4,
        letterSpacing: 1
    },
    uploadBox: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E3E3E9',
        borderStyle: 'dashed',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 120,
    },
    uploadIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        // backgroundColor: '#F0F3FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    uploadText: {
        fontSize: 16,
        fontFamily: 'CoFoRaffineBold',
        color: '#000000',
    },
    uploadHint: {
        fontSize: 12,
        fontFamily: 'tenez',
        color: '#999',
        marginTop: 8,
    },
    fileInfoContainer: {
        alignItems: 'center',
        gap: 4,
    },
    fileName: {
        fontSize: 14,
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
        height: 120,
        borderRadius: 8,
        resizeMode: 'cover',
    },
    titleInput: {
        borderWidth: 1,
        borderColor: '#E3E3E9',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#333',
        backgroundColor: '#fff',
    },
    summaryInput: {
        borderWidth: 1,
        borderColor: '#E3E3E9',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#333',
        backgroundColor: '#fff',
        minHeight: 80,
        textAlignVertical: 'top',
    },
    episodeInput: {
        borderWidth: 1,
        borderColor: '#E3E3E9',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#333',
        backgroundColor: '#fff',
        minHeight: 150,
        textAlignVertical: 'top',
    },
});