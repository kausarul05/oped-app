import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import storyService from '@/src/services/storyService';
import { FontAwesome6, Foundation, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CategoryStories({ route, navigation }) {
    const { colors } = useTheme();
    const { category: initialCategory = 'All', categoryId = '' } = route.params || { category: 'All' };

    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('latest');
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });

    // Categories from QuickLinks and Discover
    const categories = [
        { id: 1, name: 'All', icon: 'apps-outline', color: '#4B59B3' },
        { id: 2, name: 'LIVE', icon: 'radio-outline', color: '#FF3B30' },
        { id: 3, name: 'Top Stories', icon: 'newspaper-outline', color: '#4B59B3' },
        { id: 4, name: 'Bricflog', icon: 'flash-outline', color: '#FF9500' },
        { id: 5, name: 'Discover', icon: 'compass-outline', color: '#34C759' },
        { id: 6, name: 'Culture', icon: 'color-palette-outline', color: '#FF6B6B' },
        { id: 7, name: 'Travel', icon: 'airplane-outline', color: '#4ECDC4' },
        { id: 8, name: 'Finance', icon: 'trending-up-outline', color: '#FFD93D' },
        { id: 9, name: 'Politics', icon: 'flag-outline', color: '#6C5CE7' },
        { id: 10, name: 'Business', icon: 'briefcase-outline', color: '#A8E6CF' },
        { id: 11, name: 'Technology', icon: 'hardware-chip-outline', color: '#5856D6' },
        { id: 12, name: 'Gastronomy', icon: 'restaurant-outline', color: '#FF6B35' },
    ];

    const getDisplayTitle = () => {
        if (selectedCategory === 'All') return 'Top Stories';
        if (selectedCategory === 'LIVE') return 'Live News';
        if (selectedCategory === 'Top Stories') return 'Top Stories';
        return selectedCategory;
    };

    const getApiCategory = (categoryName) => {
        const mapping = {
            'All': '',
            'LIVE': 'live',
            'Top Stories': 'top-stories',
            'Bricflog': 'bricflog',
            'Discover': 'discover',
            'Culture': 'culture',
            'Travel': 'travel',
            'Finance': 'finance',
            'Politics': 'politics',
            'Business': 'business',
            'Technology': 'technology',
            'Gastronomy': 'gastronomy',
        };
        return mapping[categoryName] || categoryName.toLowerCase();
    };

    const fetchStories = async (page = 1, isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else if (page === 1) {
                setLoading(true);
            }

            const apiCategory = getApiCategory(selectedCategory);
            const response = await storyService.getTopStories(apiCategory, page, 10);

            if (response.success) {
                let newStories = response.data;

                // Apply search filter
                if (searchQuery.trim()) {
                    newStories = newStories.filter(story =>
                        story.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        story.summary?.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                }

                // Apply sorting
                if (sortBy === 'popular') {
                    newStories = [...newStories].sort((a, b) => (b.reactionCount || 0) - (a.reactionCount || 0));
                } else if (sortBy === 'trending') {
                    newStories = [...newStories].sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0));
                }

                if (isRefresh || page === 1) {
                    setStories(newStories);
                } else {
                    setStories(prev => [...prev, ...newStories]);
                }

                if (response.pagination) {
                    setPagination(response.pagination);
                }
            }
        } catch (error) {
            console.error('Error fetching stories:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        fetchStories(1, true);
    };

    // Handle search with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (selectedCategory) {
                fetchStories(1, true);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Handle sort change
    useEffect(() => {
        fetchStories(1, true);
    }, [sortBy]);

    // Initial load
    useEffect(() => {
        fetchStories(1);
    }, [selectedCategory]);

    const formatTimeAgo = (dateString) => {
        if (!dateString) return 'recent';
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
        return date.toLocaleDateString();
    };

    const formatNumber = (num) => {
        if (!num) return '0';
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    // Filter stories based on selected category and search query
    const filteredStories = stories.filter(story => {
        const matchesCategory = selectedCategory === 'All' || story.category === selectedCategory.toLowerCase();
        const matchesSearch = searchQuery === '' ||
            story.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            story.summary?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Sort stories based on sortBy
    const sortedStories = [...filteredStories].sort((a, b) => {
        if (sortBy === 'latest') {
            return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (sortBy === 'popular') {
            return (b.reactionCount || 0) - (a.reactionCount || 0);
        } else {
            return (b.commentCount || 0) - (a.commentCount || 0);
        }
    });

    const renderStoryItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={styles.storyCard}
                onPress={() => navigation.navigate('StoryDetail', { storyId: item._id })}
            >
                <Image source={{ uri: item.coverImage }} style={styles.storyImage} />
                <View style={styles.storyContent}>
                    <View style={styles.storyHeader}>
                        <ThemedText style={styles.storyTitle}>{item.title}</ThemedText>
                        <View style={[styles.categoryBadge, { backgroundColor: categories.find(c => c.name.toLowerCase() === item.category)?.color + '20' || '#4B59B320' }]}>
                            <ThemedText style={[styles.categoryBadgeText, { color: categories.find(c => c.name.toLowerCase() === item.category)?.color || '#4B59B3' }]}>
                                {item.category}
                            </ThemedText>
                        </View>
                    </View>

                    <ThemedText style={styles.storyHeadline} numberOfLines={2}>
                        {item.title}
                    </ThemedText>

                    <ThemedText style={styles.storyDescription} numberOfLines={2}>
                        {item.summary}
                    </ThemedText>

                    <View style={styles.storyMeta}>
                        <View style={styles.metaItem}>
                            <Ionicons name="time-outline" size={14} color="#999" />
                            <ThemedText style={styles.metaText}>{formatTimeAgo(item.createdAt)}</ThemedText>
                        </View>
                        <View style={styles.metaItem}>
                            <Foundation name="like" size={14} color="#999" />
                            <ThemedText style={styles.metaText}>{formatNumber(item.reactionCount)}</ThemedText>
                        </View>
                        <View style={styles.metaItem}>
                            <MaterialCommunityIcons name="message-text-outline" size={14} color="#999" />
                            <ThemedText style={styles.metaText}>{formatNumber(item.commentCount)}</ThemedText>
                        </View>
                        <View style={styles.metaItem}>
                            <FontAwesome6 name="share-from-square" size={12} color="#999" />
                            <ThemedText style={styles.metaText}>{formatNumber(item.shareCount)}</ThemedText>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    };

    if (loading) {
        return (
            <ThemedView style={styles.container}>
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#4B59B3" />
                    </View>
                </SafeAreaView>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* Header with Dynamic Title */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <ThemedText style={styles.headerTitle}>{getDisplayTitle()}</ThemedText>
                    <TouchableOpacity style={styles.filterButton}>
                        {/* <Ionicons name="options-outline" size={24} color="#000" /> */}
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search stories..."
                        placeholderTextColor="#999"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color="#999" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Results Count */}
                <View style={styles.resultsContainer}>
                    <ThemedText style={styles.resultsText}>
                        {sortedStories.length} {sortedStories.length === 1 ? 'Story' : 'Stories'} found
                    </ThemedText>
                </View>

                {/* Stories List */}
                <FlatList
                    data={sortedStories}
                    renderItem={renderStoryItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.storiesList}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#4B59B3']}
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="search-outline" size={60} color="#ccc" />
                            <ThemedText style={styles.emptyText}>No stories found</ThemedText>
                            <ThemedText style={styles.emptySubtext}>Try adjusting your search or filter</ThemedText>
                        </View>
                    }
                />
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
        fontSize: 18,
        fontWeight: '400',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
    },
    filterButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 12,
        paddingHorizontal: 12,
        height: 45,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        elevation: 1
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#333',
        paddingVertical: 8,
    },
    resultsContainer: {
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    resultsText: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#999',
    },
    storiesList: {
        paddingHorizontal: 16,
        paddingBottom: 20,
        gap: 16,
    },
    storyCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        padding: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    storyImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 12,
    },
    storyContent: {
        flex: 1,
    },
    storyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    storyTitle: {
        fontSize: 15,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        flex: 1,
    },
    categoryBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        marginLeft: 8,
    },
    categoryBadgeText: {
        fontSize: 10,
        fontFamily: 'CoFoRaffineMedium',
    },
    storyHeadline: {
        fontSize: 13,
        fontFamily: 'CoFoRaffineMedium',
        color: '#333',
        marginBottom: 4,
        lineHeight: 16,
    },
    storyDescription: {
        fontSize: 12,
        fontFamily: 'tenez',
        color: '#666',
        marginBottom: 8,
        lineHeight: 15,
    },
    storyMeta: {
        flexDirection: 'row',
        gap: 12,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 11,
        fontFamily: 'tenez',
        color: '#999',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
    },
    emptyText: {
        fontSize: 18,
        fontFamily: 'CoFoRaffineBold',
        color: '#999',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#ccc',
        marginTop: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});