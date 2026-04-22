import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import libraryService from '@/src/services/libraryService';
import { FontAwesome6, Foundation, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    ScrollView,
    Share,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';
import commentService from '../../../services/commentService';
import reactionService from '../../../services/reactionService';
import storyService from '../../../services/storyService';

export default function StoryDetail({ route, navigation }) {
    const { width } = useWindowDimensions();
    const { colors } = useTheme();
    const { postId } = route.params || {};

    // console.log("popst id", postId)

    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [commentText, setCommentText] = useState('');
    const [replyText, setReplyText] = useState('');
    const [replyTo, setReplyTo] = useState(null);
    const [replyToName, setReplyToName] = useState('');
    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [commentPage, setCommentPage] = useState(1);
    const [hasMoreComments, setHasMoreComments] = useState(true);
    const [loadingComments, setLoadingComments] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [commentLoading, setCommentLoading] = useState(false);

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
        if (postId) {
            fetchStoryDetail();
            fetchComments(postId, 1);
        }
    }, [postId]);

    const fetchStoryDetail = async () => {
        try {
            const result = await storyService.getStoryById(postId);
            if (result.data) {
                const storyData = result.data?.data;

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
                    authorName: storyData.author?.name || 'Unknown Author',
                    authorId: storyData.author?._id,
                    authorTitle: 'Writer',
                    authorBio: storyData.author?.bio || 'No bio available',
                    postDate: formatDate(storyData.createdAt),
                    authorImage: storyData.author?.profileImage || 'https://randomuser.me/api/portraits/men/1.jpg',
                    coverImage: storyData.coverImage,
                    headline: storyData.title,
                    summary: storyData.summary,
                    content: storyData.content,
                    commentCount: storyData.comments || 0,
                    shareCount: storyData.shares || 0,
                    likeCount: totalLikes,
                    tags: storyData.tags || [],
                    isPremium: storyData.isPremium,
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

    const loadMoreComments = () => {
        if (hasMoreComments && !loadingComments && story) {
            fetchComments(story.id, commentPage + 1, true);
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
            if (!result.success) {
                setLiked(!newLikedState);
                setLikeCount(likeCount);
                Alert.alert('Error', 'Failed to like the story');
            }
        } else {
            const result = await reactionService.addReaction('story', story.id, 'like');
            console.log("result", result)
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
            await libraryService.toggleSave({
                contentType: 'story',
                contentId: postId,
                listType: 'saved'
            });
            Alert.alert('Saved', 'Story bookmarked successfully!');
        } else {
            await libraryService.toggleSave({
                contentType: 'story',
                contentId: postId,
                listType: 'saved'
            });
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

    const addComment = async () => {
        if (!commentText.trim()) return;

        setCommentLoading(true);
        try {
            const result = await commentService.addComment('story', story.id, commentText.trim());

            if (result.success) {
                setCommentText('');
                await fetchComments(story.id, 1);
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
            const result = await commentService.addReply('story', story.id, replyText.trim(), replyTo);

            if (result.success) {
                setReplyText('');
                setReplyTo(null);
                setReplyToName('');
                await fetchComments(story.id, 1);
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
        <View style={styles.commentContainer}>
            <View style={styles.commentMain}>
                <Image source={{ uri: item.authorImage }} style={styles.commentAvatar} />
                <View style={styles.commentContent}>
                    <View style={styles.commentHeader}>
                        <ThemedText style={styles.commentUserName}>{item.authorName}</ThemedText>
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
                                <View key={reply.id} style={styles.replyMain}>
                                    <Image source={{ uri: reply.authorImage }} style={styles.replyAvatar} />
                                    <View style={styles.replyContent}>
                                        <View style={styles.commentHeader}>
                                            <ThemedText style={styles.commentUserName}>{reply.authorName}</ThemedText>
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
        </View>
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
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>

                    <View style={styles.headerActions}>
                        <TouchableOpacity onPress={toggleBookmark} style={styles.headerAction}>
                            <Ionicons name={bookmarked ? "bookmark" : "bookmark-outline"} size={24}
                                color={bookmarked ? "#4B59B3" : "#000"} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleShare} style={styles.headerAction}>
                            <FontAwesome6 name="share-from-square" size={22} color="#000" />
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={styles.headerAction}>
                            <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
                        </TouchableOpacity> */}
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <Image source={{ uri: story.coverImage }} style={styles.coverImage} />

                    {story.isPremium && (
                        <View style={styles.premiumBadge}>
                            <ThemedText style={styles.premiumText}>PREMIUM</ThemedText>
                        </View>
                    )}

                    <ThemedText style={styles.pageHeadline}>{story.headline}</ThemedText>

                    <View style={styles.summaryContainer}>
                        <ThemedText style={styles.summary}>{story.summary}</ThemedText>
                    </View>

                    <TouchableOpacity
                        style={styles.authorSection}
                        onPress={() => navigation.navigate('AuthorProfile', {
                            authorId: story.authorId,
                            authorName: story.authorName,
                            authorImage: story.authorImage,
                            authorBio: story.authorBio
                        })}
                    >
                        <View style={styles.authorCard}>
                            <View style={styles.authorInfo}>
                                <ThemedText style={styles.authorName}>{story.authorName}</ThemedText>
                                <ThemedText style={styles.postDate}>{story.postDate}</ThemedText>
                            </View>
                            <Image source={{ uri: story.authorImage }} style={styles.authorLargeImage} />
                        </View>
                    </TouchableOpacity>

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

                    <View style={styles.storyActionContainer}>
                        <TouchableOpacity style={[styles.storyActionButton, liked && styles.storyActionButtonActive]} onPress={toggleLike}>
                            <Foundation name="like" size={22} color={liked ? "#4B59B3" : "#666"} />
                            <ThemedText style={[styles.storyActionText, liked && { color: '#4B59B3' }]}>{likeCount}</ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.storyActionButton}>
                            <MaterialCommunityIcons name="message-text-outline" size={22} color="#666" />
                            <ThemedText style={styles.storyActionText}>({comments.length})</ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.storyActionButton} onPress={handleShare}>
                            <FontAwesome6 name="share-from-square" size={20} color="#666" />
                            {/* <ThemedText style={styles.storyActionText}>{story.shareCount}</ThemedText> */}
                        </TouchableOpacity>
                    </View>

                    {/* Reply Indicator */}
                    {replyTo && (
                        <View style={styles.replyIndicator}>
                            <ThemedText style={styles.replyIndicatorText}>Replying to @{replyToName}</ThemedText>
                            <TouchableOpacity onPress={() => { setReplyTo(null); setReplyToName(''); }}>
                                <Ionicons name="close-circle" size={20} color="#999" />
                            </TouchableOpacity>
                        </View>
                    )}

                    <View style={styles.commentsSection}>
                        <ThemedText style={styles.sectionTitle}>Comments ({comments.length})</ThemedText>

                        <View style={styles.addCommentContainer}>
                            <Image
                                source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
                                style={styles.commentInputAvatar}
                            />
                            <View style={styles.commentInputWrapper}>
                                <TextInput
                                    style={styles.commentInput}
                                    placeholder={replyTo ? `Reply to @${replyToName}...` : "Add a comment..."}
                                    placeholderTextColor="#999"
                                    value={replyTo ? replyText : commentText}
                                    onChangeText={replyTo ? setReplyText : setCommentText}
                                    multiline
                                />
                                <TouchableOpacity
                                    style={styles.commentSendButton}
                                    onPress={replyTo ? addReply : addComment}
                                    disabled={commentLoading}
                                >
                                    {commentLoading ? (
                                        <ActivityIndicator size="small" color="#FFFFFF" />
                                    ) : (
                                        <Ionicons name="send" size={22} color="#4B59B3" />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>

                        <FlatList
                            data={comments}
                            renderItem={renderComment}
                            keyExtractor={item => item.id}
                            scrollEnabled={false}
                            contentContainerStyle={styles.commentsList}
                            onEndReached={loadMoreComments}
                            onEndReachedThreshold={0.5}
                            ListFooterComponent={
                                loadingComments ? <ActivityIndicator size="small" color="#4B59B3" /> : null
                            }
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.bottomAuthorSection}
                        onPress={() => navigation.navigate('AuthorProfile', {
                            authorId: story.authorId,
                            authorName: story.authorName,
                            authorImage: story.authorImage,
                            authorBio: story.authorBio
                        })}
                    >
                        <View style={styles.bottomAuthorSection}>
                            <ThemedText style={styles.sectionTitle}>Author</ThemedText>
                            <View style={[styles.bottomAuthorCard, { elevation: 1, padding: 8, borderRadius: 12 }]}>
                                <View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                                        <Image source={{ uri: story.authorImage }} style={styles.bottomAuthorImage} />
                                        <ThemedText style={styles.bottomAuthorName}>{story.authorName}</ThemedText>
                                    </View>
                                    <View style={styles.bottomAuthorInfo}>
                                        <ThemedText style={styles.bottomAuthorBio}>{story.authorBio}</ThemedText>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>

                    {story.tags && story.tags.length > 0 && (
                        <View style={styles.keywordsSection}>
                            <ThemedText style={styles.sectionTitle}>Related Keyword</ThemedText>
                            <View style={styles.keywordsContainer}>
                                {story.tags.slice(0, 5).map((keyword, index) => (
                                    <TouchableOpacity key={index} style={styles.keywordTag}>
                                        <ThemedText style={styles.keywordText}>{keyword}</ThemedText>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
    centerContainer: { justifyContent: 'center', alignItems: 'center' },
    noDataText: { fontSize: 16, fontFamily: 'tenez', color: '#999' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    headerAction: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    scrollContent: { paddingBottom: 30 },
    coverImage: { width: '100%', height: 280, resizeMode: 'cover' },
    premiumBadge: { position: 'absolute', top: 80, right: 20, backgroundColor: '#FF9500', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, zIndex: 10 },
    premiumText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600', fontFamily: 'CoFoRaffineBold' },
    pageHeadline: { fontSize: 22, fontWeight: '400', fontFamily: 'CoFoRaffineBold', color: '#000', lineHeight: 34, paddingHorizontal: 16, paddingTop: 24, paddingBottom: 16 },
    summaryContainer: { paddingHorizontal: 16, paddingBottom: 20 },
    summary: { fontSize: 16, fontFamily: 'tenez', color: '#555', lineHeight: 24 },
    authorSection: { paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    authorCard: { flexDirection: 'row', gap: 16 },
    authorLargeImage: { width: 40, height: 40, borderRadius: 20 },
    authorInfo: { flex: 1, justifyContent: 'center' },
    authorName: { fontSize: 18, fontWeight: '600', fontFamily: 'CoFoRaffineBold', color: '#000', marginBottom: 4 },
    postDate: { fontSize: 14, fontFamily: 'tenez', color: '#999' },
    htmlContentArea: { paddingHorizontal: 16, paddingVertical: 20 },
    storyActionContainer: { flexDirection: 'row', alignItems: 'center', gap: 28, paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', marginVertical: 16 },
    storyActionButton: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    storyActionText: { fontSize: 15, fontFamily: 'CoFoRaffineMedium', color: '#666' },
    replyIndicator: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F0F3FF', paddingHorizontal: 16, paddingVertical: 10, marginBottom: 8 },
    replyIndicatorText: { fontSize: 13, fontFamily: 'tenez', color: '#4B59B3' },
    commentsSection: { paddingHorizontal: 16, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    addCommentContainer: { flexDirection: 'row', gap: 12, marginBottom: 24 },
    commentInputAvatar: { width: 40, height: 40, borderRadius: 20 },
    commentInputWrapper: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', borderWidth: 1, borderColor: '#F0F0F0', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8 },
    commentInput: { flex: 1, fontSize: 14, fontFamily: 'tenez', maxHeight: 100 },
    commentSendButton: { padding: 4 },
    commentsList: { gap: 20 },
    commentContainer: { gap: 12 },
    commentMain: { flexDirection: 'row', gap: 12 },
    commentAvatar: { width: 36, height: 36, borderRadius: 18 },
    commentContent: { flex: 1 },
    commentHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
    commentUserName: { fontSize: 14, fontWeight: '600', fontFamily: 'CoFoRaffineBold', color: '#000' },
    commentTime: { fontSize: 12, fontFamily: 'tenez', color: '#999' },
    commentText: { fontSize: 14, fontFamily: 'tenez', color: '#444', lineHeight: 20, marginBottom: 8 },
    commentActions: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 4 },
    commentAction: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    commentActionText: { fontSize: 12, fontFamily: 'tenez', color: '#999' },
    repliesContainer: { marginLeft: 48, marginTop: 12, gap: 12 },
    replyMain: { flexDirection: 'row', gap: 12 },
    replyAvatar: { width: 28, height: 28, borderRadius: 14 },
    replyContent: { flex: 1 },
    bottomAuthorSection: { paddingHorizontal: 16, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    bottomAuthorCard: { flexDirection: 'row', gap: 16, backgroundColor: "#ffff" },
    bottomAuthorImage: { width: 60, height: 60, borderRadius: 30 },
    bottomAuthorInfo: { flex: 1 },
    bottomAuthorName: { fontSize: 18, fontWeight: '600', fontFamily: 'CoFoRaffineBold', color: '#000', marginBottom: 8 },
    bottomAuthorBio: { fontSize: 14, fontFamily: 'tenez', color: '#666', lineHeight: 20 },
    keywordsSection: { paddingHorizontal: 16, paddingVertical: 20 },
    sectionTitle: { fontSize: 18, fontWeight: '400', fontFamily: 'CoFoRaffineBold', color: '#000', marginBottom: 12 },
    keywordsContainer: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 16 },
    keywordTag: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1, borderColor: '#F0F0F0', elevation: 1 },
    keywordText: { fontSize: 14, fontFamily: 'CoFoRaffineMedium', color: '#666' },
});