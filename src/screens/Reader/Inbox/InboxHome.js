import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Foundation, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    Modal,
    Share,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Fake profile images array
const profileImages = [
    'https://randomuser.me/api/portraits/men/1.jpg',
    'https://randomuser.me/api/portraits/women/2.jpg',
    'https://randomuser.me/api/portraits/men/3.jpg',
    'https://randomuser.me/api/portraits/women/4.jpg',
    'https://randomuser.me/api/portraits/men/5.jpg',
    'https://randomuser.me/api/portraits/women/6.jpg',
    'https://randomuser.me/api/portraits/men/7.jpg',
    'https://randomuser.me/api/portraits/women/8.jpg',
    'https://randomuser.me/api/portraits/men/9.jpg',
    'https://randomuser.me/api/portraits/women/10.jpg',
];

export default function InboxHome({ navigation }) {
    const { colors } = useTheme();
    const [likedPosts, setLikedPosts] = useState({});
    const [likeCounts, setLikeCounts] = useState({});
    const [commentCounts, setCommentCounts] = useState({});
    const [shareCounts, setShareCounts] = useState({});
    const [menuVisible, setMenuVisible] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);

    // Newsletter data
    const newsletters = [
        {
            id: '1',
            name: 'Tech Weekly',
            avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
            time: '2 hours ago',
        },
        {
            id: '2',
            name: 'Business Insider',
            avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
            time: '5 hours ago',
        },
        {
            id: '3',
            name: 'Culture Daily',
            avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
            time: '1 day ago',
        },
    ];

    // Story posts data matching your image design
    const storyPosts = [
        {
            id: '1',
            title: 'Manchester United',
            timeAgo: '10 hours ago',
            headline: 'The Future of Digital Media and the Changing Voice of Independent Journalism',
            description: 'As technology evolves and reader habits shift, independent platforms are redefining how stories are told, shared, and trusted the world.',
            image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            likes: '9M',
            comments: '15K',
            shares: '851',
            readTime: '5 min',
            type: 'Article',
            profileImage: profileImages[0],
            likeCount: 3.5,
            commentCount: 45,
            shareCount: 150,
            stats: {
                likes: '91M',
                comments: '75K',
                shares: '851'
            }
        },
        {
            id: '2',
            title: 'Manchester United',
            timeAgo: '10 hours ago',
            headline: 'The Future of Digital Media and the Changing Voice of Independent Journalism',
            description: 'As technology evolves and reader habits shift, independent platforms are redefining how stories are told, shared, and trusted the world.',
            image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            likes: '9M',
            comments: '15K',
            shares: '851',
            readTime: '5 min',
            type: 'Article',
            profileImage: profileImages[1],
            likeCount: 3.5,
            commentCount: 45,
            shareCount: 150,
            stats: {
                likes: '91M',
                comments: '75K',
                shares: '851'
            }
        },
        {
            id: '3',
            title: 'Manchester United',
            timeAgo: '10 hours ago',
            headline: 'The Future of Digital Media and the Changing Voice of Independent Journalism',
            description: 'As technology evolves and reader habits shift, independent platforms are redefining how stories are told, shared, and trusted the world.',
            image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            likes: '9M',
            comments: '15K',
            shares: '851',
            readTime: '5 min',
            type: 'Article',
            profileImage: profileImages[2],
            likeCount: 3.5,
            commentCount: 45,
            shareCount: 150,
            stats: {
                likes: '91M',
                comments: '75K',
                shares: '851'
            }
        },
    ];

    const toggleLike = (id, currentLikeCount) => {
        setLikedPosts(prev => ({
            ...prev,
            [id]: !prev[id]
        }));

        setLikeCounts(prev => ({
            ...prev,
            [id]: !likedPosts[id] ? currentLikeCount + 0.1 : currentLikeCount - 0.1
        }));

        if (!likedPosts[id]) {
            Alert.alert('Liked', 'You liked this post!');
        }
    };

    const handleComment = (post) => {
        Alert.alert(
            'Comments',
            `This post has ${post.commentCount}k comments. Would you like to add one?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'View Comments',
                    onPress: () => {
                        // Increment comment count when viewing comments
                        setCommentCounts(prev => ({
                            ...prev,
                            [post.id]: (prev[post.id] || 0) + 1
                        }));
                        console.log('View comments');
                    }
                },
                {
                    text: 'Add Comment',
                    onPress: () => {
                        // Increment comment count when adding comment
                        setCommentCounts(prev => ({
                            ...prev,
                            [post.id]: (prev[post.id] || 0) + 1
                        }));
                        Alert.alert('Add Comment', 'Comment added successfully!');
                    }
                },
            ]
        );
    };

    const handleShare = async (post) => {
        try {
            const result = await Share.share({
                message: `${post.headline}\n\n${post.description}\n\nRead more on HOPED app`,
                title: 'Share Article'
            });

            if (result.action === Share.sharedAction) {
                // Increment share count when shared
                setShareCounts(prev => ({
                    ...prev,
                    [post.id]: (prev[post.id] || 0) + 1
                }));
                Alert.alert('Shared', 'Post shared successfully!');
            }
        } catch (error) {
            console.log('Error sharing:', error);
        }
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

    const renderNewsletterItem = ({ item }) => (
        <TouchableOpacity
            style={styles.newsletterItem}
            onPress={() => navigation.navigate("InboxAuthProfile")}
        >
            <Image source={{ uri: item.avatar }} style={styles.newsletterAvatar} />
            {/* <View style={styles.newsletterContent}>
                <ThemedText style={styles.newsletterName}>{item.name}</ThemedText>
                <ThemedText style={styles.newsletterTime}>{item.time}</ThemedText>
            </View> */}
        </TouchableOpacity>
    );

    const renderStoryPost = ({ item }) => {
        const isLiked = likedPosts[item.id] || false;

        // Get dynamic counts
        const displayLikes = likeCounts[item.id]
            ? likeCounts[item.id].toFixed(1) + 'M'
            : item.stats.likes;

        const displayComments = commentCounts[item.id]
            ? (parseInt(item.stats.comments) + commentCounts[item.id]) + 'K'
            : item.stats.comments;

        const displayShares = shareCounts[item.id]
            ? parseInt(item.stats.shares) + shareCounts[item.id]
            : item.stats.shares;

        return (
            <View style={styles.storyContainer}>
                {/* Header Section */}
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
                        <TouchableOpacity onPress={() => handleThreeDotPress(item.id)}>
                            <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>

                    {/* Content Section */}
                    <View style={styles.storyContentSection}>
                        <ThemedText style={styles.storyHeadline}>{item.headline}</ThemedText>
                        <ThemedText style={styles.storyDescription}>{item.description}</ThemedText>
                    </View>
                </TouchableOpacity>

                {/* Stats Section - 91M    75K    851 */}
                <View style={styles.storyStatsContainer}>
                    <TouchableOpacity
                        style={styles.storyStatItem}
                        onPress={() => toggleLike(item.id, item.likeCount)}
                    >
                        <Foundation
                            name="like"
                            size={16}
                            color={isLiked ? "#4B59B3" : "#666"}
                        />
                        <ThemedText style={[styles.storyStatText, isLiked && { color: '#4B59B3' }]}>
                            {displayLikes}
                        </ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.storyStatItem}
                        onPress={() => handleComment(item)}
                    >
                        <Ionicons
                            name="chatbubble-outline"
                            size={16}
                            color="#666"
                        />
                        <ThemedText style={styles.storyStatText}>
                            {displayComments}
                        </ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.storyStatItem}
                        onPress={() => handleShare(item)}
                    >
                        <Ionicons
                            name="share-social-outline"
                            size={16}
                            color="#666"
                        />
                        <ThemedText style={styles.storyStatText}>
                            {displayShares}
                        </ThemedText>
                    </TouchableOpacity>
                </View>

                {/* Footer with Reading Time and Article Type */}
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => navigation.navigate('StoryDetail', { postId: item.id })}
                >
                    <View style={styles.storyFooter}>
                        <ThemedText style={styles.storyFooterText}>
                            Readings Time: {item.readTime}
                        </ThemedText>
                        <View style={styles.storyArticleBadge}>
                            <ThemedText style={styles.storyArticleBadgeText}>{item.type}</ThemedText>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

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
                    <FlatList
                        data={newsletters}
                        renderItem={renderNewsletterItem}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.newsletterList}
                    />
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
    // Newsletter Section
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
    newsletterContent: {
        alignItems: 'center',
    },
    newsletterName: {
        fontSize: 12,
        fontWeight: '500',
        fontFamily: 'CoFoRaffineMedium',
        color: '#000',
        textAlign: 'center',
        marginBottom: 2,
    },
    newsletterTime: {
        fontSize: 10,
        fontFamily: 'tenez',
        color: '#999',
        textAlign: 'center',
    },
    // Stories Section
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