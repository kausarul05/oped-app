import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { FontAwesome6, Foundation, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Modal,
    Share,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import storyService from '../../../services/storyService';

export default function PostsList() {
    const { colors } = useTheme();
    const [likedPosts, setLikedPosts] = useState({});
    const [likeCounts, setLikeCounts] = useState({});
    const [menuVisible, setMenuVisible] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const navigation = useNavigation();

    // Fetch posts from API
    const fetchPosts = async (pageNum = 1, isLoadMore = false) => {
        try {
            const result = await storyService.getStories('technology', pageNum, 10);
            
            if (result.success && result.data) {
                const newPosts = result.data.map(story => ({
                    id: story._id,
                    title: story.author?.name || 'Unknown Author',
                    timeAgo: formatDate(story.createdAt),
                    headline: story.title,
                    description: story.summary?.substring(0, 150) + '...',
                    image: story.coverImage,
                    likes: story.likes || Math.floor(Math.random() * 100) + 50,
                    comments: story.comments || Math.floor(Math.random() * 20) + 1,
                    shares: story.shares || Math.floor(Math.random() * 10) + 1,
                    readTime: `${story.readingTime} min`,
                    type: story.isPremium ? 'Premium' : 'Article',
                    profileImage: story.author?.profileImage || 'https://randomuser.me/api/portraits/men/1.jpg',
                    likeCount: story.likes ? story.likes / 1000000 : 3.5,
                    commentCount: story.comments ? story.comments / 1000 : 45,
                    shareCount: story.shares || 150,
                    isPremium: story.isPremium,
                    createdAt: story.createdAt,
                }));
                
                if (isLoadMore) {
                    setPosts(prev => [...prev, ...newPosts]);
                } else {
                    setPosts(newPosts);
                }
                
                // Check if more pages available
                if (result.pagination) {
                    setHasMore(pageNum < result.pagination.totalPages);
                }
                setPage(pageNum);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            Alert.alert('Error', 'Failed to load posts');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchPosts(1);
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffHours < 24) {
            return `${diffHours} hours ago`;
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        }
        return date.toLocaleDateString();
    };

    const onRefresh = () => {
        setRefreshing(true);
        setPage(1);
        fetchPosts(1);
    };

    const loadMore = () => {
        if (hasMore && !loading && !refreshing) {
            fetchPosts(page + 1, true);
        }
    };

    const toggleLike = async (id, currentLikeCount) => {
        const isLiked = likedPosts[id];
        setLikedPosts(prev => ({
            ...prev,
            [id]: !prev[id]
        }));

        // Update like count
        setLikeCounts(prev => ({
            ...prev,
            [id]: !isLiked ? currentLikeCount + 0.1 : currentLikeCount - 0.1
        }));

        // Call API to like/unlike
        if (!isLiked) {
            await storyService.likeStory(id);
        } else {
            await storyService.unlikeStory(id);
        }
    };

    const handleShare = async (post) => {
        try {
            const result = await Share.share({
                message: `${post.headline}\n\n${post.description}\n\nRead more on HOPED app`,
                title: 'Share Article'
            });

            if (result.action === Share.sharedAction) {
                Alert.alert('Shared', 'Post shared successfully!');
            }
        } catch (error) {
            console.log('Error sharing:', error);
        }
    };

    const handleComment = (post) => {
        Alert.alert(
            'Comments',
            `This post has ${post.commentCount}k comments. Would you like to add one?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'View Comments', onPress: () => console.log('View comments') },
                { text: 'Add Comment', onPress: () => console.log('Add comment') },
            ]
        );
    };

    const handleThreeDotPress = (postId) => {
        setSelectedPost(postId);
        setMenuVisible(true);
    };

    const handleMenuOption = (option) => {
        setMenuVisible(false);
        switch (option) {
            case 'report':
                Alert.alert('Report', 'Thank you for reporting. We will review this post.');
                break;
            case 'hide':
                Alert.alert('Hide', 'This post will be hidden from your feed.');
                break;
            case 'save':
                Alert.alert('Save', 'Post saved to bookmarks!');
                break;
            case 'notInterested':
                Alert.alert('Not Interested', 'We will show fewer posts like this.');
                break;
        }
    };

    const renderPost = ({ item }) => {
        const isLiked = likedPosts[item.id] || false;

        // Format like count display
        const displayLikes = likeCounts[item.id]
            ? likeCounts[item.id].toFixed(1)
            : item.likeCount;

        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.navigate('StoryDetail', {
                    postId: item.id,
                })}
            >
                <View style={styles.postContainer}>
                    {/* Premium Badge */}
                    {item.isPremium && (
                        <View style={styles.premiumBadge}>
                            <ThemedText style={styles.premiumText}>PREMIUM</ThemedText>
                        </View>
                    )}

                    {/* Header Section */}
                    <View style={styles.postHeader}>
                        <View style={styles.headerLeft}>
                            <Image
                                source={{ uri: item.profileImage }}
                                style={styles.avatar}
                            />
                            <View style={styles.headerText}>
                                <View style={styles.titleRow}>
                                    <ThemedText style={styles.postTitle}>{item.title}</ThemedText>
                                    <ThemedText style={styles.timeAgo}> · {item.timeAgo}</ThemedText>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => handleThreeDotPress(item.id)}>
                            <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>

                    {/* Content Section */}
                    <View style={styles.contentSection}>
                        <ThemedText style={styles.headline}>{item.headline}</ThemedText>
                        <ThemedText style={styles.description}>{item.description}</ThemedText>
                    </View>

                    {/* Action Buttons - Like, Comment, Share */}
                    <View style={styles.actionContainer}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => toggleLike(item.id, item.likeCount)}
                        >
                            <Foundation
                                name="like"
                                size={24}
                                color={isLiked ? "#4B59B3" : "black"}
                            />
                            <ThemedText style={[styles.actionText, isLiked && { color: '#4B59B3' }]}>
                                {displayLikes}
                            </ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleComment(item)}
                        >
                            <MaterialCommunityIcons name="message-text-outline" size={24} color="black" />
                            <ThemedText style={styles.actionText}>{item.commentCount}k</ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleShare(item)}
                        >
                            <FontAwesome6 name="share-from-square" size={24} color="black" />
                            <ThemedText style={styles.actionText}>{item.shareCount}</ThemedText>
                        </TouchableOpacity>
                    </View>

                    {/* Footer with Reading Time and Article Type */}
                    <View style={styles.footer}>
                        <ThemedText style={styles.footerText}>
                            Reading Time: {item.readTime}
                        </ThemedText>
                        <View style={styles.articleBadge}>
                            <ThemedText style={styles.articleBadgeText}>{item.type}</ThemedText>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading && posts.length === 0) {
        return (
            <ThemedView style={[styles.container, styles.centerContainer]}>
                <ActivityIndicator size="large" color="#4B59B3" />
            </ThemedView>
        );
    }

    if (posts.length === 0 && !loading) {
        return (
            <ThemedView style={[styles.container, styles.centerContainer]}>
                <ThemedText style={styles.noDataText}>No stories available</ThemedText>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                refreshing={refreshing}
                onRefresh={onRefresh}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    loading && posts.length > 0 ? (
                        <View style={styles.loaderFooter}>
                            <ActivityIndicator size="small" color="#4B59B3" />
                        </View>
                    ) : null
                }
            />

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

                        <View style={styles.menuDivider} />

                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => handleMenuOption('hide')}
                        >
                            <Ionicons name="eye-off-outline" size={20} color="#000" />
                            <ThemedText style={styles.menuText}>Hide Post</ThemedText>
                        </TouchableOpacity>

                        <View style={styles.menuDivider} />

                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => handleMenuOption('notInterested')}
                        >
                            <Ionicons name="thumbs-down-outline" size={20} color="#000" />
                            <ThemedText style={styles.menuText}>Not Interested</ThemedText>
                        </TouchableOpacity>

                        <View style={styles.menuDivider} />

                        <TouchableOpacity
                            style={[styles.menuItem, styles.reportItem]}
                            onPress={() => handleMenuOption('report')}
                        >
                            <Ionicons name="flag-outline" size={20} color="#FF3B30" />
                            <ThemedText style={[styles.menuText, styles.reportText]}>Report Post</ThemedText>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 200,
        paddingVertical: 40,
    },
    noDataText: {
        fontSize: 16,
        fontFamily: 'tenez',
        color: '#999',
    },
    listContent: {
        paddingVertical: 8,
    },
    postContainer: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        marginBottom: 8,
        elevation: 1,
        borderRadius: 8,
        marginBottom: 18,
        position: 'relative',
    },
    premiumBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        zIndex: 10,
        backgroundColor: '#FF9500',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 16,
    },
    premiumText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineMedium',
    },
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    headerText: {
        // flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    postTitle: {
        fontSize: 16,
        fontWeight: '400',
        fontFamily: 'CoFoRaffineMedium',
        color: '#000',
    },
    timeAgo: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#999',
    },
    contentSection: {
        marginBottom: 12,
    },
    headline: {
        fontSize: 18,
        fontWeight: '400',
        fontFamily: 'CoFoRaffineMedium',
        color: '#000',
        marginBottom: 8,
        lineHeight: 24,
    },
    description: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#666',
        lineHeight: 20,
    },
    actionContainer: {
        flexDirection: 'row',
        gap: 24,
        alignItems: 'center',
        marginBottom: 8,
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
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    footerText: {
        fontSize: 14,
        fontFamily: 'tenez',
    },
    articleBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 16,
    },
    articleBadgeText: {
        fontSize: 14,
        fontFamily: 'CoFoRaffineBold',
        color: '#666',
        color: '#3448D6'
    },
    loaderFooter: {
        paddingVertical: 20,
        alignItems: 'center',
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