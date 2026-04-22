import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Foundation, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Modal,
    RefreshControl,
    Share,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import followService from '../../../services/followService';
import libraryService from '../../../services/libraryService';
import reactionService from '../../../services/reactionService';
import storyService from '../../../services/storyService';

export default function InboxHome({ navigation }) {
    const { colors } = useTheme();
    const [likedPosts, setLikedPosts] = useState({});
    const [likeCounts, setLikeCounts] = useState({});
    const [commentCounts, setCommentCounts] = useState({});
    const [shareCounts, setShareCounts] = useState({});
    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    
    // API states
    const [newsletters, setNewsletters] = useState([]);
    const [storyPosts, setStoryPosts] = useState([]);
    const [loadingNewsletters, setLoadingNewsletters] = useState(true);
    const [loadingStories, setLoadingStories] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
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

    // Fetch following list (newsletters)
    const fetchFollowingList = async () => {
        try {
            const result = await followService.getFollowing(currentUserId, 1, 20);

            console.log("result xx", result)
            
            if (result.success && result.data) {
                const formattedNewsletters = result.data.map(follow => ({
                    id: follow._id,
                    name: follow.name,
                    avatar: follow.profileImage,
                    bio: follow.bio,
                    followersCount: follow.followersCount,
                }));
                setNewsletters(formattedNewsletters);
            }
        } catch (error) {
            console.error('Error fetching following list:', error);
        } finally {
            setLoadingNewsletters(false);
        }
    };

    // Fetch stories
    const fetchStories = async () => {
        try {
            const result = await storyService.getStories('technology', 1, 10);
            
            if (result.success && result.data) {
                const formattedStories = await Promise.all(result.data.map(async (story) => {
                    let likeStatus = false;
                    let totalLikes = story.likes || 0;
                    let totalComments = 0;

                    try {
                        const reactionResult = await reactionService.getReactions(story._id);
                        if (reactionResult.success && reactionResult.data) {
                            totalLikes = reactionResult.data.summary?.total || 0;
                            likeStatus = reactionResult.data.myReaction === 'like';
                        }
                    } catch (error) {
                        console.error('Error fetching reactions:', error);
                    }

                    try {
                        const commentResult = await storyService.getCommentsCount?.(story._id);
                        if (commentResult?.success) {
                            totalComments = commentResult.count || 0;
                        }
                    } catch (error) {
                        console.error('Error fetching comment count:', error);
                    }

                    return {
                        id: story._id,
                        title: story.author?.name || 'Unknown Author',
                        timeAgo: formatTimeAgo(story.createdAt),
                        headline: story.title,
                        description: story.summary,
                        image: story.coverImage,
                        readTime: `${story.readingTime} min`,
                        type: story.isPremium ? 'Premium' : 'Article',
                        profileImage: story.author?.profileImage,
                        likeCount: totalLikes,
                        commentCount: totalComments,
                        shareCount: story.shares || 0,
                        createdAt: story.createdAt,
                        isLiked: likeStatus,
                        stats: {
                            likes: formatNumber(totalLikes),
                            comments: formatNumber(totalComments),
                            shares: formatNumber(story.shares || 0)
                        }
                    };
                }));
                
                setStoryPosts(formattedStories);
                
                // Set initial like states
                const likedState = {};
                const likeState = {};
                const commentState = {};
                const shareState = {};
                formattedStories.forEach(post => {
                    likedState[post.id] = post.isLiked;
                    likeState[post.id] = post.likeCount;
                    commentState[post.id] = post.commentCount;
                    shareState[post.id] = post.shareCount;
                });
                setLikedPosts(likedState);
                setLikeCounts(likeState);
                setCommentCounts(commentState);
                setShareCounts(shareState);
            }
        } catch (error) {
            console.error('Error fetching stories:', error);
        } finally {
            setLoadingStories(false);
        }
    };

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        return date.toLocaleDateString();
    };

    const formatNumber = (num) => {
        if (!num) return '0';
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await Promise.all([fetchFollowingList(), fetchStories()]);
        setRefreshing(false);
    };

    useEffect(() => {
        console.log("current", currentUserId)
        if (currentUserId) {
            fetchFollowingList();
        }
        fetchStories();
    }, [currentUserId]);

    const toggleLike = async (id, currentLikeCount) => {
        const isCurrentlyLiked = likedPosts[id];
        const newLikedState = !isCurrentlyLiked;

        setLikedPosts(prev => ({ ...prev, [id]: newLikedState }));
        setLikeCounts(prev => ({ 
            ...prev, 
            [id]: newLikedState ? currentLikeCount + 1 : currentLikeCount - 1 
        }));

        try {
            if (!isCurrentlyLiked) {
                const result = await reactionService.addReaction('story', id, 'like');
                if (!result.success) {
                    setLikedPosts(prev => ({ ...prev, [id]: isCurrentlyLiked }));
                    setLikeCounts(prev => ({ ...prev, [id]: currentLikeCount }));
                    Alert.alert('Error', 'Failed to like the post');
                }
            } else {
                const result = await reactionService.removeReaction('story', id);
                if (!result.success) {
                    setLikedPosts(prev => ({ ...prev, [id]: isCurrentlyLiked }));
                    setLikeCounts(prev => ({ ...prev, [id]: currentLikeCount }));
                    Alert.alert('Error', 'Failed to unlike the post');
                }
            }
        } catch (error) {
            console.error('Error toggling like:', error);
            setLikedPosts(prev => ({ ...prev, [id]: isCurrentlyLiked }));
            setLikeCounts(prev => ({ ...prev, [id]: currentLikeCount }));
        }
    };

    const handleComment = (post) => {
        navigation.navigate('StoryDetail', { storyId: post.id });
    };

    const handleShare = async (post) => {
        try {
            const shareUrl = `https://hoped.com/story/${post.id}`;
            const result = await Share.share({
                message: `${post.headline}\n\nRead more: ${shareUrl}\n\nShared via HOPED App`,
                title: 'Share Article',
                url: shareUrl
            });

            if (result.action === Share.sharedAction) {
                setShareCounts(prev => ({
                    ...prev,
                    [post.id]: (prev[post.id] || 0) + 1
                }));
            }
        } catch (error) {
            console.log('Error sharing:', error);
        }
    };

    const handleSavePost = async (postId) => {
        try {
            const result = await libraryService.toggleSave({
                contentType: 'story',
                contentId: postId,
                listType: 'saved'
            });
            
            if (result.success) {
                Alert.alert('Success', result.message || 'Post saved to library!');
            } else {
                Alert.alert('Error', result.error || 'Failed to save post');
            }
        } catch (error) {
            console.error('Error saving post:', error);
            Alert.alert('Error', 'Failed to save post');
        }
    };

    const handleThreeDotPress = (post) => {
        setSelectedPost(post);
        setMenuVisible(true);
    };

    const handleMenuOption = (option) => {
        setMenuVisible(false);
        switch (option) {
            case 'save':
                if (selectedPost) {
                    handleSavePost(selectedPost.id);
                }
                break;
            case 'report':
                Alert.alert('Report', 'Thank you for reporting. We will review this post.');
                break;
            case 'hide':
                Alert.alert('Hide', 'This post will be hidden from your feed.');
                break;
            case 'notInterested':
                Alert.alert('Not Interested', 'We will show fewer posts like this.');
                break;
        }
    };

    const renderNewsletterItem = ({ item }) => (
        <TouchableOpacity
            style={styles.newsletterItem}
            onPress={() => navigation.navigate("AuthorProfile", { 
                authorId: item.id,
                authorName: item.name,
                authorImage: item.avatar,
                authorBio: item.bio
            })}
        >
            <Image source={{ uri: item.avatar }} style={styles.newsletterAvatar} />
            <ThemedText style={styles.newsletterName} numberOfLines={1}>{item.name}</ThemedText>
        </TouchableOpacity>
    );

    const renderStoryPost = ({ item }) => {
        const isLiked = likedPosts[item.id] || false;
        const displayLikes = likeCounts[item.id] !== undefined ? likeCounts[item.id] : item.likeCount;
        const displayComments = commentCounts[item.id] !== undefined ? commentCounts[item.id] : item.commentCount;
        const displayShares = shareCounts[item.id] !== undefined ? shareCounts[item.id] : item.shareCount;

        return (
            <View style={styles.storyContainer}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => navigation.navigate('StoryDetail', { postId: item.id })}
                >
                    <View style={styles.storyHeader}>
                        <View style={styles.storyHeaderLeft}>
                            <Image source={{ uri: item.profileImage }} style={styles.storyAvatar} />
                            <View style={styles.storyHeaderText}>
                                <View style={styles.storyTitleRow}>
                                    <ThemedText style={styles.storyTitle}>{item.title}</ThemedText>
                                    <ThemedText style={styles.storyTimeAgo}> · {item.timeAgo}</ThemedText>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => handleThreeDotPress(item)}>
                            <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.storyContentSection}>
                        <ThemedText style={styles.storyHeadline}>{item.headline}</ThemedText>
                        <ThemedText style={styles.storyDescription} numberOfLines={2}>
                            {item.description}
                        </ThemedText>
                    </View>
                </TouchableOpacity>

                <View style={styles.storyStatsContainer}>
                    <TouchableOpacity
                        style={styles.storyStatItem}
                        onPress={() => toggleLike(item.id, displayLikes)}
                    >
                        <Foundation
                            name="like"
                            size={16}
                            color={isLiked ? "#4B59B3" : "#666"}
                        />
                        <ThemedText style={[styles.storyStatText, isLiked && { color: '#4B59B3' }]}>
                            {formatNumber(displayLikes)}
                        </ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.storyStatItem}
                        onPress={() => handleComment(item)}
                    >
                        <Ionicons name="chatbubble-outline" size={16} color="#666" />
                        <ThemedText style={styles.storyStatText}>
                            {formatNumber(displayComments)}
                        </ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.storyStatItem}
                        onPress={() => handleShare(item)}
                    >
                        <Ionicons name="share-social-outline" size={16} color="#666" />
                        <ThemedText style={styles.storyStatText}>
                            {formatNumber(displayShares)}
                        </ThemedText>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => navigation.navigate('StoryDetail', { storyId: item.id })}
                >
                    <View style={styles.storyFooter}>
                        <ThemedText style={styles.storyFooterText}>
                            Reading Time: {item.readTime}
                        </ThemedText>
                        <View style={styles.storyArticleBadge}>
                            <ThemedText style={styles.storyArticleBadgeText}>{item.type}</ThemedText>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    if (loadingNewsletters && loadingStories && !refreshing) {
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
                    <ThemedText style={styles.headerTitle}>Inbox</ThemedText>
                    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                        <TouchableOpacity
                            style={styles.composeButton}
                            onPress={() => navigation.navigate('Library')}
                        >
                            <MaterialCommunityIcons name="library-outline" size={24} color="black" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => navigation.navigate('Profile')}
                        >
                            <Image
                                source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
                                style={styles.headerAvatar}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Your Newsletters Section */}
                <View style={styles.newsletterSection}>
                    <View style={styles.newsletterHeader}>
                        <ThemedText style={styles.newsletterTitle}>Your Newsletters</ThemedText>
                        <TouchableOpacity onPress={() => navigation.navigate('Newsletter')}>
                            <ThemedText style={styles.newsletterSeeAll}>See All &gt;</ThemedText>
                        </TouchableOpacity>
                    </View>
                    {loadingNewsletters ? (
                        <View style={styles.newsletterLoader}>
                            <ActivityIndicator size="small" color="#4B59B3" />
                        </View>
                    ) : newsletters.length > 0 ? (
                        <FlatList
                            data={newsletters}
                            renderItem={renderNewsletterItem}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.newsletterList}
                        />
                    ) : (
                        <View style={styles.emptyNewsletter}>
                            <ThemedText style={styles.emptyNewsletterText}>No newsletters yet</ThemedText>
                            <ThemedText style={styles.emptyNewsletterSubText}>Follow authors to see them here</ThemedText>
                        </View>
                    )}
                </View>

                {/* Stories Section */}
                <View style={styles.storiesSection}>
                    <ThemedText style={styles.storiesTitle}>Stories</ThemedText>
                    <FlatList
                        data={storyPosts}
                        renderItem={renderStoryPost}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.storiesList}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={['#4B59B3']}
                            />
                        }
                        ListEmptyComponent={
                            !loadingStories ? (
                                <View style={styles.emptyStories}>
                                    <ThemedText style={styles.emptyStoriesText}>No stories available</ThemedText>
                                </View>
                            ) : null
                        }
                    />
                </View>
            </SafeAreaView>

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
                            onPress={() => handleMenuOption('save')}
                        >
                            <Ionicons name="bookmark-outline" size={20} color="#000" />
                            <ThemedText style={styles.menuText}>Save Post</ThemedText>
                        </TouchableOpacity>

                        {/* <View style={styles.menuDivider} /> */}

                        {/* <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => handleMenuOption('hide')}
                        >
                            <Ionicons name="eye-off-outline" size={20} color="#000" />
                            <ThemedText style={styles.menuText}>Hide Post</ThemedText>
                        </TouchableOpacity> */}

                        {/* <View style={styles.menuDivider} /> */}

                        {/* <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => handleMenuOption('notInterested')}
                        >
                            <Ionicons name="thumbs-down-outline" size={20} color="#000" />
                            <ThemedText style={styles.menuText}>Not Interested</ThemedText>
                        </TouchableOpacity>

                        <View style={styles.menuDivider} /> */}

                        {/* <TouchableOpacity
                            style={[styles.menuItem, styles.reportItem]}
                            onPress={() => handleMenuOption('report')}
                        >
                            <Ionicons name="flag-outline" size={20} color="#FF3B30" />
                            <ThemedText style={[styles.menuText, styles.reportText]}>Report Post</ThemedText>
                        </TouchableOpacity> */}
                    </View>
                </TouchableOpacity>
            </Modal>
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
    headerTitle: {
        fontSize: 24,
        fontWeight: '400',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
    },
    composeButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconButton: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerAvatar: {
        width: 30,
        height: 30,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#4B59B3',
    },
    newsletterSection: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    newsletterHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    newsletterTitle: {
        fontSize: 22,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
    },
    newsletterSeeAll: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#4B59B3',
    },
    newsletterList: {
        paddingLeft: 16,
        paddingRight: 8,
        gap: 16,
    },
    newsletterItem: {
        alignItems: 'center',
        marginRight: 16,
        width: 70,
    },
    newsletterAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 6,
        borderWidth: 2,
        borderColor: '#4B59B3',
    },
    newsletterName: {
        fontSize: 12,
        fontWeight: '500',
        fontFamily: 'CoFoRaffineMedium',
        color: '#000',
        textAlign: 'center',
    },
    newsletterLoader: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    emptyNewsletter: {
        alignItems: 'center',
        paddingVertical: 30,
    },
    emptyNewsletterText: {
        fontSize: 14,
        fontFamily: 'CoFoRaffineMedium',
        color: '#999',
    },
    emptyNewsletterSubText: {
        fontSize: 12,
        fontFamily: 'tenez',
        color: '#ccc',
        marginTop: 4,
    },
    storiesSection: {
        flex: 1,
        paddingTop: 16,
    },
    storiesTitle: {
        fontSize: 22,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    storiesList: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    storyContainer: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        marginBottom: 8,
        elevation: 1,
        marginBottom: 24,
        borderRadius: 12,
        padding: 12
    },
    storyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    storyHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    storyAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    storyHeaderText: {
        flex: 1,
    },
    storyTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    storyTitle: {
        fontSize: 16,
        fontWeight: '400',
        fontFamily: 'CoFoRaffineMedium',
        color: '#000',
    },
    storyTimeAgo: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#999',
    },
    storyContentSection: {
        marginBottom: 12,
    },
    storyHeadline: {
        fontSize: 18,
        fontWeight: '400',
        fontFamily: 'CoFoRaffineMedium',
        color: '#000',
        marginBottom: 8,
        lineHeight: 24,
    },
    storyDescription: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#666',
        lineHeight: 20,
    },
    storyStatsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 24,
        marginBottom: 12,
        paddingBottom: 12,
    },
    storyStatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    storyStatText: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#666',
    },
    storyFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    storyFooterText: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#666',
    },
    storyArticleBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 16,
    },
    storyArticleBadgeText: {
        fontSize: 14,
        fontFamily: 'CoFoRaffineBold',
        color: '#3448D6',
    },
    emptyStories: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyStoriesText: {
        fontSize: 16,
        fontFamily: 'tenez',
        color: '#999',
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
        width: '80%',
        maxWidth: 300,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
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
        marginHorizontal: 16,
    },
    reportItem: {},
    reportText: {
        color: '#FF3B30',
    },
});