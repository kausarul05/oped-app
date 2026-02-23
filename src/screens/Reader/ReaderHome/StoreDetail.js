import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { FontAwesome6, Foundation, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
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

export default function StoryDetail({ route, navigation }) {
    const { width } = useWindowDimensions();
    const { colors } = useTheme();
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [likeCount, setLikeCount] = useState(3.5);
    const [commentText, setCommentText] = useState('');
    const [showReplyInput, setShowReplyInput] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [showFullContent, setShowFullContent] = useState(false);

    // Comments state
    const [comments, setComments] = useState([
        {
            id: '1',
            userName: 'Rahul Sharma',
            userImage: 'https://randomuser.me/api/portraits/men/2.jpg',
            timeAgo: '2 hours ago',
            text: 'This article presents a very well-structured and thoughtful analysis of the topic. I appreciate how the author breaks down complex ideas into digestible pieces. The examples provided really help illustrate the key points.',
            likes: 24,
            isLiked: false,
            replies: [
                {
                    id: 'r1',
                    userName: 'Priya Patel',
                    userImage: 'https://randomuser.me/api/portraits/women/3.jpg',
                    timeAgo: '1 hour ago',
                    text: 'Totally agree! The section about digital media was particularly insightful.',
                    likes: 8,
                    isLiked: false,
                },
                {
                    id: 'r2',
                    userName: 'Amit Kumar',
                    userImage: 'https://randomuser.me/api/portraits/men/4.jpg',
                    timeAgo: '45 min ago',
                    text: 'I learned so much from this. Thanks for sharing!',
                    likes: 3,
                    isLiked: false,
                }
            ]
        },
        {
            id: '2',
            userName: 'Neha Singh',
            userImage: 'https://randomuser.me/api/portraits/women/5.jpg',
            timeAgo: '5 hours ago',
            text: 'Really enjoyed reading this! The perspective on independent journalism is refreshing. Would love to see more content like this.',
            likes: 15,
            isLiked: false,
            replies: []
        },
        {
            id: '3',
            userName: 'Vikram Mehta',
            userImage: 'https://randomuser.me/api/portraits/men/6.jpg',
            timeAgo: '1 day ago',
            text: 'Great read! The part about reader habits shifting really resonated with me.',
            likes: 7,
            isLiked: false,
            replies: []
        }
    ]);

    // Related keywords
    const relatedKeywords = [
        'Blockchain',
        'Gadgets',
        'Robotics',
        'Software Development',
        'AI',
        'Machine Learning'
    ];

    // Story data with HTML content
    const story = {
        id: '1',
        authorName: 'Katy Waldman',
        authorTitle: 'Culture and Lifestyle Writer',
        authorBio: 'Katy Waldman is a culture and lifestyle writer who explores modern trends, human stories, and creative perspectives. Her writing focuses on thoughtful analysis and engaging storytelling.',
        postDate: '22 Jan, 2020',
        authorImage: 'https://randomuser.me/api/portraits/women/1.jpg',
        coverImage: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        headline: 'The Future of Digital Media and the Changing Voice of Independent Journalism',
        summary: 'As technology evolves and reader habits shift, independent platforms are redefining how stories are told, shared, and trusted the world.',
        shortContent: `
            <h1>The Future of Digital Media and the Changing Voice of Independent Journalism</h1>
            
            <p>I didn’t want a regular job, so my friend and I decided to start a business selling digital products. We spent a lot of time figuring out how to make it work.</p>
            
            <p>Eventually, we found a product to sell. My friend handled Facebook ads, and I created the ad designs in Canva. We started investing Rs. 600 each day in ads. I know it’s not much, but that’s all we could afford.</p>
            
            <p>To make a profit, we had to earn more than Rs. 600 a day. We lost money on the first day, but on the second day we made a profit of Rs. 150.</p>
        `,
        fullContent: `
            <h1>The Future of Digital Media and the Changing Voice of Independent Journalism</h1>
            
            <p>I didn’t want a regular job, so my friend and I decided to start a business selling digital products. We spent a lot of time figuring out how to make it work.</p>
            
            <p>Eventually, we found a product to sell. My friend handled Facebook ads, and I created the ad designs in Canva. We started investing Rs. 600 each day in ads. I know it’s not much, but that’s all we could afford.</p>
            
            <p>To make a profit, we had to earn more than Rs. 600 a day. We lost money on the first day, but on the second day we made a profit of Rs. 150.</p>
            
            <p>As we continued investing our savings in Facebook ads in those first weeks, our money eventually ran out. We didn’t have any other source of income at that time, so we had to stop.</p>
            
            <p>Even though it felt like we had wasted our money and got nothing in return, I reminded myself that every—</p>
            
            <h2>The Future of Digital Media and the Changing Voice of Independent Journalism</h2>
            
            <p>I didn’t want a regular job, so my friend and I decided to</p>
        `,
        commentCount: 45,
        shareCount: 150,
        likeCount: 3.5,
    };

    // HTML styles with proper font families for headings
    const htmlStyles = {
        h1: {
            fontSize: 18,
            fontWeight: '700',
            fontFamily: 'CoFoRaffineBold',
            color: '#000',
            lineHeight: 32,
            marginBottom: 16,
            marginTop: 8,
        },
        h2: {
            fontSize: 18,
            fontWeight: '700',
            fontFamily: 'CoFoRaffineBold',
            color: '#000',
            lineHeight: 28,
            marginBottom: 14,
            marginTop: 6,
        },
        p: {
            fontSize: 16,
            fontFamily: 'tenez',
            color: '#444',
            lineHeight: 26,
            marginBottom: 18,
        },
    };

    const toggleLike = () => {
        setLiked(!liked);
        setLikeCount(liked ? likeCount - 0.1 : likeCount + 0.1);
    };

    const toggleBookmark = () => {
        setBookmarked(!bookmarked);
        Alert.alert(
            bookmarked ? 'Bookmark Removed' : 'Bookmark Added',
            bookmarked ? 'Story removed from bookmarks' : 'Story saved to bookmarks'
        );
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `${story.headline}\n\nRead more on HOPED app`,
                title: 'Share Story'
            });
        } catch (error) {
            console.log('Error sharing:', error);
        }
    };

    // Comment functions
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
            {/* Main Comment */}
            <View style={styles.commentMain}>
                <Image source={{ uri: item.userImage }} style={styles.commentAvatar} />
                <View style={styles.commentContent}>
                    <View style={styles.commentHeader}>
                        <ThemedText style={styles.commentUserName}>{item.userName}</ThemedText>
                        <ThemedText style={styles.commentTime}>{item.timeAgo}</ThemedText>
                    </View>
                    <ThemedText style={styles.commentText}>{item.text}</ThemedText>

                    {/* Comment Actions */}
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

                    {/* Reply Input */}
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

            {/* Replies */}
            {item.replies.length > 0 && (
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

                                {/* Reply Actions */}
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

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
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
                    {/* Cover Image */}
                    <Image source={{ uri: story.coverImage }} style={styles.coverImage} />

                    {/* Headline */}
                    <ThemedText style={styles.pageHeadline}>{story.headline}</ThemedText>

                    {/* Summary */}
                    <View style={styles.summaryContainer}>
                        <ThemedText style={styles.summary}>{story.summary}</ThemedText>
                    </View>

                    {/* Author Section - At the top (after summary) */}
                    <TouchableOpacity style={styles.authorSection} onPress={() => navigation.navigate('AuthorProfile', { author: story.author })}>
                        <View style={styles.authorCard}>
                            <View style={styles.authorInfo}>
                                <ThemedText style={styles.authorName}>{story.authorName}</ThemedText>
                                <ThemedText style={styles.postDate}>{story.postDate}</ThemedText>
                            </View>
                            <Image source={{ uri: story.authorImage }} style={styles.authorLargeImage} />
                        </View>
                    </TouchableOpacity>

                    {/* HTML Content - with proper font family for headings */}
                    <View style={styles.htmlContentArea}>
                        <RenderHTML
                            contentWidth={width - 32}
                            source={{ html: showFullContent ? story.fullContent : story.shortContent }}
                            tagsStyles={htmlStyles}
                            defaultTextProps={{
                                style: { fontFamily: 'tenez' }
                            }}
                            renderersProps={{
                                a: {
                                    onPress: (event, href) => console.log('Link pressed:', href)
                                }
                            }}
                        />
                    </View>

                    {/* Read More Section */}
                    {!showFullContent && (
                        <TouchableOpacity
                            style={styles.readMoreContainer}
                            onPress={() => setShowFullContent(true)}
                        >
                            <ThemedText style={styles.readMoreText}>Read more...</ThemedText>
                        </TouchableOpacity>
                    )}

                    {/* Action Buttons - At the end of story */}
                    <View style={styles.storyActionContainer}>
                        <TouchableOpacity style={[styles.storyActionButton, liked && styles.storyActionButtonActive]} onPress={toggleLike}>
                            <Foundation name="like" size={22} color={liked ? "#4B59B3" : "#666"} />
                            <ThemedText style={[styles.storyActionText, liked && { color: '#4B59B3' }]}>{likeCount.toFixed(1)}k</ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.storyActionButton}>
                            <MaterialCommunityIcons name="message-text-outline" size={22} color="#666" />
                            <ThemedText style={styles.storyActionText}>{story.commentCount}k</ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.storyActionButton} onPress={handleShare}>
                            <FontAwesome6 name="share-from-square" size={20} color="#666" />
                            <ThemedText style={styles.storyActionText}>{story.shareCount}</ThemedText>
                        </TouchableOpacity>
                    </View>

                    {/* Comments Section */}
                    <View style={styles.commentsSection}>
                        <ThemedText style={styles.sectionTitle}>Comments ({comments.length})</ThemedText>

                        {/* Add Comment Input */}
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

                        {/* Comments List */}
                        <FlatList
                            data={comments}
                            renderItem={renderComment}
                            keyExtractor={item => item.id}
                            scrollEnabled={false}
                            contentContainerStyle={styles.commentsList}
                        />
                    </View>

                    {/* Author Info at Bottom */}
                    <TouchableOpacity
                        style={styles.bottomAuthorSection}
                        onPress={() => navigation.navigate('AuthorProfile', { authorId: '1' })}
                    >
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
                    </TouchableOpacity>

                    {/* Related Keywords */}
                    <View style={styles.keywordsSection}>
                        <ThemedText style={styles.sectionTitle}>Related Keyword</ThemedText>
                        <View style={styles.keywordsContainer}>
                            {relatedKeywords.slice(0, 5).map((keyword, index) => (
                                <TouchableOpacity key={index} style={styles.keywordTag}>
                                    <ThemedText style={styles.keywordText}>{keyword}</ThemedText>
                                </TouchableOpacity>
                            ))}
                            {relatedKeywords.length > 5 && (
                                <TouchableOpacity style={styles.keywordTag}>
                                    <ThemedText style={styles.keywordText}>Sec {relatedKeywords.length - 5} More</ThemedText>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
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
    readMoreContainer: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    readMoreText: {
        fontSize: 16,
        fontFamily: 'CoFoRaffineBold',
        color: '#4B59B3',
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