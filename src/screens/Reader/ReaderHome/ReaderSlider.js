import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    Share,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import Carousel from 'react-native-snap-carousel-new';
import storyService from '../../../services/storyService';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;
const CARD_HEIGHT = 410;
const SLIDER_WIDTH = 400;


import { LogBox } from 'react-native';

LogBox.ignoreLogs([
    'A props object containing a "key" prop is being spread into JSX',
    'EventEmitter.removeListener'
]);

export default function ReaderSlider() {
    const { colors } = useTheme();
    const [likedItems, setLikedItems] = useState({});
    const [bookmarkedItems, setBookmarkedItems] = useState({});
    const [likeCounts, setLikeCounts] = useState({});
    const [activeIndex, setActiveIndex] = useState(0);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const carouselRef = useRef(null);

    // Fetch stories from API
    const fetchStories = async (category = 'technology', pageNum = 1, isLoadMore = false) => {
        try {
            const result = await storyService.getStories(category, pageNum, 10);
            
            if (result.success && result.data) {
                const newArticles = result.data.map(story => ({
                    id: story._id,
                    title: story.author?.name || 'Unknown Author',
                    subtitle: story.title,
                    description: story.summary,
                    image: story.coverImage,
                    category: story.category,
                    readTime: `${story.readingTime} min read`,
                    likes: story.likes || Math.floor(Math.random() * 100) + 50,
                    comments: story.comments || Math.floor(Math.random() * 20) + 1,
                    isPremium: story.isPremium,
                    authorId: story.author?._id,
                    createdAt: story.createdAt,
                }));
                
                if (isLoadMore) {
                    setArticles(prev => [...prev, ...newArticles]);
                } else {
                    setArticles(newArticles);
                }
                
                // Check if more pages available
                if (result.pagination) {
                    setHasMore(pageNum < result.pagination.totalPages);
                }
                setPage(pageNum);
            }
        } catch (error) {
            console.error('Error fetching stories:', error);
            Alert.alert('Error', 'Failed to load stories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStories('technology', 1);
    }, []);

    const toggleLike = async (id, currentLikes) => {
        const newLikedState = !likedItems[id];
        setLikedItems(prev => ({
            ...prev,
            [id]: newLikedState
        }));

        // Update like count
        setLikeCounts(prev => ({
            ...prev,
            [id]: newLikedState ? (prev[id] || currentLikes) + 1 : (prev[id] || currentLikes) - 1
        }));

        // Call API to like/unlike
        if (newLikedState) {
            await storyService.likeStory(id);
        } else {
            await storyService.unlikeStory(id);
        }
    };

    const toggleBookmark = async (id) => {
        const newState = !bookmarkedItems[id];
        setBookmarkedItems(prev => ({
            ...prev,
            [id]: newState
        }));

        // Call API to bookmark/unbookmark
        if (newState) {
            await storyService.bookmarkStory(id);
            Alert.alert('Saved', 'Article bookmarked successfully!');
        } else {
            await storyService.unbookmarkStory(id);
            Alert.alert('Removed', 'Bookmark removed');
        }
    };

    const handleShare = async (item) => {
        try {
            await Share.share({
                message: `${item.subtitle}\n\n${item.description}\n\nRead more on HOPED app`,
                title: 'Share Article'
            });
        } catch (error) {
            console.log('Error sharing:', error);
        }
    };

    const handleComment = (item) => {
        // Navigate to comments screen
        Alert.alert('Comments', `Comments for ${item.subtitle}\nTotal comments: ${item.comments}`);
    };

    const onSnapToItem = (index) => {
        setActiveIndex(index);
        
        // Load more when reaching near the end
        if (index === articles.length - 2 && hasMore && !loading) {
            setLoading(true);
            fetchStories('technology', page + 1, true);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    };

    const renderItem = ({ item, index }) => {
        const isLiked = likedItems[item.id] || false;
        const isBookmarked = bookmarkedItems[item.id] || false;
        const isActive = index === activeIndex;

        const currentLikeCount = likeCounts[item.id] !== undefined
            ? likeCounts[item.id]
            : item.likes;

        return (
            <View style={[
                styles.cardContainer,
                {
                    backgroundColor: '#FFFFFF',
                    shadowColor: '#000',
                }
            ]}>
                <Image
                    source={{ uri: item.image }}
                    style={styles.cardImage}
                />

                {/* Premium Badge */}
                {item.isPremium && (
                    <View style={styles.premiumBadge}>
                        <ThemedText style={styles.premiumText}>PREMIUM</ThemedText>
                    </View>
                )}

                {/* Bookmark at top right */}
                <TouchableOpacity
                    style={styles.bookmarkButton}
                    onPress={() => toggleBookmark(item.id)}
                >
                    <Ionicons
                        name={isBookmarked ? "bookmark" : "bookmark-outline"}
                        size={24}
                        color={isBookmarked ? "#4B59B3" : "#FFFFFF"}
                    />
                </TouchableOpacity>

                <View style={[styles.categoryBadge, { backgroundColor: '#4B59B3' }]}>
                    <ThemedText style={styles.categoryText}>{item.category}</ThemedText>
                </View>

                <View style={styles.cardContent}>
                    <ThemedText style={styles.cardTitle}>{item.title}</ThemedText>

                    <ThemedText style={styles.cardSubtitle} numberOfLines={2}>
                        {item.subtitle}
                    </ThemedText>

                    <ThemedText style={styles.cardDescription} numberOfLines={2}>
                        {item.description}
                    </ThemedText>

                    <View style={styles.footerContainer}>
                        <View style={styles.metaItem}>
                            <Ionicons name="time-outline" size={14} color="#666" />
                            <ThemedText style={styles.metaText}>{item.readTime}</ThemedText>
                        </View>

                        <View style={styles.actionIcons}>
                            {/* Like button with count */}
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => toggleLike(item.id, item.likes)}
                            >
                                <Ionicons
                                    name={isLiked ? "thumbs-up" : "thumbs-up-outline"}
                                    size={18}
                                    color={isLiked ? "#4B59B3" : "#666"}
                                />
                                <ThemedText style={[
                                    styles.actionText,
                                    { color: isLiked ? "#4B59B3" : "#666" }
                                ]}>
                                    {currentLikeCount}
                                </ThemedText>
                            </TouchableOpacity>

                            {/* Comment button with count */}
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => handleComment(item)}
                            >
                                <Ionicons name="chatbubble-outline" size={18} color="#666" />
                                <ThemedText style={styles.actionText}>{item.comments}</ThemedText>
                            </TouchableOpacity>

                            {/* Share button */}
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => handleShare(item)}
                            >
                                <Ionicons name="share-social-outline" size={18} color="#666" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    if (loading && articles.length === 0) {
        return (
            <ThemedView style={[styles.container, styles.centerContainer]}>
                <ActivityIndicator size="large" color="#4B59B3" />
            </ThemedView>
        );
    }

    if (articles.length === 0 && !loading) {
        return (
            <ThemedView style={[styles.container, styles.centerContainer]}>
                <ThemedText style={styles.noDataText}>No stories available</ThemedText>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <Carousel
                layout="stack"
                ref={carouselRef}
                data={articles}
                renderItem={renderItem}
                sliderWidth={SLIDER_WIDTH}
                itemWidth={350}
                inactiveSlideScale={0.9}
                inactiveSlideOpacity={0.7}
                loop={false}
                autoplay={false}
                onSnapToItem={onSnapToItem}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: -10,
    },
    centerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 300,
    },
    noDataText: {
        fontSize: 16,
        fontFamily: 'tenez',
        color: '#999',
    },
    cardContainer: {
        width: '100%',
        height: CARD_HEIGHT,
        borderRadius: 16,
        overflow: 'hidden',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: '#0000001F'
    },
    cardImage: {
        width: '100%',
        height: 220,
        resizeMode: 'cover',
    },
    bookmarkButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
        padding: 6,
    },
    categoryBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 16,
    },
    premiumBadge: {
        position: 'absolute',
        top: 12,
        left: 100,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 16,
        backgroundColor: '#FF9500',
    },
    premiumText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineMedium',
    },
    categoryText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineMedium',
    },
    cardContent: {
        padding: 12,
        justifyContent: 'space-between',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        fontFamily: 'CoFoRaffineBold',
        marginBottom: 14,
        color: '#000',
    },
    cardSubtitle: {
        fontSize: 13,
        fontWeight: '500',
        fontFamily: 'CoFoRaffineMedium',
        marginBottom: 14,
        color: '#333',
        lineHeight: 16,
    },
    cardDescription: {
        fontSize: 12,
        fontWeight: '400',
        fontFamily: 'tenez',
        marginBottom: 8,
        color: '#666',
        lineHeight: 15,
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 11,
        fontFamily: 'tenez',
        color: '#666',
    },
    actionIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    actionText: {
        fontSize: 11,
        fontFamily: 'tenez',
        color: '#666',
    },
});