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
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
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
    const [menuVisible, setMenuVisible] = useState(false);

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

    const handleSaveAsDraft = async () => {
        if (!title.trim()) {
            Alert.alert('Error', 'Please enter a title');
            return;
        }
        if (!summary.trim()) {
            Alert.alert('Error', 'Please enter a summary');
            return;
        }
        if (!selectedImage) {
            Alert.alert('Error', 'Please upload a cover image');
            return;
        }

        setLoading(true);
        setMenuVisible(false);

        try {
            const formData = new FormData();
            
            formData.append('title', title.trim());
            formData.append('summary', summary.trim());
            formData.append('content', storyContent.trim() || '');
            formData.append('category', category);
            formData.append('isPremium', isPremium);
            
            const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            formData.append('tags', JSON.stringify(tagsArray));
            
            formData.append('coverImage', {
                uri: selectedImage.uri,
                type: selectedImage.mimeType || 'image/jpeg',
                name: selectedImage.fileName || 'cover.jpg',
            });

            const result = await storyService.createStory(formData);
            
            if (result.success) {
                Alert.alert('Success', 'Story saved as draft!');
                navigation.goBack();
            } else {
                Alert.alert('Error', result.error || 'Failed to save draft');
            }
        } catch (error) {
            console.error('Error saving draft:', error);
            Alert.alert('Error', 'Failed to save draft. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSendToEditor = async () => {
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
        setMenuVisible(false);

        try {
            const formData = new FormData();
            
            formData.append('title', title.trim());
            formData.append('summary', summary.trim());
            formData.append('content', storyContent.trim());
            formData.append('category', category);
            formData.append('isPremium', isPremium);
            
            const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            formData.append('tags', JSON.stringify(tagsArray));
            
            formData.append('coverImage', {
                uri: selectedImage.uri,
                type: selectedImage.mimeType || 'image/jpeg',
                name: selectedImage.fileName || 'cover.jpg',
            });

            const createResult = await storyService.createStory(formData);
            
            if (createResult.success && createResult.data?.data?._id) {
                const newStoryId = createResult.data.data._id;
                
                const submitResult = await storyService.submitToEditor(newStoryId);
                
                if (submitResult.success) {
                    Alert.alert('Success', 'Story submitted to editor for review!');
                    navigation.goBack();
                } else {
                    Alert.alert('Error', submitResult.error || 'Failed to submit to editor');
                }
            } else {
                Alert.alert('Error', createResult.error || 'Failed to create story');
            }
        } catch (error) {
            console.error('Error submitting story:', error);
            Alert.alert('Error', 'Failed to submit story. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleMenuOption = (option) => {
        if (option === 'draft') {
            handleSaveAsDraft();
        } else if (option === 'sendToEditor') {
            handleSendToEditor();
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
                    <ThemedText style={styles.headerTitle}>Add Story</ThemedText>
                    <TouchableOpacity
                        style={styles.menuButton}
                        onPress={() => setMenuVisible(true)}
                    >
                        <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
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

                        {/* Rich Text Editor */}
                        <View style={styles.section}>
                            <ThemedText style={styles.sectionTitle}>Tell your story *</ThemedText>

                            {/* Rich Toolbar */}
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
                                    actions.setParagraph,
                                    actions.removeFormat,
                                    actions.undo,
                                    actions.redo,
                                ]}
                                iconMap={{
                                    [actions.setBold]: ({ tintColor }) => <Ionicons name="bold" size={20} color={tintColor} />,
                                    [actions.setItalic]: ({ tintColor }) => <Ionicons name="italic" size={20} color={tintColor} />,
                                    [actions.setUnderline]: ({ tintColor }) => <Ionicons name="underline" size={20} color={tintColor} />,
                                    [actions.setStrikethrough]: ({ tintColor }) => <Ionicons name="strikethrough" size={20} color={tintColor} />,
                                    [actions.insertBulletsList]: ({ tintColor }) => <Ionicons name="list" size={20} color={tintColor} />,
                                    [actions.insertOrderedList]: ({ tintColor }) => <Ionicons name="list" size={20} color={tintColor} />,
                                    [actions.insertLink]: ({ tintColor }) => <Ionicons name="link" size={20} color={tintColor} />,
                                    [actions.setParagraph]: ({ tintColor }) => <Ionicons name="text" size={20} color={tintColor} />,
                                    [actions.removeFormat]: ({ tintColor }) => <Ionicons name="remove-outline" size={20} color={tintColor} />,
                                    [actions.undo]: ({ tintColor }) => <Ionicons name="arrow-undo-outline" size={20} color={tintColor} />,
                                    [actions.redo]: ({ tintColor }) => <Ionicons name="arrow-redo-outline" size={20} color={tintColor} />,
                                }}
                                selectedIconTint="#4B59B3"
                                iconTint="#666"
                            />

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
                                        contentCSSText: 'font-size: 16px; line-height: 24px;',
                                    }}
                                    initialContentHTML={storyContent}
                                    useContainer={true}
                                    androidHardwareAccelerationDisabled={true}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>

                {/* Three Dot Menu Modal */}
                <Modal
                    visible={menuVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setMenuVisible(false)}
                >
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPress={() => setMenuVisible(false)}
                    >
                        <View style={styles.menuContainer}>
                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => handleMenuOption('draft')}
                                disabled={loading}
                            >
                                <Ionicons name="document-text-outline" size={20} color="#000" />
                                <ThemedText style={styles.menuText}>Save as Draft</ThemedText>
                            </TouchableOpacity>

                            <View style={styles.menuDivider} />

                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => handleMenuOption('sendToEditor')}
                                disabled={loading}
                            >
                                <Ionicons name="send-outline" size={20} color="#000" />
                                <ThemedText style={styles.menuText}>Send to Editor</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>

                {/* Loading Overlay */}
                {loading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#4B59B3" />
                    </View>
                )}
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
    menuButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
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
    richToolbar: {
        backgroundColor: '#F8F9FA',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderWidth: 1,
        borderBottomWidth: 0,
        borderColor: '#E0E0E0',
        padding: 4,
    },
    editorContainer: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        backgroundColor: '#FFFFFF',
        minHeight: 250,
        overflow: 'hidden',
    },
    editor: {
        flex: 1,
        minHeight: 250,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 8,
        width: 200,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        gap: 12,
    },
    menuText: {
        fontSize: 16,
        fontFamily: 'CoFoRaffineMedium',
        color: '#000',
    },
    menuDivider: {
        height: 1,
        backgroundColor: '#F0F0F0',
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});