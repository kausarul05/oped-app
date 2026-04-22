import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Image,
    Modal,
    Share,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Carousel from 'react-native-snap-carousel-new';
import commentService from '../../../services/commentService';
import libraryService from '../../../services/libraryService';
import reactionService from '../../../services/reactionService';
import storyService from '../../../services/storyService';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;
const CARD_HEIGHT = 380;
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
    const [currentUserId, setCurrentUserId] = useState(null);
    const carouselRef = useRef(null);

    // Comment Modal States
    const [commentModalVisible, setCommentModalVisible] = useState(false);
    const [currentArticle, setCurrentArticle] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [replyText, setReplyText] = useState('');
    const [replyTo, setReplyTo] = useState(null);
    const [replyToName, setReplyToName] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);
    const [commentPage, setCommentPage] = useState(1);
    const [hasMoreComments, setHasMoreComments] = useState(true);
    const [loadingComments, setLoadingComments] = useState(false);

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

    // Fetch stories from API
    const fetchStories = async (category = 'technology', pageNum = 1, isLoadMore = false) => {
        try {
            const result = await storyService.getStories(category, pageNum, 10);
            
            if (result.success && result.data) {
                const newArticles = await Promise.all(result.data.map(async (story) => {
                    let likeStatus = false;
                    let totalLikes = story.likes || 0;
                    let totalComments = 0;
                    let savedStatus = false;

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

                    // Fetch saved status
                    try {
                        const savedResult = await libraryService.checkSavedStatus('story', story._id);
                        if (savedResult.success) {
                            savedStatus = savedResult.data?.isSaved || false;
                        }
                    } catch (error) {
                        console.error('Error fetching saved status:', error);
                    }

                    return {
                        id: story._id,
                        title: story.author?.name || 'Unknown Author',
                        subtitle: story.title,
                        description: story.summary,
                        image: story.coverImage,
                        category: story.category,
                        readTime: `${story.readingTime} min read`,
                        likes: totalLikes,
                        comments: totalComments,
                        isPremium: story.isPremium,
                        authorId: story.author?._id,
                        createdAt: story.createdAt,
                        isLiked: likeStatus,
                        isSaved: savedStatus,
                    };
                }));
                
                // Initialize liked and saved state from API
                const likedState = {};
                const likeState = {};
                const savedState = {};
                newArticles.forEach(article => {
                    likedState[article.id] = article.isLiked;
                    likeState[article.id] = article.likes;
                    savedState[article.id] = article.isSaved;
                });
                setLikedItems(likedState);
                setLikeCounts(likeState);
                setBookmarkedItems(savedState);
                
                if (isLoadMore) {
                    setArticles(prev => [...prev, ...newArticles]);
                } else {
                    setArticles(newArticles);
                }
                
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
        const isCurrentlyLiked = likedItems[id];
        const newLikedState = !isCurrentlyLiked;
        
        setLikedItems(prev => ({
            ...prev,
            [id]: newLikedState
        }));
        
        setLikeCounts(prev => ({
            ...prev,
            [id]: newLikedState ? currentLikes + 1 : currentLikes - 1
        }));

        try {
            if (!isCurrentlyLiked) {
                const result = await reactionService.addReaction('story', id, 'like');
                if (!result.success) {
                    setLikedItems(prev => ({ ...prev, [id]: isCurrentlyLiked }));
                    setLikeCounts(prev => ({ ...prev, [id]: currentLikes }));
                    Alert.alert('Error', 'Failed to like the post');
                }
            } else {
                const result = await reactionService.removeReaction('story', id);
                if (!result.success) {
                    setLikedItems(prev => ({ ...prev, [id]: isCurrentlyLiked }));
                    setLikeCounts(prev => ({ ...prev, [id]: currentLikes }));
                    Alert.alert('Error', 'Failed to unlike the post');
                }
            }
        } catch (error) {
            console.error('Error toggling like:', error);
            setLikedItems(prev => ({ ...prev, [id]: isCurrentlyLiked }));
            setLikeCounts(prev => ({ ...prev, [id]: currentLikes }));
        }
    };

    const toggleBookmark = async (id) => {
        const newState = !bookmarkedItems[id];
        
        // Optimistic update
        setBookmarkedItems(prev => ({
            ...prev,
            [id]: newState
        }));

        try {
            const result = await libraryService.toggleSave({
                contentType: 'story',
                contentId: id,
                listType: 'saved'
            });

            if (result.success) {
                if (newState) {
                    Alert.alert('Saved', 'Article saved to library!');
                } else {
                    Alert.alert('Removed', 'Article removed from library');
                }
            } else {
                // Revert on error
                setBookmarkedItems(prev => ({
                    ...prev,
                    [id]: !newState
                }));
                Alert.alert('Error', result.error || 'Failed to save article');
            }
        } catch (error) {
            console.error('Error toggling bookmark:', error);
            // Revert on error
            setBookmarkedItems(prev => ({
                ...prev,
                [id]: !newState
            }));
            Alert.alert('Error', 'Failed to save article. Please try again.');
        }
    };

    const handleShare = async (item) => {
        try {
            const shareUrl = `https://hoped.com/story/${item.id}`;
            await Share.share({
                message: `${shareUrl}`,
                title: 'Share Article',
                url: shareUrl
            });
        } catch (error) {
            console.log('Error sharing:', error);
        }
    };

    // Comment Functions
    const openCommentModal = async (article) => {
        setCurrentArticle(article);
        setCommentModalVisible(true);
        setCommentPage(1);
        setHasMoreComments(true);
        setReplyTo(null);
        setReplyToName('');
        await fetchComments(article.id, 1);
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

    const addComment = async () => {
        if (!commentText.trim()) return;

        setCommentLoading(true);
        try {
            const result = await commentService.addComment('story', currentArticle.id, commentText.trim());

            if (result.success) {
                setCommentText('');
                await fetchComments(currentArticle.id, 1);
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
            const result = await commentService.addReply('story', currentArticle.id, replyText.trim(), replyTo);

            if (result.success) {
                setReplyText('');
                setReplyTo(null);
                setReplyToName('');
                await fetchComments(currentArticle.id, 1);
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
                                        return {
                                            ...reply,
                                            likesCount: reply.likesCount + 1,
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
                            return {
                                ...comment,
                                likesCount: comment.likesCount + 1,
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
                                        return {
                                            ...reply,
                                            dislikesCount: reply.dislikesCount + 1,
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
                            return {
                                ...comment,
                                dislikesCount: comment.dislikesCount + 1,
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

    const renderComment = ({ item }) => (
        <View style={styles.commentItem}>
            <Image source={{ uri: item.authorImage }} style={styles.commentAvatar} />
            <View style={styles.commentContent}>
                <View style={styles.commentHeader}>
                    <ThemedText style={styles.commentAuthor}>{item.authorName}</ThemedText>
                    <ThemedText style={styles.commentTime}>{formatCommentTime(item.createdAt)}</ThemedText>
                </View>
                <ThemedText style={styles.commentText}>{item.content}</ThemedText>

                <View style={styles.commentActions}>
                    <TouchableOpacity style={styles.commentAction} onPress={() => handleCommentLike(item.id)}>
                        <Ionicons name="thumbs-up-outline" size={16} color="#999" />
                        <ThemedText style={styles.commentActionText}>{item.likesCount}</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.commentAction} onPress={() => handleCommentDislike(item.id)}>
                        <Ionicons name="thumbs-down-outline" size={16} color="#999" />
                        <ThemedText style={styles.commentActionText}>{item.dislikesCount}</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        setReplyTo(item.id);
                        setReplyToName(item.authorName);
                    }}>
                        <ThemedText style={styles.commentActionText}>Reply</ThemedText>
                    </TouchableOpacity>
                    {item.isOwnComment && (
                        <TouchableOpacity onPress={() => handleDeleteComment(item.id)}>
                            <Ionicons name="trash-outline" size={16} color="#FF3B30" />
                        </TouchableOpacity>
                    )}
                </View>

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
                                        <TouchableOpacity style={styles.commentAction} onPress={() => handleCommentLike(reply.id, true, item.id)}>
                                            <Ionicons name="thumbs-up-outline" size={14} color="#999" />
                                            <ThemedText style={styles.commentActionText}>{reply.likesCount}</ThemedText>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.commentAction} onPress={() => handleCommentDislike(reply.id, true, item.id)}>
                                            <Ionicons name="thumbs-down-outline" size={14} color="#999" />
                                            <ThemedText style={styles.commentActionText}>{reply.dislikesCount}</ThemedText>
                                        </TouchableOpacity>
                                        {reply.isOwnComment && (
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

    const onSnapToItem = (index) => {
        setActiveIndex(index);
        if (index === articles.length - 2 && hasMore && !loading) {
            setLoading(true);
            fetchStories('technology', page + 1, true);
        }
    };

    const renderItem = ({ item, index }) => {
        const isLiked = likedItems[item.id] || false;
        const isBookmarked = bookmarkedItems[item.id] || false;
        const currentLikeCount = likeCounts[item.id] !== undefined ? likeCounts[item.id] : item.likes;

        return (
            <View style={[styles.cardContainer, { backgroundColor: '#FFFFFF', shadowColor: '#000' }]}>
                <Image source={{ uri: item.image }} style={styles.cardImage} />

                {item.isPremium && (
                    <View style={styles.premiumBadge}>
                        <ThemedText style={styles.premiumText}>PREMIUM</ThemedText>
                    </View>
                )}

                <TouchableOpacity style={styles.bookmarkButton} onPress={() => toggleBookmark(item.id)}>
                    <Ionicons name={isBookmarked ? "bookmark" : "bookmark-outline"} size={24}
                        color={isBookmarked ? "#4B59B3" : "#FFFFFF"} />
                </TouchableOpacity>

                <View style={[styles.categoryBadge, { backgroundColor: '#4B59B3' }]}>
                    <ThemedText style={styles.categoryText}>{item.category}</ThemedText>
                </View>

                <View style={styles.cardContent}>
                    <ThemedText style={styles.cardTitle}>{item.title}</ThemedText>
                    <ThemedText style={styles.cardSubtitle} numberOfLines={2}>{item.subtitle}</ThemedText>
                    <ThemedText style={styles.cardDescription} numberOfLines={2}>{item.description}</ThemedText>

                    <View style={styles.footerContainer}>
                        <View style={styles.metaItem}>
                            <Ionicons name="time-outline" size={14} color="#666" />
                            <ThemedText style={styles.metaText}>{item.readTime}</ThemedText>
                        </View>

                        <View style={styles.actionIcons}>
                            <TouchableOpacity style={styles.actionButton} onPress={() => toggleLike(item.id, item.likes)}>
                                <Ionicons name={isLiked ? "thumbs-up" : "thumbs-up-outline"} size={18}
                                    color={isLiked ? "#4B59B3" : "#666"} />
                                <ThemedText style={[styles.actionText, { color: isLiked ? "#4B59B3" : "#666" }]}>
                                    {currentLikeCount}
                                </ThemedText>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionButton} onPress={() => openCommentModal(item)}>
                                <Ionicons name="chatbubble-outline" size={18} color="#666" />
                                <ThemedText style={styles.actionText}>{item.comments}</ThemedText>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionButton} onPress={() => handleShare(item)}>
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
                loop={true}
                autoplay={true}
                onSnapToItem={onSnapToItem}

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
                            <ThemedText style={styles.modalTitle}>Comments ({currentArticle?.comments || 0})</ThemedText>
                            <TouchableOpacity onPress={() => setCommentModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>

                        {replyTo && (
                            <View style={styles.replyIndicator}>
                                <ThemedText style={styles.replyIndicatorText}>Replying to @{replyToName}</ThemedText>
                                <TouchableOpacity onPress={() => { setReplyTo(null); setReplyToName(''); }}>
                                    <Ionicons name="close-circle" size={20} color="#999" />
                                </TouchableOpacity>
                            </View>
                        )}

                        <FlatList
                            data={comments}
                            renderItem={renderComment}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={styles.commentsList}
                            showsVerticalScrollIndicator={false}
                            onEndReached={() => {
                                if (hasMoreComments && !loadingComments && currentArticle) {
                                    fetchComments(currentArticle.id, commentPage + 1, true);
                                }
                            }}
                            ListFooterComponent={loadingComments ? <ActivityIndicator size="small" color="#4B59B3" /> : null}
                            ListEmptyComponent={
                                !loadingComments ? (
                                    <View style={styles.emptyComments}>
                                        <Ionicons name="chatbubble-outline" size={48} color="#ccc" />
                                        <ThemedText style={styles.emptyCommentsText}>No comments yet</ThemedText>
                                    </View>
                                ) : null
                            }
                        />

                        <View style={styles.addCommentContainer}>
                            <TextInput
                                style={styles.commentInput}
                                placeholder={replyTo ? `Reply to @${replyToName}...` : "Write a comment..."}
                                placeholderTextColor="#999"
                                value={replyTo ? replyText : commentText}
                                onChangeText={replyTo ? setReplyText : setCommentText}
                                multiline
                            />
                            <TouchableOpacity style={styles.sendButton} onPress={replyTo ? addReply : addComment} disabled={commentLoading}>
                                {commentLoading ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Ionicons name="send" size={20} color="#FFFFFF" />}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, marginTop: -10 },
    centerContainer: { justifyContent: 'center', alignItems: 'center', minHeight: 300 },
    noDataText: { fontSize: 16, fontFamily: 'tenez', color: '#999' },
    cardContainer: {
        width: '85%',
        height: CARD_HEIGHT,
        borderRadius: 16,
        overflow: 'hidden',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: '#0000001F',
    },
    cardImage: { width: '100%', height: 220, resizeMode: 'cover' },
    bookmarkButton: { position: 'absolute', top: 12, right: 12, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 20, padding: 6 },
    categoryBadge: { position: 'absolute', top: 12, left: 12, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16 },
    premiumBadge: { position: 'absolute', top: 12, left: 100, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16, backgroundColor: '#FF9500' },
    premiumText: { color: '#FFFFFF', fontSize: 10, fontWeight: '600', fontFamily: 'CoFoRaffineMedium' },
    categoryText: { color: '#FFFFFF', fontSize: 11, fontWeight: '600', fontFamily: 'CoFoRaffineMedium' },
    cardContent: { padding: 12, justifyContent: 'space-between' },
    cardTitle: { fontSize: 16, fontWeight: '700', fontFamily: 'CoFoRaffineBold', marginBottom: 14, color: '#000' },
    cardSubtitle: { fontSize: 13, fontWeight: '500', fontFamily: 'CoFoRaffineMedium', marginBottom: 14, color: '#333', lineHeight: 16 },
    cardDescription: { fontSize: 12, fontWeight: '400', fontFamily: 'tenez', marginBottom: 8, color: '#666', lineHeight: 15 },
    footerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    metaText: { fontSize: 11, fontFamily: 'tenez', color: '#666' },
    actionIcons: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    actionButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    actionText: { fontSize: 11, fontFamily: 'tenez', color: '#666' },
    modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, height: '80%' },
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
    addCommentContainer: { flexDirection: 'row', alignItems: 'center', padding: 16, borderTopWidth: 1, borderTopColor: '#F0F0F0', gap: 12 },
    commentInput: { flex: 1, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 25, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, fontFamily: 'tenez', maxHeight: 80 },
    sendButton: { backgroundColor: '#4B59B3', width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
    emptyComments: { alignItems: 'center', paddingVertical: 40 },
    emptyCommentsText: { fontSize: 14, fontFamily: 'tenez', color: '#999', marginTop: 8 },
});