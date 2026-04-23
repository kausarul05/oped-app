import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { FontAwesome6, Foundation, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import commentService from '../../../services/commentService';
import libraryService from '../../../services/libraryService';
import reactionService from '../../../services/reactionService';
import storyService from '../../../services/storyService';

export default function PostsList() {
    const { colors } = useTheme();
    const [likedPosts, setLikedPosts] = useState({});
    const [likeCounts, setLikeCounts] = useState({});
    const [commentCounts, setCommentCounts] = useState({});
    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [savingPost, setSavingPost] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Comment Modal States
    const [commentModalVisible, setCommentModalVisible] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [replyText, setReplyText] = useState('');
    const [replyTo, setReplyTo] = useState(null);
    const [replyToName, setReplyToName] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);
    const [commentPage, setCommentPage] = useState(1);
    const [hasMoreComments, setHasMoreComments] = useState(true);
    const [loadingComments, setLoadingComments] = useState(false);

    const navigation = useNavigation();

    // Get current user ID from storage
    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const userDataString = await AsyncStorage.getItem('userData');
                const token = await AsyncStorage.getItem('authToken');
                
                if (userDataString && token) {
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
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error('Error getting current user:', error);
                setIsLoggedIn(false);
            }
        };
        getCurrentUser();
    }, []);

    // Check if user is premium (you can implement this based on your user data)
    const checkIsPremium = async () => {
        try {
            const userDataString = await AsyncStorage.getItem('userData');
            if (userDataString) {
                const userData = JSON.parse(userDataString);
                // Check if user has premium subscription
                return userData.data?.isSubscribed || userData.isSubscribed || false;
            }
            return false;
        } catch (error) {
            console.error('Error checking premium status:', error);
            return false;
        }
    };

    const handlePremiumContent = () => {
        Alert.alert(
            'Premium Content',
            'This content is only available for premium subscribers. Would you like to subscribe to access all premium content?',
            [
                { text: 'Maybe Later', style: 'cancel' },
                { 
                    text: 'Subscribe Now', 
                    onPress: () => navigation.navigate('Subscription')
                }
            ]
        );
    };

    const handlePostPress = async (item) => {
        if (item.isPremium) {
            const isPremium = await checkIsPremium();
            if (!isPremium) {
                handlePremiumContent();
                return;
            }
        }
        navigation.navigate('StoryDetail', { postId: item.id });
    };

    // Fetch posts from API
    const fetchPosts = async (pageNum = 1, isLoadMore = false) => {
        try {
            const result = await storyService.getStories('technology', pageNum, 10);

            if (result.success && result.data) {
                const newPosts = await Promise.all(result.data.map(async (story) => {
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
                        const commentResult = await commentService.getComments(story._id, 1, 1);
                        if (commentResult.success && commentResult.pagination) {
                            totalComments = commentResult.pagination.total || 0;
                        }
                    } catch (error) {
                        console.error('Error fetching comment count:', error);
                    }

                    return {
                        id: story._id,
                        title: story.author?.name || 'Unknown Author',
                        timeAgo: formatDate(story.createdAt),
                        headline: story.title,
                        description: story.summary?.substring(0, 150) + '...',
                        image: story.coverImage,
                        likes: totalLikes,
                        comments: totalComments,
                        shares: story.shares || 0,
                        readTime: `${story.readingTime} min`,
                        type: story.isPremium ? 'Premium' : 'Article',
                        profileImage: story.author?.profileImage || 'https://randomuser.me/api/portraits/men/1.jpg',
                        likeCount: totalLikes,
                        commentCount: totalComments,
                        shareCount: story.shares || 0,
                        isPremium: story.isPremium,
                        createdAt: story.createdAt,
                        isLiked: likeStatus,
                    };
                }));

                const likedState = {};
                const likeState = {};
                const commentState = {};
                newPosts.forEach(post => {
                    likedState[post.id] = post.isLiked;
                    likeState[post.id] = post.likes;
                    commentState[post.id] = post.comments;
                });
                setLikedPosts(likedState);
                setLikeCounts(likeState);
                setCommentCounts(commentState);

                if (isLoadMore) {
                    setPosts(prev => [...prev, ...newPosts]);
                } else {
                    setPosts(newPosts);
                }

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

    const formatCommentTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minutes ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
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
        if (!isLoggedIn) {
            Alert.alert('Login Required', 'Please login to like posts', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Login', onPress: () => navigation.navigate('login') }
            ]);
            return;
        }

        const isCurrentlyLiked = likedPosts[id];
        const newLikedState = !isCurrentlyLiked;

        setLikedPosts(prev => ({
            ...prev,
            [id]: newLikedState
        }));

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
                const result = await reactionService.addReaction('story', id, 'like');
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

    const handleShare = async (post) => {
        try {
            const shareUrl = `https://hoped.com/story/${post.id}`;
            const result = await Share.share({
                message: `${shareUrl}`,
                title: 'Share Article',
                url: shareUrl
            });

            if (result.action === Share.sharedAction) {
                Alert.alert('Shared', 'Post shared successfully!');
            }
        } catch (error) {
            console.log('Error sharing:', error);
        }
    };

    // Save/Unsave Post Function
    const handleSavePost = async (postId) => {
        if (!isLoggedIn) {
            Alert.alert('Login Required', 'Please login to save posts', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Login', onPress: () => navigation.navigate('login') }
            ]);
            return;
        }

        if (savingPost) return;
        
        setSavingPost(true);
        try {
            const result = await libraryService.toggleSave({
                contentType: 'story',
                contentId: postId,
                listType: 'saved'
            });
            
            if (result.success) {
                Alert.alert('Success', result.message || 'Post saved to library!');
                setMenuVisible(false);
                setSelectedPost(null);
            } else {
                Alert.alert('Error', result.error || 'Failed to save post');
            }
        } catch (error) {
            console.error('Error saving post:', error);
            Alert.alert('Error', 'Failed to save post');
        } finally {
            setSavingPost(false);
        }
    };

    const handleThreeDotPress = (post) => {
        setSelectedPost(post);
        setMenuVisible(true);
    };

    const handleMenuOption = (option, post) => {
        setMenuVisible(false);
        switch (option) {
            case 'save':
                handleSavePost(post.id);
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

    // Comment Functions
    const openCommentModal = async (post) => {
        if (!isLoggedIn) {
            Alert.alert('Login Required', 'Please login to view comments', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Login', onPress: () => navigation.navigate('login') }
            ]);
            return;
        }

        setCurrentPost(post);
        setCommentModalVisible(true);
        setCommentPage(1);
        setHasMoreComments(true);
        setReplyTo(null);
        setReplyToName('');
        await fetchComments(post.id, 1);
    };

    const fetchComments = async (postId, pageNum = 1, isLoadMore = false) => {
        try {
            setLoadingComments(true);
            const result = await commentService.getComments(postId, pageNum, 10);

            if (result.success && result.data) {
                const formattedComments = result.data.map(comment => {
                    let authorId = null;
                    if (comment.author?._id) {
                        authorId = comment.author._id;
                    } else if (comment.author) {
                        authorId = comment.author;
                    }
                    
                    return {
                        id: comment._id,
                        content: comment.content,
                        authorName: comment.author?.name || 'User',
                        authorId: authorId,
                        authorImage: comment.author?.profileImage || 'https://randomuser.me/api/portraits/men/1.jpg',
                        likesCount: comment.likesCount || 0,
                        dislikesCount: comment.dislikesCount || 0,
                        createdAt: comment.createdAt,
                        isLiked: false,
                        isDisliked: false,
                        isOwnComment: authorId === currentUserId,
                        replies: comment.replies?.map(reply => {
                            let replyAuthorId = null;
                            if (reply.author?._id) {
                                replyAuthorId = reply.author._id;
                            } else if (reply.author) {
                                replyAuthorId = reply.author;
                            }
                            return {
                                id: reply._id,
                                content: reply.content,
                                authorName: reply.author?.name || 'User',
                                authorId: replyAuthorId,
                                authorImage: reply.author?.profileImage || 'https://randomuser.me/api/portraits/men/1.jpg',
                                likesCount: reply.likesCount || 0,
                                dislikesCount: reply.dislikesCount || 0,
                                createdAt: reply.createdAt,
                                isLiked: false,
                                isDisliked: false,
                                isOwnComment: replyAuthorId === currentUserId,
                            };
                        }) || []
                    };
                });

                if (isLoadMore) {
                    setComments(prev => [...prev, ...formattedComments]);
                } else {
                    setComments(formattedComments);
                }

                if (result.pagination) {
                    setHasMoreComments(pageNum < result.pagination.totalPages);
                }
                setCommentPage(pageNum);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoadingComments(false);
        }
    };

    const loadMoreComments = () => {
        if (hasMoreComments && !loadingComments && currentPost) {
            fetchComments(currentPost.id, commentPage + 1, true);
        }
    };

    const handleCommentLike = async (commentId, isReply = false, parentId = null) => {
        try {
            const result = await commentService.likeComment(commentId);
            if (result.success) {
                if (isReply && parentId) {
                    setComments(prev => prev.map(comment => {
                        if (comment.id === parentId) {
                            return {
                                ...comment,
                                replies: comment.replies.map(reply => {
                                    if (reply.id === commentId) {
                                        const newLikesCount = reply.isLiked ? reply.likesCount - 1 : reply.likesCount + 1;
                                        return {
                                            ...reply,
                                            likesCount: newLikesCount,
                                            isLiked: !reply.isLiked,
                                            isDisliked: false,
                                        };
                                    }
                                    return reply;
                                })
                            };
                        }
                        return comment;
                    }));
                } else {
                    setComments(prev => prev.map(comment => {
                        if (comment.id === commentId) {
                            const newLikesCount = comment.isLiked ? comment.likesCount - 1 : comment.likesCount + 1;
                            return {
                                ...comment,
                                likesCount: newLikesCount,
                                isLiked: !comment.isLiked,
                                isDisliked: false,
                            };
                        }
                        return comment;
                    }));
                }
            }
        } catch (error) {
            console.error('Error liking comment:', error);
        }
    };

    const handleCommentDislike = async (commentId, isReply = false, parentId = null) => {
        try {
            const result = await commentService.dislikeComment(commentId);
            if (result.success) {
                if (isReply && parentId) {
                    setComments(prev => prev.map(comment => {
                        if (comment.id === parentId) {
                            return {
                                ...comment,
                                replies: comment.replies.map(reply => {
                                    if (reply.id === commentId) {
                                        const newDislikesCount = reply.isDisliked ? reply.dislikesCount - 1 : reply.dislikesCount + 1;
                                        return {
                                            ...reply,
                                            dislikesCount: newDislikesCount,
                                            isDisliked: !reply.isDisliked,
                                            isLiked: false,
                                        };
                                    }
                                    return reply;
                                })
                            };
                        }
                        return comment;
                    }));
                } else {
                    setComments(prev => prev.map(comment => {
                        if (comment.id === commentId) {
                            const newDislikesCount = comment.isDisliked ? comment.dislikesCount - 1 : comment.dislikesCount + 1;
                            return {
                                ...comment,
                                dislikesCount: newDislikesCount,
                                isDisliked: !comment.isDisliked,
                                isLiked: false,
                            };
                        }
                        return comment;
                    }));
                }
            }
        } catch (error) {
            console.error('Error disliking comment:', error);
        }
    };

    const handleDeleteComment = async (commentId, isReply = false, parentId = null) => {
        Alert.alert(
            'Delete Comment',
            'Are you sure you want to delete this comment?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const result = await commentService.deleteComment(commentId);
                            if (result.success) {
                                if (isReply && parentId) {
                                    setComments(prev => prev.map(comment => {
                                        if (comment.id === parentId) {
                                            return {
                                                ...comment,
                                                replies: comment.replies.filter(reply => reply.id !== commentId)
                                            };
                                        }
                                        return comment;
                                    }));
                                } else {
                                    setComments(prev => prev.filter(comment => comment.id !== commentId));
                                    setCommentCounts(prev => ({
                                        ...prev,
                                        [currentPost.id]: (prev[currentPost.id] || 0) - 1
                                    }));
                                    setPosts(prev => prev.map(post => {
                                        if (post.id === currentPost.id) {
                                            return { ...post, comments: post.comments - 1, commentCount: post.comments - 1 };
                                        }
                                        return post;
                                    }));
                                }
                                Alert.alert('Success', 'Comment deleted successfully');
                            } else {
                                Alert.alert('Error', 'Failed to delete comment');
                            }
                        } catch (error) {
                            console.error('Error deleting comment:', error);
                            Alert.alert('Error', 'Failed to delete comment');
                        }
                    }
                }
            ]
        );
    };

    const addComment = async () => {
        if (!commentText.trim()) return;

        setCommentLoading(true);
        try {
            const result = await commentService.addComment('story', currentPost.id, commentText.trim());

            if (result.success) {
                setCommentText('');
                await fetchComments(currentPost.id, 1);
                setCommentCounts(prev => ({
                    ...prev,
                    [currentPost.id]: (prev[currentPost.id] || 0) + 1
                }));
                setPosts(prev => prev.map(post => {
                    if (post.id === currentPost.id) {
                        return { ...post, comments: post.comments + 1, commentCount: post.comments + 1 };
                    }
                    return post;
                }));
                Alert.alert('Success', 'Comment added successfully!');
            } else {
                Alert.alert('Error', result.error || 'Failed to add comment');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            Alert.alert('Error', 'Failed to add comment');
        } finally {
            setCommentLoading(false);
        }
    };

    const addReply = async () => {
        if (!replyText.trim() || !replyTo) return;

        setCommentLoading(true);
        try {
            const result = await commentService.addReply('story', currentPost.id, replyText.trim(), replyTo);

            if (result.success) {
                setReplyText('');
                setReplyTo(null);
                setReplyToName('');
                await fetchComments(currentPost.id, 1);
                setCommentCounts(prev => ({
                    ...prev,
                    [currentPost.id]: (prev[currentPost.id] || 0) + 1
                }));
                setPosts(prev => prev.map(post => {
                    if (post.id === currentPost.id) {
                        return { ...post, comments: post.comments + 1, commentCount: post.comments + 1 };
                    }
                    return post;
                }));
                Alert.alert('Success', 'Reply added successfully!');
            } else {
                Alert.alert('Error', result.error || 'Failed to add reply');
            }
        } catch (error) {
            console.error('Error adding reply:', error);
            Alert.alert('Error', 'Failed to add reply');
        } finally {
            setCommentLoading(false);
        }
    };

    const renderComment = ({ item }) => {
        return (
            <View style={styles.commentItem}>
                <Image source={{ uri: item.authorImage }} style={styles.commentAvatar} />
                <View style={styles.commentContent}>
                    <View style={styles.commentHeader}>
                        <ThemedText style={styles.commentAuthor}>{item.authorName}</ThemedText>
                        <ThemedText style={styles.commentTime}>{formatCommentTime(item.createdAt)}</ThemedText>
                    </View>
                    <ThemedText style={styles.commentText}>{item.content}</ThemedText>

                    <View style={styles.commentActions}>
                        <TouchableOpacity
                            style={styles.commentAction}
                            onPress={() => handleCommentLike(item.id)}
                        >
                            <Ionicons
                                name={item.isLiked ? "thumbs-up" : "thumbs-up-outline"}
                                size={16}
                                color={item.isLiked ? "#4B59B3" : "#999"}
                            />
                            <ThemedText style={[styles.commentActionText, item.isLiked && { color: '#4B59B3' }]}>
                                {item.likesCount}
                            </ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.commentAction}
                            onPress={() => handleCommentDislike(item.id)}
                        >
                            <Ionicons
                                name={item.isDisliked ? "thumbs-down" : "thumbs-down-outline"}
                                size={16}
                                color={item.isDisliked ? "#FF3B30" : "#999"}
                            />
                            <ThemedText style={[styles.commentActionText, item.isDisliked && { color: '#FF3B30' }]}>
                                {item.dislikesCount}
                            </ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {
                            setReplyTo(item.id);
                            setReplyToName(item.authorName);
                        }}>
                            <ThemedText style={styles.commentActionText}>Reply</ThemedText>
                        </TouchableOpacity>

                        {item.isOwnComment === true && currentUserId !== null && (
                            <TouchableOpacity onPress={() => handleDeleteComment(item.id)}>
                                <Ionicons name="trash-outline" size={16} color="#FF3B30" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Replies */}
                    {item.replies && item.replies.length > 0 && (
                        <View style={styles.repliesContainer}>
                            {item.replies.map(reply => (
                                <View key={reply.id} style={styles.replyItem}>
                                    <Image source={{ uri: reply.authorImage }} style={styles.replyAvatar} />
                                    <View style={styles.replyContent}>
                                        <View style={styles.commentHeader}>
                                            <ThemedText style={styles.commentAuthor}>{reply.authorName}</ThemedText>
                                            <ThemedText style={styles.commentTime}>{formatCommentTime(reply.createdAt)}</ThemedText>
                                        </View>
                                        <ThemedText style={styles.commentText}>{reply.content}</ThemedText>
                                        <View style={styles.commentActions}>
                                            <TouchableOpacity
                                                style={styles.commentAction}
                                                onPress={() => handleCommentLike(reply.id, true, item.id)}
                                            >
                                                <Ionicons
                                                    name={reply.isLiked ? "thumbs-up" : "thumbs-up-outline"}
                                                    size={14}
                                                    color={reply.isLiked ? "#4B59B3" : "#999"}
                                                />
                                                <ThemedText style={[styles.commentActionText, reply.isLiked && { color: '#4B59B3' }]}>
                                                    {reply.likesCount}
                                                </ThemedText>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={styles.commentAction}
                                                onPress={() => handleCommentDislike(reply.id, true, item.id)}
                                            >
                                                <Ionicons
                                                    name={reply.isDisliked ? "thumbs-down" : "thumbs-down-outline"}
                                                    size={14}
                                                    color={reply.isDisliked ? "#FF3B30" : "#999"}
                                                />
                                                <ThemedText style={[styles.commentActionText, reply.isDisliked && { color: '#FF3B30' }]}>
                                                    {reply.dislikesCount}
                                                </ThemedText>
                                            </TouchableOpacity>

                                            {reply.isOwnComment === true && currentUserId !== null && (
                                                <TouchableOpacity onPress={() => handleDeleteComment(reply.id, true, item.id)}>
                                                    <Ionicons name="trash-outline" size={14} color="#FF3B30" />
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </View>
        );
    };

    const renderPost = ({ item }) => {
        const isLiked = likedPosts[item.id] || false;
        const displayLikes = likeCounts[item.id] !== undefined ? likeCounts[item.id] : item.likeCount;
        const displayComments = commentCounts[item.id] !== undefined ? commentCounts[item.id] : item.comments;

        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => handlePostPress(item)}
            >
                <View style={styles.postContainer}>
                    {/* {item.isPremium && (
                        <View style={styles.premiumBadge}>
                            <ThemedText style={styles.premiumText}>PREMIUM</ThemedText>
                        </View>
                    )} */}

                    <View style={styles.postHeader}>
                        <View style={styles.headerLeft}>
                            <Image source={{ uri: item.profileImage }} style={styles.avatar} />
                            <View style={styles.headerText}>
                                <View style={styles.titleRow}>
                                    <ThemedText style={styles.postTitle}>{item.title}</ThemedText>
                                    <ThemedText style={styles.timeAgo}>{item.timeAgo}</ThemedText>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => handleThreeDotPress(item)}>
                            <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.contentSection}>
                        <ThemedText style={styles.headline}>{item.headline}</ThemedText>
                        <ThemedText style={styles.description}>{item.description}</ThemedText>
                    </View>

                    <View style={styles.actionContainer}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => toggleLike(item.id, displayLikes)}
                        >
                            <Foundation name="like" size={24} color={isLiked ? "#4B59B3" : "black"} />
                            <ThemedText style={[styles.actionText, isLiked && { color: '#4B59B3' }]}>
                                {displayLikes}
                            </ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => openCommentModal(item)}
                        >
                            <MaterialCommunityIcons name="message-text-outline" size={24} color="black" />
                            <ThemedText style={styles.actionText}>{displayComments}</ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleShare(item)}
                        >
                            <FontAwesome6 name="share-from-square" size={18} color="black" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <ThemedText style={styles.footerText}>Reading Time: {item.readTime}</ThemedText>
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

            {/* Comment Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={commentModalVisible}
                onRequestClose={() => setCommentModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <ThemedText style={styles.modalTitle}>Comments ({currentPost?.comments || 0})</ThemedText>
                            <TouchableOpacity onPress={() => setCommentModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>

                        {/* Reply Indicator */}
                        {replyTo && (
                            <View style={styles.replyIndicator}>
                                <ThemedText style={styles.replyIndicatorText}>
                                    Replying to @{replyToName}
                                </ThemedText>
                                <TouchableOpacity onPress={() => {
                                    setReplyTo(null);
                                    setReplyToName('');
                                }}>
                                    <Ionicons name="close-circle" size={20} color="#999" />
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Comments List */}
                        <FlatList
                            data={comments}
                            renderItem={renderComment}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={styles.commentsList}
                            showsVerticalScrollIndicator={false}
                            onEndReached={loadMoreComments}
                            onEndReachedThreshold={0.5}
                            ListFooterComponent={
                                loadingComments ? (
                                    <ActivityIndicator size="small" color="#4B59B3" style={styles.commentsLoader} />
                                ) : null
                            }
                            ListEmptyComponent={
                                !loadingComments ? (
                                    <View style={styles.emptyComments}>
                                        <Ionicons name="chatbubble-outline" size={48} color="#ccc" />
                                        <ThemedText style={styles.emptyCommentsText}>No comments yet</ThemedText>
                                        <ThemedText style={styles.emptyCommentsSubText}>Be the first to comment</ThemedText>
                                    </View>
                                ) : null
                            }
                        />

                        {/* Add Comment Input */}
                        <View style={styles.addCommentContainer}>
                            <TextInput
                                style={styles.commentInput}
                                placeholder={replyTo ? `Reply to @${replyToName}...` : "Write a comment..."}
                                placeholderTextColor="#999"
                                value={replyTo ? replyText : commentText}
                                onChangeText={replyTo ? setReplyText : setCommentText}
                                multiline
                            />
                            <TouchableOpacity
                                style={styles.sendButton}
                                onPress={replyTo ? addReply : addComment}
                                disabled={commentLoading}
                            >
                                {commentLoading ? (
                                    <ActivityIndicator size="small" color="#FFFFFF" />
                                ) : (
                                    <Ionicons name="send" size={20} color="#FFFFFF" />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

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
                            onPress={() => handleMenuOption('save', selectedPost)}
                            disabled={savingPost}
                        >
                            {savingPost ? (
                                <ActivityIndicator size="small" color="#4B59B3" />
                            ) : (
                                <>
                                    <Ionicons name="bookmark-outline" size={20} color="#000" />
                                    <ThemedText style={styles.menuText}>Save Post</ThemedText>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    centerContainer: { justifyContent: 'center', alignItems: 'center', minHeight: 200, paddingVertical: 40 },
    noDataText: { fontSize: 16, fontFamily: 'tenez', color: '#999' },
    listContent: { paddingVertical: 8 },
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
    premiumBadge: { position: 'absolute', top: 12, right: 12, zIndex: 10, backgroundColor: '#FF9500', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16 },
    premiumText: { color: '#FFFFFF', fontSize: 10, fontWeight: '600', fontFamily: 'CoFoRaffineMedium' },
    postHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12, borderWidth: 1, borderColor: '#F0F0F0' },
    headerText: {},
    titleRow: { flexDirection: 'column', flexWrap: 'wrap' },
    postTitle: { fontSize: 16, fontWeight: '400', fontFamily: 'CoFoRaffineMedium', color: '#000' },
    timeAgo: { fontSize: 14, fontFamily: 'tenez', color: '#999' },
    contentSection: { marginBottom: 12 },
    headline: { fontSize: 18, fontWeight: '400', fontFamily: 'CoFoRaffineMedium', color: '#000', marginBottom: 8, lineHeight: 24 },
    description: { fontSize: 14, fontFamily: 'tenez', color: '#666', lineHeight: 20 },
    actionContainer: { flexDirection: 'row', gap: 24, alignItems: 'center', marginBottom: 8 },
    actionButton: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    actionText: { fontSize: 14, fontFamily: 'CoFoRaffineMedium', color: '#666' },
    footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
    footerText: { fontSize: 14, fontFamily: 'tenez' },
    articleBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16 },
    articleBadgeText: { fontSize: 14, fontFamily: 'CoFoRaffineBold', color: '#3448D6' },
    loaderFooter: { paddingVertical: 20, alignItems: 'center' },

    // Modal Styles
    modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, height: '85%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    modalTitle: { fontSize: 18, fontWeight: '600', fontFamily: 'CoFoRaffineBold', color: '#000' },
    commentsList: { padding: 16, gap: 16 },
    commentItem: { flexDirection: 'row', gap: 12 },
    commentAvatar: { width: 36, height: 36, borderRadius: 18 },
    commentContent: { flex: 1 },
    commentHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
    commentAuthor: { fontSize: 14, fontWeight: '600', fontFamily: 'CoFoRaffineBold', color: '#000' },
    commentTime: { fontSize: 12, fontFamily: 'tenez', color: '#999' },
    commentText: { fontSize: 14, fontFamily: 'tenez', color: '#444', lineHeight: 20, marginBottom: 6 },
    commentActions: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4 },
    commentAction: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    commentActionText: { fontSize: 12, fontFamily: 'tenez', color: '#999' },
    repliesContainer: { marginTop: 12, marginLeft: 48, gap: 12 },
    replyItem: { flexDirection: 'row', gap: 12 },
    replyAvatar: { width: 28, height: 28, borderRadius: 14 },
    replyContent: { flex: 1 },
    replyIndicator: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F0F3FF', paddingHorizontal: 16, paddingVertical: 10, marginBottom: 8 },
    replyIndicatorText: { fontSize: 13, fontFamily: 'tenez', color: '#4B59B3' },
    addCommentContainer: { flexDirection: 'row', alignItems: 'center', padding: 16, borderTopWidth: 1, borderTopColor: '#F0F0F0', gap: 12, backgroundColor: '#FFFFFF' },
    commentInput: { flex: 1, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 25, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, fontFamily: 'tenez', maxHeight: 80, backgroundColor: '#F8F9FA' },
    sendButton: { backgroundColor: '#4B59B3', width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
    commentsLoader: { paddingVertical: 16 },
    emptyComments: { alignItems: 'center', paddingVertical: 60 },
    emptyCommentsText: { fontSize: 16, fontFamily: 'CoFoRaffineMedium', color: '#999', marginTop: 12 },
    emptyCommentsSubText: { fontSize: 14, fontFamily: 'tenez', color: '#ccc', marginTop: 4 },

    // Menu Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    menuContainer: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 8, width: '80%', maxWidth: 300 },
    menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
    menuText: { fontSize: 16, fontFamily: 'CoFoRaffineMedium', color: '#000' },
    menuDivider: { height: 1, backgroundColor: '#F0F0F0', marginHorizontal: 16 },
    reportItem: {},
    reportText: { color: '#FF3B30' },
});