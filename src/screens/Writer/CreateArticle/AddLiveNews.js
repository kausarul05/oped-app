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
    View,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import liveNewsService from '../../../services/liveNewsService';

export default function AddLiveNews({ navigation }) {
    const { colors } = useTheme();
    const [newsContent, setNewsContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePublish = async () => {
        if (!newsContent.trim()) {
            Alert.alert('Error', 'Please enter news content');
            return;
        }

        if (newsContent.trim().length < 10) {
            Alert.alert('Error', 'News content must be at least 10 characters');
            return;
        }

        setLoading(true);

        try {
            const result = await liveNewsService.createLiveNews(newsContent.trim());
            
            if (result.success) {
                Alert.alert('Success', 'Live news published successfully!');
                navigation.goBack();
            } else {
                Alert.alert('Error', result.error || 'Failed to publish live news');
            }
        } catch (error) {
            console.error('Error publishing live news:', error);
            Alert.alert('Error', 'Failed to publish live news. Please try again.');
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
                    <ThemedText style={styles.headerTitle}>Add Live News</ThemedText>
                    <TouchableOpacity
                        style={styles.publishButton}
                        onPress={handlePublish}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <ThemedText style={styles.publishText}>Publish</ThemedText>
                        )}
                    </TouchableOpacity>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* News Summary Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <ThemedText style={styles.sectionTitle}>News Content</ThemedText>
                            <ThemedText style={styles.charCount}>
                                {newsContent.length}/5000
                            </ThemedText>
                        </View>
                        <TextInput
                            style={styles.summaryInput}
                            placeholder="Enter your news content here..."
                            placeholderTextColor="#999"
                            value={newsContent}
                            onChangeText={setNewsContent}
                            multiline
                            numberOfLines={10}
                            maxLength={5000}
                            textAlignVertical="top"
                            editable={!loading}
                        />
                        <ThemedText style={styles.summaryHint}>
                            Write your live news content. Minimum 10 characters required.
                        </ThemedText>
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
        minHeight: 200,
        textAlignVertical: 'top',
    },
    charCount: {
        fontSize: 12,
        fontFamily: 'tenez',
        color: '#999',
    },
    summaryHint: {
        fontSize: 12,
        fontFamily: 'tenez',
        color: '#999',
        marginTop: 8,
    },
});