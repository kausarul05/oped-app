import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { FontAwesome6, Foundation, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
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

export default function PostsList() {
    const { colors } = useTheme();
    const [likedPosts, setLikedPosts] = useState({});
    const [likeCounts, setLikeCounts] = useState({});
    const [menuVisible, setMenuVisible] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const navigation = useNavigation();

    // 10 posts data matching your image design
    const posts = [
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
        },
        {
            id: '4',
            title: 'Manchester United',
            timeAgo: '10 hours ago',
            headline: 'The Future of Digital Media and the Changing Voice of Independent Journalism',
            description: 'As technology evolves and reader habits shift, independent platforms are redefining how stories are told, shared, and trusted the world.',
            image: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80',
            likes: '9M',
            comments: '15K',
            shares: '851',
            readTime: '5 min',
            type: 'Article',
            profileImage: profileImages[3],
            likeCount: 3.5,
            commentCount: 45,
            shareCount: 150,
        },
        {
            id: '5',
            title: 'Manchester United',
            timeAgo: '10 hours ago',
            headline: 'The Future of Digital Media and the Changing Voice of Independent Journalism',
            description: 'As technology evolves and reader habits shift, independent platforms are redefining how stories are told, shared, and trusted the world.',
            image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            likes: '9M',
            comments: '15K',
            shares: '851',
            readTime: '5 min',
            type: 'Article',
            profileImage: profileImages[4],
            likeCount: 3.5,
            commentCount: 45,
            shareCount: 150,
        },
        {
            id: '6',
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
            profileImage: profileImages[5],
            likeCount: 3.5,
            commentCount: 45,
            shareCount: 150,
        },
        {
            id: '7',
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
            profileImage: profileImages[6],
            likeCount: 3.5,
            commentCount: 45,
            shareCount: 150,
        },
        {
            id: '8',
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
            profileImage: profileImages[7],
            likeCount: 3.5,
            commentCount: 45,
            shareCount: 150,
        },
        {
            id: '9',
            title: 'Manchester United',
            timeAgo: '10 hours ago',
            headline: 'The Future of Digital Media and the Changing Voice of Independent Journalism',
            description: 'As technology evolves and reader habits shift, independent platforms are redefining how stories are told, shared, and trusted the world.',
            image: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80',
            likes: '9M',
            comments: '15K',
            shares: '851',
            readTime: '5 min',
            type: 'Article',
            profileImage: profileImages[8],
            likeCount: 3.5,
            commentCount: 45,
            shareCount: 150,
        },
        {
            id: '10',
            title: 'Manchester United',
            timeAgo: '10 hours ago',
            headline: 'The Future of Digital Media and the Changing Voice of Independent Journalism',
            description: 'As technology evolves and reader habits shift, independent platforms are redefining how stories are told, shared, and trusted the world.',
            image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            likes: '9M',
            comments: '15K',
            shares: '851',
            readTime: '5 min',
            type: 'Article',
            profileImage: profileImages[9],
            likeCount: 3.5,
            commentCount: 45,
            shareCount: 150,
        },
    ];

    const toggleLike = (id, currentLikeCount) => {
        setLikedPosts(prev => ({
            ...prev,
            [id]: !prev[id]
        }));

        // Update like count
        setLikeCounts(prev => ({
            ...prev,
            [id]: !likedPosts[id] ? currentLikeCount + 0.1 : currentLikeCount - 0.1
        }));

        // Show feedback
        if (!likedPosts[id]) {
            Alert.alert('Liked', 'You liked this post!');
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
                    // You can pass the full post data or just the ID to fetch details
                })}
            >
                <View style={styles.postContainer}>
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

    return (
        <ThemedView style={styles.container}>
            <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
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
        marginBottom: 18
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
        // justifyContent: 'space-between',
        gap: 24,
        alignItems: 'center',
        // paddingVertical: 8,
        marginBottom: 8,
        // borderTopWidth: 1,
        // borderTopColor: '#F0F0F0',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        // paddingVertical: 8,
        // paddingHorizontal: 20,
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
        // color: '#999',
    },
    articleBadge: {
        // backgroundColor: '#F0F0F0',
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