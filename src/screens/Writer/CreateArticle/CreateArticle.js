import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateArticle({ navigation }) {
    const { colors } = useTheme();

    const handleTypeSelect = (type) => {
        if (type === 'live') {
            Alert.alert('Live News', 'Create live news article');
        } else if (type === 'podcast') {
            Alert.alert('Podcast', 'Create new podcast');
        } else if (type === 'story') {
            Alert.alert('Story', 'Create new story/article');
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
                    <ThemedText style={styles.headerTitle}>Write</ThemedText>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Subtitle */}
                    <ThemedText style={styles.subtitle}>
                        Please select your upload category/type
                    </ThemedText>

                    <View style={{flexDirection: 'row', justifyContent: 'space-between', gap: 12}}>
                        {/* Live News Section */}
                        <View style={styles.liveSection}>
                            <View style={styles.liveHeader}>
                                <Ionicons name="radio-outline" size={20} color="#FF3B30" />
                                <ThemedText style={styles.liveTitle}>LIVE</ThemedText>
                            </View>
                            <TouchableOpacity
                                style={styles.liveButton}
                                onPress={() => handleTypeSelect('live')}
                            >
                                <ThemedText style={styles.buttonText}>Add Live News</ThemedText>
                            </TouchableOpacity>
                        </View>

                        {/* Podcast Section */}
                        <View style={styles.podcastSection}>
                            <TouchableOpacity
                                style={styles.podcastButton}
                                onPress={() => handleTypeSelect('podcast')}
                            >
                                <Ionicons name="mic-outline" size={20} color="#FF9500" />
                                <ThemedText style={styles.buttonText}>Add Podcast</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Add Story Section */}
                    <TouchableOpacity
                        style={styles.storyButton}
                        onPress={() => handleTypeSelect('story')}
                    >
                        <Ionicons name="add-circle-outline" size={24} color="#000" />
                        <ThemedText style={styles.storyText}>Add Story</ThemedText>
                    </TouchableOpacity>
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
        paddingHorizontal: 16,
        paddingTop: 30,
        paddingBottom: 30,
    },
    subtitle: {
        fontSize: 18,
        fontFamily: 'tenez',
        color: '#000',
        marginBottom: 30,
        lineHeight: 24,
        textAlign: 'center',
        width: '65%',
        margin: 'auto'
    },
    liveSection: {
        flex: 1,
        backgroundColor: '#FF000008',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#FF00001A',
    },
    liveHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    liveTitle: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
    },
    liveButton: {
        paddingVertical: 8,
    },
    podcastSection: {
        flex:1,
        backgroundColor: '#00000008',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#0000001A',
    },
    podcastButton: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
    },
    buttonText: {
        fontSize: 16,
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
    },
    storyButton: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
        marginTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        backgroundColor: '#9fa9f1',
        borderRadius: 8,
        elevation: 1
    },
    storyText: {
        fontSize: 16,
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
    },
});