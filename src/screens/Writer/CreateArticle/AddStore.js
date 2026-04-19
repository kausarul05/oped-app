import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { SafeAreaView } from 'react-native-safe-area-context';
import storyService from '../../../services/storyService';

export default function AddStory({ navigation }) {
    const { colors } = useTheme();
    const richText = useRef();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [storyContent, setStoryContent] = useState('');
    const [category, setCategory] = useState('technology');
    const [tags, setTags] = useState('');
    const [isPremium, setIsPremium] = useState(false);
    const [loading, setLoading] = useState(false);

    const categories = [
        { label: 'Technology', value: 'technology' },
        { label: 'Business', value: 'business' },
        { label: 'Politics', value: 'politics' },
        { label: 'Culture', value: 'culture' },
        { label: 'Travel', value: 'travel' },
        { label: 'Finance', value: 'finance' },
        { label: 'Sports', value: 'sports' },
    ];

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please grant camera roll permissions to upload an image.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0]);
        }
    };

    const handlePublish = async () => {
        // Validation
        if (!title.trim()) {
            Alert.alert('Error', 'Please enter a title');
            return;
        }
        if (!summary.trim()) {
            Alert.alert('Error', 'Please enter a summary');
            return;
        }
        if (!storyContent.trim()) {
            Alert.alert('Error', 'Please enter story content');
            return;
        }
        if (!selectedImage) {
            Alert.alert('Error', 'Please upload a cover image');
            return;
        }

        setLoading(true);

        try {
            // Create FormData
            const formData = new FormData();
            
            // Append text fields
            formData.append('title', title.trim());
            formData.append('summary', summary.trim());
            formData.append('content', storyContent.trim());
            formData.append('category', category);
            formData.append('isPremium', isPremium);
            
            // Append tags as JSON string
            const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            formData.append('tags', JSON.stringify(tagsArray));
            
            // Append cover image
            formData.append('coverImage', {
                uri: selectedImage.uri,
                type: selectedImage.mimeType || 'image/jpeg',
                name: selectedImage.fileName || 'cover.jpg',
            });

            const result = await storyService.createStory(formData);
            
            if (result.success) {
                Alert.alert('Success', 'Story sent to editor successfully!');
                navigation.goBack();
            } else {
                Alert.alert('Error', result.error || 'Failed to publish story');
            }
        } catch (error) {
            console.error('Error publishing story:', error);
            Alert.alert('Error', 'Failed to publish story. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const insertImage = () => {
        Alert.prompt(
            'Insert Image',
            'Enter the image URL',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Insert',
                    onPress: (url) => {
                        if (url && richText.current) {
                            richText.current.insertImage(url);
                        }
                    }
                }
            ],
            'plain-text',
            'https://'
        );
    };

    const insertLink = () => {
        Alert.prompt(
            'Insert Link',
            'Enter the URL',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Insert',
                    onPress: (url) => {
                        if (url && richText.current) {
                            Alert.prompt(
                                'Link Text',
                                'Enter the text for the link',
                                [
                                    { text: 'Cancel', style: 'cancel' },
                                    {
                                        text: 'Insert',
                                        onPress: (text) => {
                                            if (text) {
                                                richText.current.insertLink(text, url);
                                            }
                                        }
                                    }
                                ],
                                'plain-text',
                                'Link Text'
                            );
                        }
                    }
                }
            ],
            'plain-text',
            'https://'
        );
    };

    const handleHeading1 = () => {
        richText.current?.insertHTML('<h1>Heading 1</h1>');
    };

    const handleHeading2 = () => {
        richText.current?.insertHTML('<h2>Heading 2</h2>');
    };

    const handleHeading3 = () => {
        richText.current?.insertHTML('<h3>Heading 3</h3>');
    };

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <ThemedText style={styles.headerTitle}>Add Story</ThemedText>
                    <TouchableOpacity
                        style={styles.publishButton}
                        onPress={handlePublish}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <ThemedText style={styles.publishText}>Send To Editor</ThemedText>
                        )}
                    </TouchableOpacity>
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {/* Upload Image Section */}
                        <View style={styles.section}>
                            <ThemedText style={styles.sectionTitle}>Upload Image *</ThemedText>

                            <TouchableOpacity
                                style={styles.uploadBox}
                                onPress={pickImage}
                            >
                                {selectedImage ? (
                                    <Image source={{ uri: selectedImage.uri }} style={styles.uploadedImage} />
                                ) : (
                                    <>
                                        <View style={styles.uploadIconContainer}>
                                            <Ionicons name="cloud-upload-outline" size={32} color="#4B59B3" />
                                        </View>
                                        <ThemedText style={styles.uploadText}>Upload Image</ThemedText>
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
                                placeholder="Enter your story title"
                                placeholderTextColor="#999"
                                value={title}
                                onChangeText={setTitle}
                            />
                        </View>

                        {/* Summary Section */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <ThemedText style={styles.sectionTitle}>Summary *</ThemedText>
                                <ThemedText style={styles.charCount}>
                                    {summary.length}/500
                                </ThemedText>
                            </View>
                            <TextInput
                                style={styles.summaryInput}
                                placeholder="Enter your article summary"
                                placeholderTextColor="#999"
                                value={summary}
                                onChangeText={setSummary}
                                multiline
                                numberOfLines={3}
                                maxLength={500}
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
                                placeholder="Enter tags separated by commas (e.g., media, digital, journalism)"
                                placeholderTextColor="#999"
                                value={tags}
                                onChangeText={setTags}
                            />
                            <ThemedText style={styles.uploadHint}>
                                Separate multiple tags with commas
                            </ThemedText>
                        </View>

                        {/* Premium Section */}
                        <View style={styles.section}>
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
                                Enable if this story is for premium users only
                            </ThemedText>
                        </View>

                        {/* Rich Text Editor - Full Featured */}
                        <View style={styles.section}>
                            <ThemedText style={styles.sectionTitle}>Tell your story *</ThemedText>

                            {/* Rich Editor */}
                            <View style={styles.editorContainer}>
                                <RichEditor
                                    ref={richText}
                                    style={styles.editor}
                                    placeholder="Write your story here..."
                                    onChange={(text) => setStoryContent(text)}
                                    editorStyle={{
                                        backgroundColor: '#FFFFFF',
                                        color: '#333',
                                        placeholderColor: '#999',
                                        contentCSSText: 'font-size: 16px; line-height: 24px; font-family: "tenez";',
                                    }}
                                    useContainer={true}
                                    androidHardwareAccelerationDisabled={true}
                                />
                            </View>
                        </View>
                    </ScrollView>

                    {/* Rich Toolbar - All Features */}
                    <RichToolbar
                        style={styles.richToolbar}
                        editor={richText}
                        actions={[
                            actions.setBold,
                            actions.setItalic,
                            actions.setUnderline,
                            actions.setStrikethrough,
                            actions.insertBulletsList,
                            actions.insertOrderedList,
                            actions.insertLink,
                            actions.setSubscript,
                            actions.setSuperscript,
                            actions.setParagraph,
                            actions.removeFormat,
                            actions.undo,
                            actions.redo,
                        ]}
                        iconMap={{
                            [actions.setBold]: ({ tintColor }) => <Ionicons name="bold" size={20} color={tintColor} />,
                            [actions.setItalic]: ({ tintColor }) => <Ionicons name="italic" size={20} color={tintColor} />,
                            [actions.setUnderline]: ({ tintColor }) => <Ionicons name="underline" size={20} color={tintColor} />,
                            [actions.insertBulletsList]: ({ tintColor }) => <Ionicons name="list" size={20} color={tintColor} />,
                            [actions.insertOrderedList]: ({ tintColor }) => <Ionicons name="list" size={20} color={tintColor} />,
                            [actions.insertLink]: ({ tintColor }) => <Ionicons name="link" size={20} color={tintColor} />,
                        }}
                    />

                    {/* Custom Heading Row */}
                    <View style={styles.headingRow}>
                        <TouchableOpacity style={styles.headingButton} onPress={handleHeading1}>
                            <ThemedText style={styles.headingButtonText}>H1</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.headingButton} onPress={handleHeading2}>
                            <ThemedText style={styles.headingButtonText}>H2</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.headingButton} onPress={handleHeading3}>
                            <ThemedText style={styles.headingButtonText}>H3</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.imageButton} onPress={insertImage}>
                            <Ionicons name="image-outline" size={20} color="#4B59B3" />
                            <ThemedText style={styles.imageButtonText}>Add Image</ThemedText>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
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
        minWidth: 100,
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
        paddingBottom: 20,
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
        minHeight: 150,
    },
    uploadIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
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
    uploadedImage: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        resizeMode: 'cover',
    },
    uploadHint: {
        fontSize: 12,
        fontFamily: 'tenez',
        color: '#999',
        marginTop: 8,
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
    charCount: {
        fontSize: 12,
        fontFamily: 'tenez',
        color: '#999',
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
    editorContainer: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        minHeight: 250,
        overflow: 'hidden',
    },
    editor: {
        flex: 1,
        minHeight: 250,
    },
    richToolbar: {
        backgroundColor: '#F8F9FA',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        padding: 4,
    },
    headingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#F8F9FA',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        gap: 8,
    },
    headingButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#FFFFFF',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    headingButtonText: {
        fontSize: 14,
        fontFamily: 'CoFoRaffineBold',
        color: '#666',
    },
    imageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#F0F3FF',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#4B59B3',
        gap: 4,
        marginLeft: 'auto',
    },
    imageButtonText: {
        fontSize: 14,
        fontFamily: 'CoFoRaffineMedium',
        color: '#4B59B3',
    },
});