import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Foundation, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    Share,
    StyleSheet,
    TouchableOpacity,
    useWindowDimensions,
    View
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';
import reactionService from '../../../services/reactionService';
import storyService from '../../../services/storyService';

export default function WriterStoreDetail({ route, navigation }) {
    const { width } = useWindowDimensions();
    const { colors } = useTheme();
    const { storyId } = route.params || {};

    // console.log("storyId", storyId)

    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [relatedStories, setRelatedStories] = useState([]);
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

    // Fetch story details from API
    useEffect(() => {
        if (storyId) {
            fetchStoryDetail();
            fetchRelatedStories();
        }
    }, [storyId]);

    const fetchStoryDetail = async () => {
        try {
            const result = await storyService.getWriterStoryById(storyId);
            
            if (result.success && result.data) {
                const storyData = result.data.data || result.data;
                
                // Get like status
                let likeStatus = false;
                let totalLikes = storyData.likes || 0;
                try {
                    const reactionResult = await reactionService.getReactions(storyData._id);
                    if (reactionResult.success && reactionResult.data) {
                        totalLikes = reactionResult.data.summary?.total || 0;
                        likeStatus = reactionResult.data.myReaction === 'like';
                    }
                } catch (error) {
                    console.error('Error fetching reactions:', error);
                }
                
                setStory({
                    id: storyData._id,
                    title: storyData.title,
                    summary: storyData.summary,
                    content: storyData.content,
                    image: storyData.coverImage,
                    authorName: storyData.author?.name || 'Unknown Author',
                    authorId: storyData.author?._id,
                    authorImage: storyData.author?.profileImage || 'https://randomuser.me/api/portraits/men/1.jpg',
                    authorBio: storyData.author?.bio || 'No bio available',
                    postDate: formatDate(storyData.createdAt),
                    likes: totalLikes,
                    comments: storyData.comments || 0,
                    shares: storyData.shares || 0,
                    category: storyData.category,
                    tags: storyData.tags || [],
                    isPremium: storyData.isPremium,
                    status: storyData.status,
                    feedback: storyData.feedback,
                });
                setLikeCount(totalLikes);
                setLiked(likeStatus);
            }
        } catch (error) {
            console.error('Error fetching story:', error);
            Alert.alert('Error', 'Failed to load story');
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedStories = async () => {
        try {
            // Fetch stories from same category
            const result = await storyService.getStories('', 1, 5);
            if (result.success && result.data) {
                const filtered = result.data.filter(s => s._id !== storyId).slice(0, 3);
                const formatted = filtered.map(s => ({
                    id: s._id,
                    title: s.title,
                    description: s.summary?.substring(0, 80) + '...',
                    image: s.coverImage,
                    likes: s.likes || '0',
                    comments: s.comments || '0',
                    shares: s.shares || '0',
                }));
                setRelatedStories(formatted);
            }
        } catch (error) {
            console.error('Error fetching related stories:', error);
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

    // HTML styles
    const htmlStyles = {
        body: {
            fontSize: 16,
            fontFamily: 'tenez',
            color: '#444',
            lineHeight: 26,
        },
        p: {
            fontSize: 16,
            fontFamily: 'tenez',
            color: '#444',
            lineHeight: 26,
            marginBottom: 16,
        },
        h1: {
            fontSize: 24,
            fontWeight: '700',
            fontFamily: 'CoFoRaffineBold',
            color: '#000',
            lineHeight: 32,
            marginBottom: 16,
            marginTop: 8,
        },
        h2: {
            fontSize: 20,
            fontWeight: '600',
            fontFamily: 'CoFoRaffineBold',
            color: '#000',
            lineHeight: 28,
            marginBottom: 14,
            marginTop: 6,
        },
    };

    const toggleLike = async () => {
        const newLikedState = !liked;
        setLiked(newLikedState);
        setLikeCount(newLikedState ? likeCount + 1 : likeCount - 1);

        if (newLikedState) {
            const result = await reactionService.addReaction('story', story.id, 'like');
            console.log("result writer story", result)
            if (!result.success) {
                setLiked(!newLikedState);
                setLikeCount(likeCount);
                Alert.alert('Error', 'Failed to like the story');
            }
        } else {
            const result = await reactionService.addReaction('story', story.id, 'like');
            if (!result.success) {
                setLiked(!newLikedState);
                setLikeCount(likeCount);
                Alert.alert('Error', 'Failed to unlike the story');
            }
        }
    };

    const toggleBookmark = async () => {
        const newState = !bookmarked;
        setBookmarked(newState);

        if (newState) {
            await storyService.bookmarkStory(story.id);
            Alert.alert('Saved', 'Story bookmarked successfully!');
        } else {
            await storyService.unbookmarkStory(story.id);
            Alert.alert('Removed', 'Bookmark removed');
        }
    };

    const handleShare = async () => {
        try {
            const shareUrl = `https://hoped.com/story/${story.id}`;
            await Share.share({
                message: `${shareUrl}`,
                title: 'Share Story',
                url: shareUrl
            });
        } catch (error) {
            console.log('Error sharing:', error);
        }
    };

    const renderRelatedArticle = (item) => (
        <TouchableOpacity
            key={item.id}
            style={styles.relatedCard}
            onPress={() => navigation.push('WriterStoreDetail', { storyId: item.id })}
        >
            <View style={styles.relatedCardContent}>
                <View style={styles.relatedTextContent}>
                    <ThemedText style={styles.relatedTitle}>{item.title}</ThemedText>
                    <ThemedText style={styles.relatedDescription} numberOfLines={2}>
                        {item.description}
                    </ThemedText>
                </View>
                <Image source={{ uri: item.image }} style={styles.relatedImage} />
            </View>
            <View style={styles.relatedStatsRow}>
                <View style={styles.relatedStats}>
                    <View style={styles.relatedStatItem}>
                        <Foundation name="like" size={12} color="#999" />
                        <ThemedText style={styles.relatedStatText}>{item.likes}</ThemedText>
                    </View>
                    <View style={styles.relatedStatItem}>
                        <Ionicons name="chatbubble-outline" size={12} color="#999" />
                        <ThemedText style={styles.relatedStatText}>{item.comments}</ThemedText>
                    </View>
                    <View style={styles.relatedStatItem}>
                        <Ionicons name="share-social-outline" size={12} color="#999" />
                        <ThemedText style={styles.relatedStatText}>{item.shares}</ThemedText>
                    </View>
                </View>
                <TouchableOpacity>
                    <Ionicons name="ellipsis-horizontal" size={16} color="#999" />
                </TouchableOpacity>
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

    if (!story) {
        return (
            <ThemedView style={[styles.container, styles.centerContainer]}>
                <ThemedText style={styles.noDataText}>Story not found</ThemedText>
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

                    <View style={styles.headerActions}>
                        <ThemedText style={styles.headerTitle}>Store Detail</ThemedText>
                    </View>
                    <View />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Cover Image */}
                    <Image source={{ uri: story.image }} style={styles.coverImage} />

                    {/* Premium Badge */}
                    {story.isPremium && (
                        <View style={styles.premiumBadge}>
                            <ThemedText style={styles.premiumText}>PREMIUM</ThemedText>
                        </View>
                    )}

                    {/* Status Badge */}
                    {story.status && story.status !== 'published' && (
                        <View style={[styles.statusBadge, 
                            story.status === 'draft' && styles.statusDraft,
                            story.status === 'pending' && styles.statusPending,
                            story.status === 'revision' && styles.statusRevision,
                            story.status === 'rejected' && styles.statusRejected,
                        ]}>
                            <ThemedText style={styles.statusText}>
                                {story.status.charAt(0).toUpperCase() + story.status.slice(1)}
                            </ThemedText>
                        </View>
                    )}

                    {/* Title */}
                    <ThemedText style={styles.articleTitle}>{story.title}</ThemedText>

                    {/* Summary */}
                    <View style={styles.summaryContainer}>
                        <ThemedText style={styles.summary}>{story.summary}</ThemedText>
                    </View>

                    {/* Author Section */}
                    <TouchableOpacity
                        style={styles.authorSection}
                        // onPress={() => navigation.navigate('WriterProfile', { authorId: story.authorId })}
                    >
                        <Image source={{ uri: story.authorImage }} style={styles.authorImage} />
                        <View style={styles.authorInfo}>
                            <ThemedText style={styles.authorName}>{story.authorName}</ThemedText>
                            <ThemedText style={styles.postDate}>{story.postDate}</ThemedText>
                        </View>
                    </TouchableOpacity>

                    {/* HTML Content */}
                    <View style={styles.htmlContentArea}>
                        <RenderHTML
                            contentWidth={width - 32}
                            source={{ html: story.content?.replace(/\n/g, '<br/>') || '' }}
                            tagsStyles={htmlStyles}
                            defaultTextProps={{
                                style: { fontFamily: 'tenez' }
                            }}
                        />
                    </View>

                    {/* Tags Section */}
                    {story.tags && story.tags.length > 0 && (
                        <View style={styles.tagsSection}>
                            <ThemedText style={styles.tagsTitle}>Tags</ThemedText>
                            <View style={styles.tagsContainer}>
                                {story.tags.map((tag, index) => (
                                    <View key={index} style={styles.tagChip}>
                                        <ThemedText style={styles.tagText}>{tag}</ThemedText>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Feedback Section for Revision/Rejected */}
                    {(story.status === 'revision' || story.status === 'rejected') && story.feedback && (
                        <View style={styles.feedbackSection}>
                            <ThemedText style={styles.feedbackTitle}>Editor's Feedback</ThemedText>
                            <View style={styles.feedbackCard}>
                                <ThemedText style={styles.feedbackText}>{story.feedback}</ThemedText>
                            </View>
                        </View>
                    )}

                    {/* Action Buttons */}
                    {/* <View style={styles.actionContainer}>
                        <TouchableOpacity style={[styles.actionButton, liked && styles.actionButtonActive]} onPress={toggleLike}>
                            <Foundation name="like" size={22} color={liked ? "#4B59B3" : "#666"} />
                            <ThemedText style={[styles.actionText, liked && { color: '#4B59B3' }]}>{likeCount}</ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton}>
                            <MaterialCommunityIcons name="message-text-outline" size={22} color="#666" />
                            <ThemedText style={styles.actionText}>{story.comments}</ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                            <FontAwesome6 name="share-from-square" size={20} color="#666" />
                            <ThemedText style={styles.actionText}>{story.shares}</ThemedText>
                        </TouchableOpacity>
                    </View> */}

                    {/* Related Articles Section */}
                    {relatedStories.length > 0 && (
                        <View style={styles.relatedSection}>
                            <ThemedText style={styles.relatedSectionTitle}>Related Articles</ThemedText>
                            <View style={styles.relatedList}>
                                {relatedStories.map(item => renderRelatedArticle(item))}
                            </View>
                        </View>
                    )}
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
    centerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    noDataText: {
        fontSize: 16,
        fontFamily: 'tenez',
        color: '#999',
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
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerTitle: {
        fontSize: 22,
        color: '#000',
        fontFamily: 'CoFoRaffineBold',
    },
    scrollContent: {
        paddingBottom: 30,
    },
    coverImage: {
        width: '100%',
        height: 280,
        resizeMode: 'cover',
    },
    premiumBadge: {
        position: 'absolute',
        top: 80,
        right: 20,
        backgroundColor: '#FF9500',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        zIndex: 10,
    },
    premiumText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
    },
    statusBadge: {
        position: 'absolute',
        top: 80,
        left: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        zIndex: 10,
    },
    statusDraft: {
        backgroundColor: '#FF9500',
    },
    statusPending: {
        backgroundColor: '#FFC107',
    },
    statusRevision: {
        backgroundColor: '#FF3B30',
    },
    statusRejected: {
        backgroundColor: '#FF3B30',
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
    },
    articleTitle: {
        fontSize: 22,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        lineHeight: 30,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 16,
    },
    summaryContainer: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    summary: {
        fontSize: 16,
        fontFamily: 'tenez',
        color: '#555',
        lineHeight: 24,
    },
    authorSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        marginVertical: 8,
    },
    authorImage: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 12,
        borderWidth: 2,
        borderColor: '#4B59B3',
    },
    authorInfo: {
        flex: 1,
    },
    authorName: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        marginBottom: 4,
    },
    postDate: {
        fontSize: 13,
        fontFamily: 'tenez',
        color: '#999',
    },
    htmlContentArea: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    tagsSection: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    tagsTitle: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        marginBottom: 8,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tagChip: {
        backgroundColor: '#F0F0F0',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    tagText: {
        fontSize: 12,
        fontFamily: 'tenez',
        color: '#666',
    },
    feedbackSection: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    feedbackTitle: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#FF3B30',
        marginBottom: 8,
    },
    feedbackCard: {
        backgroundColor: '#FFF0F0',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FFE0E0',
    },
    feedbackText: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#444',
        lineHeight: 20,
    },
    actionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        marginVertical: 16,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    actionText: {
        fontSize: 14,
        fontFamily: 'CoFoRaffineMedium',
        color: '#666',
    },
    relatedSection: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    relatedSectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        marginBottom: 16,
    },
    relatedList: {
        gap: 16,
    },
    relatedCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        elevation: 1,
        padding: 12,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    relatedCardContent: {
        flexDirection: 'row',
        gap: 12,
        paddingBottom: 8,
    },
    relatedTextContent: {
        flex: 1,
    },
    relatedTitle: {
        fontSize: 15,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        marginBottom: 4,
        lineHeight: 18,
    },
    relatedDescription: {
        fontSize: 12,
        fontFamily: 'tenez',
        color: '#666',
        lineHeight: 16,
    },
    relatedImage: {
        width: 70,
        height: 70,
        borderRadius: 8,
    },
    relatedStatsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    relatedStats: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    relatedStatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    relatedStatText: {
        fontSize: 11,
        fontFamily: 'tenez',
        color: '#999',
    },
});