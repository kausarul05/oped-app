import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import libraryService from '../../../services/libraryService';

export default function ReadLater({ navigation }) {
    const { colors } = useTheme();
    const [readLaterItems, setReadLaterItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        total: 0,
        totalPages: 1
    });

    // Fetch read later items from API
    const fetchReadLaterItems = async (page = 1, isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else if (page === 1) {
                setLoading(true);
            }

            // Fetch both stories and podcasts for read later
            const [storiesResult, podcastsResult] = await Promise.all([
                libraryService.getReadLaterItems('story', page, 10),
                libraryService.getReadLaterItems('podcast', page, 10)
            ]);
            
            let allItems = [];
            let totalCount = 0;
            
            // Process stories
            if (storiesResult.success && storiesResult.data) {
                const formattedStories = storiesResult.data.map(item => ({
                    id: item.libraryId,
                    contentId: item.content._id,
                    title: item.content.title,
                    summary: item.content.summary,
                    date: formatDate(item.savedAt),
                    type: 'Story',
                    image: item.content.coverImage,
                    category: item.content.category,
                    isPremium: item.content.isPremium,
                    author: item.content.author?.name,
                    authorId: item.content.author?._id,
                    authorImage: item.content.author?.profileImage,
                    readingTime: item.content.readingTime,
                    createdAt: item.content.createdAt,
                    contentType: 'story'
                }));
                allItems.push(...formattedStories);
                totalCount += storiesResult.pagination?.total || 0;
            }
            
            // Process podcasts
            if (podcastsResult.success && podcastsResult.data) {
                const formattedPodcasts = podcastsResult.data.map(item => ({
                    id: item.libraryId,
                    contentId: item.content._id,
                    title: item.content.title,
                    summary: item.content.summary,
                    date: formatDate(item.savedAt),
                    type: 'Podcast',
                    image: item.content.coverImage,
                    category: item.content.category,
                    isPremium: item.content.isPremium,
                    author: item.content.author?.name,
                    authorId: item.content.author?._id,
                    authorImage: item.content.author?.profileImage,
                    duration: item.content.audioDuration,
                    createdAt: item.content.createdAt,
                    contentType: 'podcast'
                }));
                allItems.push(...formattedPodcasts);
                totalCount += podcastsResult.pagination?.total || 0;
            }
            
            // Sort by saved date (newest first)
            allItems.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            if (isRefresh || page === 1) {
                setReadLaterItems(allItems);
            } else {
                setReadLaterItems(prev => [...prev, ...allItems]);
            }
            
            setPagination({
                page: page,
                total: totalCount,
                totalPages: Math.ceil(totalCount / 10)
            });
        } catch (error) {
            console.error('Error fetching read later items:', error);
            Alert.alert('Error', 'Failed to load read later items');
        } finally {
            setLoading(false);
            setRefreshing(false);
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

    const onRefresh = () => {
        fetchReadLaterItems(1, true);
    };

    const loadMore = () => {
        if (pagination.page < pagination.totalPages && !loading) {
            fetchReadLaterItems(pagination.page + 1);
        }
    };

    const handleRemoveReadLater = async (itemId, contentId, contentType) => {
        Alert.alert(
            'Remove from Read Later',
            'Are you sure you want to remove this item from your read later list?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const result = await libraryService.toggleSave({
                                contentType: contentType,
                                contentId: contentId,
                                listType: 'readLater'
                            });
                            
                            if (result.success) {
                                setReadLaterItems(prev => prev.filter(item => item.id !== itemId));
                                Alert.alert('Success', 'Removed from read later');
                            } else {
                                Alert.alert('Error', result.error || 'Failed to remove');
                            }
                        } catch (error) {
                            console.error('Error removing read later item:', error);
                            Alert.alert('Error', 'Failed to remove');
                        }
                    }
                }
            ]
        );
    };

    useEffect(() => {
        fetchReadLaterItems();
    }, []);

    const renderLibraryItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.libraryItem}
            onPress={() => {
                if (item.contentType === 'story') {
                    navigation.navigate('StoryDetail', { storyId: item.contentId });
                } else {
                    navigation.navigate('PodcastDetail', { podcastId: item.contentId });
                }
            }}
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
                    {item.readingTime && ` · ${item.readingTime} min read`}
                    {item.duration && ` · ${item.duration} min`}
                </ThemedText>
                <ThemedText style={styles.librarySummary} numberOfLines={2}>
                    {item.summary}
                </ThemedText>
                <ThemedText style={styles.libraryAuthor}>
                    By {item.author || 'Unknown Author'}
                </ThemedText>
            </View>
            <TouchableOpacity 
                style={styles.menuButton}
                onPress={() => handleRemoveReadLater(item.id, item.contentId, item.contentType)}
            >
                <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    if (loading && readLaterItems.length === 0) {
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
                    <TouchableOpacity style={styles.searchButton}>
                        {/* Empty view for alignment */}
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <View style={styles.contentContainer}>
                    <View style={{flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 8}}>
                        <Ionicons name="bookmark-outline" size={36} color="#27AE60" />
                        <ThemedText style={styles.savedTitle}>Read Later</ThemedText>
                    </View>
                    <ThemedText style={styles.savedDescription}>
                        You can add issues and stories that you want to read later to this list
                    </ThemedText>

                    <TouchableOpacity style={styles.privateButton}>
                        <Ionicons name="lock-closed-outline" size={16} color="#666" />
                        <ThemedText style={styles.privateText}>Private</ThemedText>
                    </TouchableOpacity>

                    {readLaterItems.length > 0 ? (
                        <FlatList
                            data={readLaterItems}
                            renderItem={renderLibraryItem}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.listContent}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                    colors={['#4B59B3']}
                                />
                            }
                            onEndReached={loadMore}
                            onEndReachedThreshold={0.3}
                            ListFooterComponent={
                                pagination.page < pagination.totalPages && (
                                    <View style={styles.loaderMore}>
                                        <ActivityIndicator size="small" color="#4B59B3" />
                                    </View>
                                )
                            }
                        />
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="bookmark-outline" size={64} color="#ccc" />
                            <ThemedText style={styles.emptyText}>No read later items</ThemedText>
                            <ThemedText style={styles.emptySubText}>
                                Save stories and podcasts to read them later
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
    searchButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    savedTitle: {
        fontSize: 24,
        fontWeight: '400',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
    },
    savedDescription: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#666',
        lineHeight: 20,
        marginBottom: 16,
    },
    privateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 24,
    },
    privateText: {
        fontSize: 14,
        fontFamily: 'CoFoRaffineMedium',
        color: '#666',
    },
    listContent: {
        gap: 16,
        paddingBottom: 20,
    },
    libraryItem: {
        flexDirection: 'row',
        gap: 12,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        alignItems: 'flex-start',
        backgroundColor: '#fff',
        padding: 4,
        borderRadius: 8,
        position: 'relative',
    },
    libraryImage: {
        width: 70,
        height: 70,
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
        marginBottom: 4,
    },
    librarySummary: {
        fontSize: 12,
        fontFamily: 'tenez',
        color: '#666',
        lineHeight: 16,
        marginBottom: 4,
    },
    libraryAuthor: {
        fontSize: 11,
        fontFamily: 'tenez',
        color: '#4B59B3',
    },
    menuButton: {
        padding: 4,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
    },
    emptyText: {
        fontSize: 18,
        fontFamily: 'CoFoRaffineBold',
        color: '#999',
        marginTop: 16,
    },
    emptySubText: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#ccc',
        marginTop: 8,
        textAlign: 'center',
    },
    loaderMore: {
        paddingVertical: 16,
        alignItems: 'center',
    },
});