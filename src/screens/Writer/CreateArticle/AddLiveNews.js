import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
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

export default function AddLiveNews({ navigation }) {
    const { colors } = useTheme();
    const [newsContent, setNewsContent] = useState('');
    const [newsSummary, setNewsSummary] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [isLive, setIsLive] = useState(true);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please grant camera roll permissions to upload an image.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const handlePublish = () => {
        if (!newsContent.trim()) {
            Alert.alert('Error', 'Please enter news content');
            return;
        }
        Alert.alert('Success', 'Live news published successfully!');
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
                    <ThemedText style={styles.headerTitle}>Add Live News</ThemedText>
                    <TouchableOpacity
                        style={styles.publishButton}
                        onPress={handlePublish}
                    >
                        <ThemedText style={styles.publishText}>Publish</ThemedText>
                    </TouchableOpacity>
                </View>

                {/* Live Indicator */}
                {/* <View style={styles.liveIndicator}>
                    <View style={styles.liveDot} />
                    <ThemedText style={styles.liveText}>LIVE</ThemedText>
                </View> */}

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Image Upload Section */}
                    {/* <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>News Image</ThemedText>
                        
                        <TouchableOpacity
                            style={styles.uploadBox}
                            onPress={pickImage}
                        >
                            {selectedImage ? (
                                <Image source={{ uri: selectedImage }} style={styles.uploadedImage} />
                            ) : (
                                <>
                                    <View style={styles.uploadIconContainer}>
                                        <Ionicons name="camera-outline" size={32} color="#FF3B30" />
                                    </View>
                                    <ThemedText style={styles.uploadText}>Add Photo</ThemedText>
                                </>
                            )}
                        </TouchableOpacity>
                    </View> */}

                    {/* News Content Section */}
                    {/* <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>News Content</ThemedText>
                        <TextInput
                            style={styles.contentInput}
                            placeholder="Enter your news content..."
                            placeholderTextColor="#999"
                            value={newsContent}
                            onChangeText={setNewsContent}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </View> */}

                    {/* News Summary Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <ThemedText style={styles.sectionTitle}>News Summary</ThemedText>
                            <ThemedText style={styles.charCount}>
                                {newsSummary.length}/1000
                            </ThemedText>
                        </View>
                        <TextInput
                            style={styles.summaryInput}
                            placeholder="Enter a brief news summary..."
                            placeholderTextColor="#999"
                            value={newsSummary}
                            onChangeText={setNewsSummary}
                            multiline
                            numberOfLines={6}
                            maxLength={1000}
                            textAlignVertical="top"
                        />
                        {/* <ThemedText style={styles.summaryHint}>
                            Brief summary of the news (max 1000 characters)
                        </ThemedText> */}
                    </View>

                    {/* Additional Options */}
                    {/* <View style={styles.optionsSection}>
                        <TouchableOpacity 
                            style={[styles.optionButton, isLive && styles.optionButtonActive]}
                            onPress={() => setIsLive(true)}
                        >
                            <View style={[styles.optionDot, isLive && styles.optionDotActive]} />
                            <ThemedText style={[styles.optionText, isLive && styles.optionTextActive]}>
                                Mark as Live
                            </ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[styles.optionButton, !isLive && styles.optionButtonActive]}
                            onPress={() => setIsLive(false)}
                        >
                            <View style={[styles.optionDot, !isLive && styles.optionDotActive]} />
                            <ThemedText style={[styles.optionText, !isLive && styles.optionTextActive]}>
                                Schedule for later
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
    liveIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF3B3010',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#FF3B3020',
        gap: 8,
    },
    liveDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF3B30',
    },
    liveText: {
        fontSize: 14,
        fontFamily: 'CoFoRaffineBold',
        color: '#FF3B30',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 30,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        marginBottom: 8,
        letterSpacing: 1,
    },
    uploadBox: {
        backgroundColor: '#FFF5F5',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FF3B3020',
        borderStyle: 'dashed',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 150,
    },
    uploadIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FF3B3010',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    uploadText: {
        fontSize: 14,
        fontFamily: 'CoFoRaffineMedium',
        color: '#FF3B30',
    },
    uploadedImage: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        resizeMode: 'cover',
    },
    contentInput: {
        borderWidth: 1,
        borderColor: '#FF3B3020',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#333',
        backgroundColor: '#FFF5F5',
        minHeight: 100,
    },
    summaryInput: {
        borderWidth: 1,
        borderColor: '#E3E3E9',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#000',
        backgroundColor: '#fff',
        minHeight: 150,
        textAlignVertical: 'top',
    },
    charCount: {
        fontSize: 12,
        fontFamily: 'tenez',
        color: '#000000',
    },
    summaryHint: {
        fontSize: 12,
        fontFamily: 'tenez',
        color: '#999',
        marginTop: 8,
    },
    optionsSection: {
        backgroundColor: '#FFF5F5',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#FF3B3020',
        gap: 12,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#FF3B3020',
    },
    optionButtonActive: {
        backgroundColor: '#FF3B30',
        borderColor: '#FF3B30',
    },
    optionDot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#FF3B30',
        marginRight: 12,
    },
    optionDotActive: {
        backgroundColor: '#FFFFFF',
        borderColor: '#FFFFFF',
    },
    optionText: {
        fontSize: 14,
        fontFamily: 'CoFoRaffineMedium',
        color: '#666',
    },
    optionTextActive: {
        color: '#FFFFFF',
    },
});