import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { FontAwesome6, Foundation, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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
import storyService from '../../../services/storyService';

export default function StoryDetail({ route, navigation }) {
    const { width } = useWindowDimensions();
    const { colors } = useTheme();
    const { postId } = route.params || {};

    console.log("postid", postId)
    
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [commentText, setCommentText] = useState('');
    const [showReplyInput, setShowReplyInput] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [showFullContent, setShowFullContent] = useState(false);
    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);

    // Fetch story details from API
    useEffect(() => {
        if (postId) {
            fetchStoryDetail();
        }
    }, [postId]);

    const fetchStoryDetail = async () => {
        try {
            const result = await storyService.getStoryById(postId);
            
            if (result.data) {
                const storyData = result.data?.data;
                console.log("store Data", storyData)
                setStory({
                    id: storyData._id,
                    authorName: storyData.author?.name || 'Unknown Author',
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
                    likeCount: storyData.likes || 0,
                    tags: storyData.tags || [],
                    isPremium: storyData.isPremium,
                });
                setLikeCount(storyData.likes || 0);
            }
        } catch (error) {
            console.error('Error fetching story:', error);
            Alert.alert('Error', 'Failed to load story');
        } finally {
            setLoading(false);
        }
    };

    console.log("store", story)

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
            await storyService.likeStory(story.id);
        } else {
            await storyService.unlikeStory(story.id);
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
            await Share.share({
                message: `${story?.headline}\n\nRead more on HOPED app`,
                title: 'Share Story'
            });
        } catch (error) {
            console.log('Error sharing:', error);
        }
    };

    const handleAddComment = () => {
        if (commentText.trim()) {
            const newComment = {
                id: Date.now().toString(),
                userName: 'You',
                userImage: 'https://randomuser.me/api/portraits/men/1.jpg',
                timeAgo: 'Just now',
                text: commentText,
                likes: 0,
                isLiked: false,
                replies: []
            };
            setComments([newComment, ...comments]);
            setCommentText('');
        }
    };

    const handleAddReply = (commentId) => {
        if (replyText.trim()) {
            const newReply = {
                id: Date.now().toString(),
                userName: 'You',
                userImage: 'https://randomuser.me/api/portraits/men/1.jpg',
                timeAgo: 'Just now',
                text: replyText,
                likes: 0,
                isLiked: false,
            };

            setComments(comments.map(comment => {
                if (comment.id === commentId) {
                    return {
                        ...comment,
                        replies: [...comment.replies, newReply]
                    };
                }
                return comment;
            }));
            setReplyText('');
            setShowReplyInput(null);
        }
    };

    const toggleCommentLike = (commentId, isReply = false, replyId = null) => {
        if (!isReply) {
            setComments(comments.map(comment => {
                if (comment.id === commentId) {
                    return {
                        ...comment,
                        likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
                        isLiked: !comment.isLiked
                    };
                }
                return comment;
            }));
        } else {
            setComments(comments.map(comment => {
                if (comment.id === commentId) {
                    return {
                        ...comment,
                        replies: comment.replies.map(reply => {
                            if (reply.id === replyId) {
                                return {
                                    ...reply,
                                    likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                                    isLiked: !reply.isLiked
                                };
                            }
                            return reply;
                        })
                    };
                }
                return comment;
            }));
        }
    };

    const renderComment = ({ item }) => (
        <View style={styles.commentContainer}>
            <View style={styles.commentMain}>
                <Image source={{ uri: item.userImage }} style={styles.commentAvatar} />
                <View style={styles.commentContent}>
                    <View style={styles.commentHeader}>
                        <ThemedText style={styles.commentUserName}>{item.userName}</ThemedText>
                        <ThemedText style={styles.commentTime}>{item.timeAgo}</ThemedText>
                    </View>
                    <ThemedText style={styles.commentText}>{item.text}</ThemedText>

                    <View style={styles.commentActions}>
                        <TouchableOpacity
                            style={styles.commentAction}
                            onPress={() => toggleCommentLike(item.id)}
                        >
                            <Foundation
                                name="like"
                                size={16}
                                color={item.isLiked ? "#4B59B3" : "#999"}
                            />
                            <ThemedText style={[styles.commentActionText, item.isLiked && { color: '#4B59B3' }]}>
                                {item.likes}
                            </ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.commentAction}
                            onPress={() => setShowReplyInput(showReplyInput === item.id ? null : item.id)}
                        >
                            <Ionicons name="chatbubble-outline" size={16} color="#999" />
                            <ThemedText style={styles.commentActionText}>Reply</ThemedText>
                        </TouchableOpacity>
                    </View>

                    {showReplyInput === item.id && (
                        <View style={styles.replyInputContainer}>
                            <Image
                                source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
                                style={styles.replyAvatar}
                            />
                            <View style={styles.replyInputWrapper}>
                                <TextInput
                                    style={styles.replyInput}
                                    placeholder="Write a reply..."
                                    placeholderTextColor="#999"
                                    value={replyText}
                                    onChangeText={setReplyText}
                                    multiline
                                />
                                <TouchableOpacity
                                    style={styles.replySendButton}
                                    onPress={() => handleAddReply(item.id)}
                                >
                                    <Ionicons name="send" size={20} color="#4B59B3" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            </View>

            {item.replies?.length > 0 && (
                <View style={styles.repliesContainer}>
                    {item.replies.map(reply => (
                        <View key={reply.id} style={styles.replyMain}>
                            <Image source={{ uri: reply.userImage }} style={styles.replyAvatar} />
                            <View style={styles.replyContent}>
                                <View style={styles.commentHeader}>
                                    <ThemedText style={styles.commentUserName}>{reply.userName}</ThemedText>
                                    <ThemedText style={styles.commentTime}>{reply.timeAgo}</ThemedText>
                                </View>
                                <ThemedText style={styles.commentText}>{reply.text}</ThemedText>
                                <View style={styles.commentActions}>
                                    <TouchableOpacity
                                        style={styles.commentAction}
                                        onPress={() => toggleCommentLike(item.id, true, reply.id)}
                                    >
                                        <Foundation
                                            name="like"
                                            size={16}
                                            color={reply.isLiked ? "#4B59B3" : "#999"}
                                        />
                                        <ThemedText style={[styles.commentActionText, reply.isLiked && { color: '#4B59B3' }]}>
                                            {reply.likes}
                                        </ThemedText>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            )}
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
                        <TouchableOpacity style={styles.headerAction}>
                            <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
                        </TouchableOpacity>
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

                    <TouchableOpacity style={styles.authorSection}>
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
                            <ThemedText style={styles.storyActionText}>{story.commentCount}</ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.storyActionButton} onPress={handleShare}>
                            <FontAwesome6 name="share-from-square" size={20} color="#666" />
                            <ThemedText style={styles.storyActionText}>{story.shareCount}</ThemedText>
                        </TouchableOpacity>
                    </View>

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
                                    placeholder="Add a comment..."
                                    placeholderTextColor="#999"
                                    value={commentText}
                                    onChangeText={setCommentText}
                                    multiline
                                />
                                <TouchableOpacity
                                    style={styles.commentSendButton}
                                    onPress={handleAddComment}
                                >
                                    <Ionicons name="send" size={22} color="#4B59B3" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <FlatList
                            data={comments}
                            renderItem={renderComment}
                            keyExtractor={item => item.id}
                            scrollEnabled={false}
                            contentContainerStyle={styles.commentsList}
                        />
                    </View>

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
    headerAction: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
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
    pageHeadline: {
        fontSize: 22,
        fontWeight: '400',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        lineHeight: 34,
        paddingHorizontal: 16,
        paddingTop: 24,
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
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    authorCard: {
        flexDirection: 'row',
        gap: 16,
    },
    authorLargeImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    authorInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    authorName: {
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        marginBottom: 4,
    },
    postDate: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#999',
    },
    htmlContentArea: {
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    storyActionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 28,
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        marginVertical: 16,
    },
    storyActionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    storyActionText: {
        fontSize: 15,
        fontFamily: 'CoFoRaffineMedium',
        color: '#666',
    },
    commentsSection: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    addCommentContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    commentInputAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    commentInputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        borderWidth: 1,
        borderColor: '#F0F0F0',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    commentInput: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'tenez',
        maxHeight: 100,
    },
    commentSendButton: {
        padding: 4,
    },
    commentsList: {
        gap: 20,
    },
    commentContainer: {
        gap: 12,
    },
    commentMain: {
        flexDirection: 'row',
        gap: 12,
    },
    commentAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    commentContent: {
        flex: 1,
    },
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    commentUserName: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
    },
    commentTime: {
        fontSize: 12,
        fontFamily: 'tenez',
        color: '#999',
    },
    commentText: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#444',
        lineHeight: 20,
        marginBottom: 8,
    },
    commentActions: {
        flexDirection: 'row',
        gap: 16,
    },
    commentAction: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    commentActionText: {
        fontSize: 12,
        fontFamily: 'tenez',
        color: '#999',
    },
    repliesContainer: {
        marginLeft: 48,
        marginTop: 12,
        gap: 12,
    },
    replyMain: {
        flexDirection: 'row',
        gap: 12,
    },
    replyAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
    },
    replyContent: {
        flex: 1,
    },
    replyInputContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 12,
    },
    replyInputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F0F0F0',
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    replyInput: {
        flex: 1,
        fontSize: 13,
        fontFamily: 'tenez',
        maxHeight: 60,
    },
    replySendButton: {
        padding: 4,
    },
    bottomAuthorSection: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    bottomAuthorCard: {
        flexDirection: 'row',
        gap: 16,
        backgroundColor: "#ffff"
    },
    bottomAuthorImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    bottomAuthorInfo: {
        flex: 1,
    },
    bottomAuthorName: {
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        marginBottom: 8,
    },
    bottomAuthorBio: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#666',
        lineHeight: 20,
    },
    keywordsSection: {
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '400',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        marginBottom: 12,
    },
    keywordsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 16,
    },
    keywordTag: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        elevation: 1
    },
    keywordText: {
        fontSize: 14,
        fontFamily: 'CoFoRaffineMedium',
        color: '#666',
    },
});