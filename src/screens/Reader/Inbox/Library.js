import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import libraryService from '../../../services/libraryService';

export default function Library({ navigation }) {
    const { colors } = useTheme();
    const [recentlyReadItems, setRecentlyReadItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState(null);

    // Get current user ID from storage
    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const userDataString = await AsyncStorage.getItem('userData');
                if (userDataString) {
                    const userData = JSON.parse(userDataString);
                    let userId = null;
                    if (userData.data?.id) {
                        userId = userData.data.id;
                    } else if (userData.id) {
                        userId = userData.id;
                    } else if (userData._id) {
                        userId = userData._id;
                    }
                    setCurrentUserId(userId);
                }
            } catch (error) {
                console.error('Error getting current user:', error);
            }
        };
        getCurrentUser();
    }, []);

    // Fetch recently read items (Read Later items)
    const fetchRecentlyRead = async () => {
        try {
            // Fetch both stories and podcasts from read later
            const [storiesResult, podcastsResult] = await Promise.all([
                libraryService.getReadLaterItems('story', 1, 10),
                libraryService.getReadLaterItems('podcast', 1, 10)
            ]);
            
            let allItems = [];
            
            // Process stories
            if (storiesResult.success && storiesResult.data) {
                const formattedStories = storiesResult.data.map(item => ({
                    id: item.libraryId,
                    contentId: item.content._id,
                    title: item.content.title,
                    date: formatDate(item.savedAt),
                    type: 'Story',
                    image: item.content.coverImage,
                    isPremium: item.content.isPremium,
                    contentType: 'story',
                    author: item.content.author?.name,
                }));
                allItems.push(...formattedStories);
            }
            
            // Process podcasts
            if (podcastsResult.success && podcastsResult.data) {
                const formattedPodcasts = podcastsResult.data.map(item => ({
                    id: item.libraryId,
                    contentId: item.content._id,
                    title: item.content.title,
                    date: formatDate(item.savedAt),
                    type: 'Podcast',
                    image: item.content.coverImage,
                    isPremium: item.content.isPremium,
                    contentType: 'podcast',
                    author: item.content.author?.name,
                    duration: item.content.audioDuration,
                }));
                allItems.push(...formattedPodcasts);
            }
            
            // Sort by saved date (newest first) and take first 5
            allItems.sort((a, b) => new Date(b.date) - new Date(a.date));
            const recentItems = allItems.slice(0, 5);
            
            setRecentlyReadItems(recentItems);
        } catch (error) {
            console.error('Error fetching recently read:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    useEffect(() => {
        fetchRecentlyRead();
    }, []);

    const handleItemPress = (item) => {
        if (item.contentType === 'story') {
            navigation.navigate('StoryDetail', { storyId: item.contentId });
        } else {
            navigation.navigate('PodcastDetail', { podcastId: item.contentId });
        }
    };

    const renderLibraryItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.libraryItem}
            onPress={() => handleItemPress(item)}
        >
            <Image source={{ uri: item.image }} style={styles.libraryImage} />
            <View style={styles.libraryContent}>
                <View style={styles.libraryHeader}>
                    <ThemedText style={styles.libraryTitle} numberOfLines={2}>
                        {item.title}
                    </ThemedText>
                    {item.isPremium && (
                        <View style={styles.premiumBadge}>
                            <ThemedText style={styles.premiumText}>PREMIUM</ThemedText>
                        </View>
                    )}
                </View>
                <ThemedText style={styles.libraryMeta}>
                    {item.date} · {item.type}
                    {item.duration && ` · ${item.duration} min`}
                </ThemedText>
                {item.author && (
                    <ThemedText style={styles.libraryAuthor}>
                        By {item.author}
                    </ThemedText>
                )}
            </View>
        </TouchableOpacity>
    );

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
                    <ThemedText style={styles.headerTitle}>Library</ThemedText>
                    <View style={{ width: 40 }} />
                </View>

                {/* Tabs - Read Later | Saved with Icons */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        style={styles.tab}
                        onPress={() => navigation.navigate('ReadLater')}
                    >
                        <Ionicons name="bookmark-outline" size={22} color="#000" />
                        <ThemedText style={styles.tabText}>Read Later</ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tab, {backgroundColor: '#8E44AD1A'}]}
                        onPress={() => navigation.navigate('Saved')}
                    >
                        <MaterialIcons name="save" size={22} color="#000" />
                        <ThemedText style={styles.tabText}>Saved</ThemedText>
                    </TouchableOpacity>
                </View>

                {/* Recently Read Section */}
                <View style={styles.recentSection}>
                    <ThemedText style={styles.recentTitle}>Recently Read</ThemedText>
                    
                    {recentlyReadItems.length > 0 ? (
                        <FlatList
                            data={recentlyReadItems}
                            renderItem={renderLibraryItem}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.listContent}
                        />
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="bookmark-outline" size={48} color="#ccc" />
                            <ThemedText style={styles.emptyText}>No recently read items</ThemedText>
                            <ThemedText style={styles.emptySubText}>
                                Items you save to "Read Later" will appear here
                            </ThemedText>
                        </View>
                    )}
                </View>
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
        fontSize: 24,
        fontWeight: '400',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 22,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#27AE601A',
        gap: 8,
        backgroundColor: '#27AE601A',
    },
    tabText: {
        fontSize: 18,
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
    },
    recentSection: {
        flex: 1,
        paddingTop: 20,
    },
    recentTitle: {
        fontSize: 18,
        fontWeight: '400',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    listContent: {
        paddingHorizontal: 16,
        gap: 16,
        paddingBottom: 20,
    },
    libraryItem: {
        flexDirection: 'row',
        gap: 12,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        backgroundColor: '#fff',
        alignItems: 'flex-start',
        padding: 4,
        borderRadius: 8,
    },
    libraryImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },
    libraryContent: {
        flex: 1,
    },
    libraryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
        marginBottom: 4,
    },
    libraryTitle: {
        fontSize: 14,
        fontFamily: 'CoFoRaffineMedium',
        color: '#333',
        flex: 1,
        lineHeight: 18,
    },
    premiumBadge: {
        backgroundColor: '#FF9500',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    premiumText: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#FFF',
        fontFamily: 'CoFoRaffineBold',
    },
    libraryMeta: {
        fontSize: 11,
        fontFamily: 'tenez',
        color: '#999',
        marginBottom: 2,
    },
    libraryAuthor: {
        fontSize: 11,
        fontFamily: 'tenez',
        color: '#4B59B3',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        fontFamily: 'CoFoRaffineMedium',
        color: '#999',
        marginTop: 12,
    },
    emptySubText: {
        fontSize: 13,
        fontFamily: 'tenez',
        color: '#ccc',
        marginTop: 4,
        textAlign: 'center',
    },
    menuButton: {
        padding: 8,
    },
});