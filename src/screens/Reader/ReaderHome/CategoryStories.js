import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { FontAwesome6, Foundation, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CategoryStories({ route, navigation }) {
    const { colors } = useTheme();
    const { category: initialCategory } = { category: 'All' };
    
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('latest'); // 'latest', 'popular', 'trending'

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
    ];

    // Mock stories data with categories
    const allStories = [
        {
            id: '1',
            title: 'Manchester United',
            headline: 'The Future of Digital Media and the Changing Voice of Independent Journalism...',
            description: 'As technology evolves and reader habits shift, independent platforms are redefining how stories are told...',
            image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            category: 'LIVE',
            timeAgo: '2 hours ago',
            likes: '3.5k',
            comments: '45k',
            shares: '150',
            readTime: '5 min',
        },
        {
            id: '2',
            title: 'Digital Revolution',
            headline: 'How AI is Transforming the Way We Consume News and Information',
            description: 'Artificial intelligence is reshaping journalism, bringing personalized content and real-time updates...',
            image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            category: 'Top Stories',
            timeAgo: '5 hours ago',
            likes: '2.1k',
            comments: '32k',
            shares: '89',
            readTime: '4 min',
        },
        {
            id: '3',
            title: 'Global Economy',
            headline: 'Markets React to Changing Political Landscapes Across Europe and Asia',
            description: 'Investors are watching closely as economic indicators shift and new policies take shape...',
            image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            category: 'Finance',
            timeAgo: '1 day ago',
            likes: '1.2k',
            comments: '18k',
            shares: '56',
            readTime: '6 min',
        },
        {
            id: '4',
            title: 'Cultural Renaissance',
            headline: 'How Local Artists Are Gaining Global Recognition Through Digital Platforms',
            description: 'The internet has democratized art, allowing creators from remote corners to reach international audiences...',
            image: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80',
            category: 'Culture',
            timeAgo: '3 days ago',
            likes: '856',
            comments: '12k',
            shares: '42',
            readTime: '7 min',
        },
        {
            id: '5',
            title: 'Tech Innovation',
            headline: 'How Startups Are Revolutionizing the Way We Work and Live',
            description: 'New technologies are emerging every day, changing how we interact with the world around us...',
            image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            category: 'Bricflog',
            timeAgo: '6 hours ago',
            likes: '4.2k',
            comments: '67k',
            shares: '234',
            readTime: '3 min',
        },
        {
            id: '6',
            title: 'Travel Destinations',
            headline: 'Hidden Gems: Unexplored Places That Will Take Your Breath Away',
            description: 'Discover off-the-beaten-path destinations that offer unique experiences and unforgettable memories...',
            image: 'https://images.unsplash.com/photo-1502920917128-1aa500764b2e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            category: 'Travel',
            timeAgo: '2 days ago',
            likes: '3.8k',
            comments: '42k',
            shares: '189',
            readTime: '8 min',
        },
        {
            id: '7',
            title: 'Political Analysis',
            headline: 'Understanding the Shift in Global Political Dynamics',
            description: 'Experts analyze the changing political landscape and what it means for international relations...',
            image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            category: 'Politics',
            timeAgo: '4 hours ago',
            likes: '2.7k',
            comments: '38k',
            shares: '112',
            readTime: '10 min',
        },
        {
            id: '8',
            title: 'Business Trends',
            headline: 'How Companies Are Adapting to the New Digital Economy',
            description: 'From remote work to digital transformation, businesses are evolving at an unprecedented pace...',
            image: 'https://images.unsplash.com/photo-1664575602554-2087b04935a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            category: 'Business',
            timeAgo: '12 hours ago',
            likes: '1.9k',
            comments: '24k',
            shares: '78',
            readTime: '5 min',
        },
    ];

    // Filter stories based on selected category and search query
    const filteredStories = allStories.filter(story => {
        const matchesCategory = selectedCategory === 'All' || story.category === selectedCategory;
        const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             story.headline.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Sort stories based on sortBy
    const sortedStories = [...filteredStories].sort((a, b) => {
        if (sortBy === 'latest') {
            return a.timeAgo.includes('hour') && b.timeAgo.includes('day') ? -1 : 1;
        } else if (sortBy === 'popular') {
            return parseInt(b.likes) - parseInt(a.likes);
        } else {
            return parseInt(b.comments) - parseInt(a.comments);
        }
    });

    const renderStoryItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.storyCard}
            onPress={() => navigation.navigate('StoryDetail', { storyId: item.id })}
        >
            <Image source={{ uri: item.image }} style={styles.storyImage} />
            <View style={styles.storyContent}>
                <View style={styles.storyHeader}>
                    <ThemedText style={styles.storyTitle}>{item.title}</ThemedText>
                    <View style={[styles.categoryBadge, { backgroundColor: categories.find(c => c.name === item.category)?.color + '20' }]}>
                        <ThemedText style={[styles.categoryBadgeText, { color: categories.find(c => c.name === item.category)?.color }]}>
                            {item.category}
                        </ThemedText>
                    </View>
                </View>
                
                <ThemedText style={styles.storyHeadline} numberOfLines={2}>
                    {item.headline}
                </ThemedText>
                
                <ThemedText style={styles.storyDescription} numberOfLines={2}>
                    {item.description}
                </ThemedText>

                <View style={styles.storyMeta}>
                    <View style={styles.metaItem}>
                        <Ionicons name="time-outline" size={14} color="#999" />
                        <ThemedText style={styles.metaText}>{item.timeAgo}</ThemedText>
                    </View>
                    <View style={styles.metaItem}>
                        <Foundation name="like" size={14} color="#999" />
                        <ThemedText style={styles.metaText}>{item.likes}</ThemedText>
                    </View>
                    <View style={styles.metaItem}>
                        <MaterialCommunityIcons name="message-text-outline" size={14} color="#999" />
                        <ThemedText style={styles.metaText}>{item.comments}</ThemedText>
                    </View>
                    <View style={styles.metaItem}>
                        <FontAwesome6 name="share-from-square" size={12} color="#999" />
                        <ThemedText style={styles.metaText}>{item.shares}</ThemedText>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <ThemedText style={styles.headerTitle}>Categories</ThemedText>
                    <TouchableOpacity style={styles.filterButton}>
                        <Ionicons name="options-outline" size={24} color="#000" />
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

                {/* Categories Horizontal Scroll */}
                {/* <View style={styles.categoriesContainer}>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoriesScroll}
                    >
                        {categories.map((category) => (
                            <TouchableOpacity
                                key={category.id}
                                style={[
                                    styles.categoryChip,
                                    selectedCategory === category.name && styles.categoryChipActive,
                                    { borderColor: category.color }
                                ]}
                                onPress={() => setSelectedCategory(category.name)}
                            >
                                <Ionicons 
                                    name={category.icon} 
                                    size={16} 
                                    color={selectedCategory === category.name ? '#FFFFFF' : category.color} 
                                />
                                <ThemedText 
                                    style={[
                                        styles.categoryChipText,
                                        selectedCategory === category.name && styles.categoryChipTextActive
                                    ]}
                                >
                                    {category.name}
                                </ThemedText>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View> */}

                {/* Sort Options */}
                <View style={styles.sortContainer}>
                    <ThemedText style={styles.sortLabel}>Sort by:</ThemedText>
                    <TouchableOpacity 
                        style={[styles.sortOption, sortBy === 'latest' && styles.sortOptionActive]}
                        onPress={() => setSortBy('latest')}
                    >
                        <ThemedText style={[styles.sortOptionText, sortBy === 'latest' && styles.sortOptionTextActive]}>
                            Latest
                        </ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.sortOption, sortBy === 'popular' && styles.sortOptionActive]}
                        onPress={() => setSortBy('popular')}
                    >
                        <ThemedText style={[styles.sortOptionText, sortBy === 'popular' && styles.sortOptionTextActive]}>
                            Popular
                        </ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.sortOption, sortBy === 'trending' && styles.sortOptionActive]}
                        onPress={() => setSortBy('trending')}
                    >
                        <ThemedText style={[styles.sortOptionText, sortBy === 'trending' && styles.sortOptionTextActive]}>
                            Trending
                        </ThemedText>
                    </TouchableOpacity>
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
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.storiesList}
                    showsVerticalScrollIndicator={false}
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
    categoriesContainer: {
        marginBottom: 16,
    },
    categoriesScroll: {
        paddingHorizontal: 16,
        gap: 10,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        gap: 6,
        backgroundColor: '#FFFFFF',
    },
    categoryChipActive: {
        backgroundColor: '#4B59B3',
        borderColor: '#4B59B3',
    },
    categoryChipText: {
        fontSize: 13,
        fontFamily: 'CoFoRaffineMedium',
        color: '#666',
    },
    categoryChipTextActive: {
        color: '#FFFFFF',
    },
    sortContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
        gap: 12,
    },
    sortLabel: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#999',
    },
    sortOption: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 16,
        backgroundColor: '#F5F5F5',
    },
    sortOptionActive: {
        backgroundColor: '#4B59B3',
    },
    sortOptionText: {
        fontSize: 13,
        fontFamily: 'CoFoRaffineMedium',
        color: '#666',
    },
    sortOptionTextActive: {
        color: '#FFFFFF',
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
});