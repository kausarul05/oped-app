import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
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

export default function PostsList() {
    const { colors } = useTheme();
    const [likedPosts, setLikedPosts] = useState({});
    const [bookmarkedPosts, setBookmarkedPosts] = useState({});
    const [likeCounts, setLikeCounts] = useState({});
    const [menuVisible, setMenuVisible] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);

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
            shares: '854',
            readTime: '5 min',
            type: 'Article',
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
            shares: '854',
            readTime: '5 min',
            type: 'Article',
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
            shares: '854',
            readTime: '5 min',
            type: 'Article',
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
            shares: '854',
            readTime: '5 min',
            type: 'Article',
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
            shares: '854',
            readTime: '5 min',
            type: 'Article',
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
            shares: '854',
            readTime: '5 min',
            type: 'Article',
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
            shares: '854',
            readTime: '5 min',
            type: 'Article',
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
            shares: '854',
            readTime: '5 min',
            type: 'Article',
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
            shares: '854',
            readTime: '5 min',
            type: 'Article',
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
            shares: '854',
            readTime: '5 min',
            type: 'Article',
        },
    ];

    const toggleLike = (id, currentLikes) => {
        setLikedPosts(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
        
        // Update like count (convert string like "9M" to number for increment)
        const likeValue = currentLikes.endsWith('M') 
            ? parseInt(currentLikes) * 1000000 
            : parseInt(currentLikes);
        
        setLikeCounts(prev => ({
            ...prev,
            [id]: !likedPosts[id] ? likeValue + 1 : likeValue - 1
        }));
    };

    const toggleBookmark = (id) => {
        setBookmarkedPosts(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
        
        Alert.alert(
            bookmarkedPosts[id] ? 'Bookmark Removed' : 'Bookmark Added',
            bookmarkedPosts[id] ? 'Post removed from bookmarks' : 'Post saved to bookmarks'
        );
    };

    const handleShare = async (post) => {
        try {
            await Share.share({
                message: `${post.headline}\n\n${post.description}\n\nRead more on HOPED app`,
                title: 'Share Article'
            });
        } catch (error) {
            console.log('Error sharing:', error);
        }
    };

    const handleComment = (post) => {
        Alert.alert('Comments', `Comments for this post: ${post.comments}`);
    };

    const handleThreeDotPress = (postId) => {
        setSelectedPost(postId);
        setMenuVisible(true);
    };

    const handleMenuOption = (option) => {
        setMenuVisible(false);
        switch(option) {
            case 'report':
                Alert.alert('Report', 'Thank you for reporting. We will review this post.');
                break;
            case 'hide':
                Alert.alert('Hide', 'This post will be hidden from your feed.');
                break;
            case 'save':
                toggleBookmark(selectedPost);
                break;
            case 'notInterested':
                Alert.alert('Not Interested', 'We will show fewer posts like this.');
                break;
        }
    };

    const renderPost = ({ item }) => {
        const isLiked = likedPosts[item.id] || false;
        const isBookmarked = bookmarkedPosts[item.id] || false;
        
        // Format like count display
        const displayLikes = likeCounts[item.id] 
            ? likeCounts[item.id] > 1000000 
                ? `${(likeCounts[item.id] / 1000000).toFixed(1)}M` 
                : likeCounts[item.id].toString()
            : item.likes;

        return (
            <View style={styles.postContainer}>
                {/* Header Section */}
                <View style={styles.postHeader}>
                    <View style={styles.headerLeft}>
                        <Image
                            source={{ uri: 'https://via.placeholder.com/40' }}
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

                {/* Image Section */}
                <Image
                    source={{ uri: item.image }}
                    style={styles.postImage}
                />

                {/* Stats Section - 9M    15K    854 */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Ionicons name="heart-outline" size={16} color="#666" />
                        <ThemedText style={styles.statText}>{displayLikes}</ThemedText>
                    </View>
                    <View style={styles.statItem}>
                        <Ionicons name="chatbubble-outline" size={16} color="#666" />
                        <ThemedText style={styles.statText}>{item.comments}</ThemedText>
                    </View>
                    <View style={styles.statItem}>
                        <Ionicons name="repeat-outline" size={16} color="#666" />
                        <ThemedText style={styles.statText}>{item.shares}</ThemedText>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionContainer}>
                    <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => toggleLike(item.id, item.likes)}
                    >
                        <Ionicons
                            name={isLiked ? "heart" : "heart-outline"}
                            size={22}
                            color={isLiked ? "#FF3B30" : "#666"}
                        />
                        <ThemedText style={[styles.actionText, isLiked && { color: '#FF3B30' }]}>
                            Like
                        </ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handleComment(item)}
                    >
                        <Ionicons name="chatbubble-outline" size={22} color="#666" />
                        <ThemedText style={styles.actionText}>Comment</ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handleShare(item)}
                    >
                        <Ionicons name="share-social-outline" size={22} color="#666" />
                        <ThemedText style={styles.actionText}>Share</ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => toggleBookmark(item.id)}
                    >
                        <Ionicons
                            name={isBookmarked ? "bookmark" : "bookmark-outline"}
                            size={22}
                            color={isBookmarked ? "#4B59B3" : "#666"}
                        />
                    </TouchableOpacity>
                </View>

                {/* Footer with Reading Time and Article Type */}
                <View style={styles.footer}>
                    <ThemedText style={styles.footerText}>
                        Reading Time: {item.readTime} • {item.type}
                    </ThemedText>
                </View>
            </View>
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
        marginBottom: 12,
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
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
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    headerText: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    postTitle: {
        fontSize: 16,
        fontWeight: '400',
        fontFamily: 'CoFoRaffineBold',
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
        fontFamily: 'CoFoRaffineBold',
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
    postImage: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: 16,
        resizeMode: 'cover',
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 24,
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statText: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#666',
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 8,
        marginBottom: 8,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    actionText: {
        fontSize: 14,
        fontFamily: 'CoFoRaffineMedium',
        color: '#666',
    },
    footer: {
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    footerText: {
        fontSize: 13,
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
    reportItem: {
        // No extra styling needed
    },
    reportText: {
        color: '#FF3B30',
    },
});