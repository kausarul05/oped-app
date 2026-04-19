import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Foundation, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    ScrollView,
    Share,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import authService from '../../../services/authService';
import podcastService from '../../../services/podcastService';
import storyService from '../../../services/storyService';

export default function WriterContent() {
    const { colors } = useTheme();
    const [activeTab, setActiveTab] = useState('Articles');
    const [likedItems, setLikedItems] = useState({});
    const [likeCounts, setLikeCounts] = useState({});
    const [commentCounts, setCommentCounts] = useState({});
    const [shareCounts, setShareCounts] = useState({});
    const [menuVisible, setMenuVisible] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [writer, setWriter] = useState(null);
    const [articles, setArticles] = useState([]);
    const [podcasts, setPodcasts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [articlePage, setArticlePage] = useState(1);
    const [hasMoreArticles, setHasMoreArticles] = useState(true);
    const navigation = useNavigation();

    // Fetch writer profile
    const fetchWriterProfile = async () => {
        try {
            const result = await authService.getWriterProfile();
            if (result.success && result.data) {
                setWriter({
                    name: result.data.name,
                    avatar: result.data.profileImage || 'https://randomuser.me/api/portraits/men/2.jpg',
                    bio: result.data.bio || 'No bio available',
                    email: result.data.email,
                });
            }
        } catch (error) {
            console.error('Error fetching writer profile:', error);
        }
    };

    // Fetch articles (stories)
    const fetchArticles = async (pageNum = 1, isLoadMore = false) => {
        try {
            // Try to get all stories first
            let result = await storyService.getWriterStories('published', pageNum, 10);
            
            if (!result.success || result.data.length === 0) {
                result = await storyService.getWriterStories('published', pageNum, 10);
            }

            if (result.success && result.data && result.data.length > 0) {
                const formattedArticles = result.data.map(story => ({
                    id: story._id,
                    title: story.title,
                    description: story.summary?.substring(0, 100) + '...',
                    image: story.coverImage,
                    likes: story.likes || Math.floor(Math.random() * 100) + 50,
                    comments: story.comments || Math.floor(Math.random() * 20) + 1,
                    shares: story.shares || Math.floor(Math.random() * 10) + 1,
                    likesDisplay: formatNumber(story.likes || Math.floor(Math.random() * 100) + 50),
                    commentsDisplay: formatNumber(story.comments || Math.floor(Math.random() * 20) + 1),
                    sharesDisplay: (story.shares || Math.floor(Math.random() * 10) + 1).toString(),
                    status: story.status,
                    createdAt: story.createdAt,
                }));
                
                if (isLoadMore) {
                    setArticles(prev => [...prev, ...formattedArticles]);
                } else {
                    setArticles(formattedArticles);
                }
                
                if (result.pagination) {
                    setHasMoreArticles(pageNum < result.pagination.totalPages);
                }
                setArticlePage(pageNum);
            } else {
                setArticles([]);
                setHasMoreArticles(false);
            }
        } catch (error) {
            console.error('Error fetching articles:', error);
            setArticles([]);
        }
    };

    // Fetch podcasts
    const fetchPodcasts = async () => {
        try {
            let result = await podcastService.getWriterPodcasts('published', '', 1, 10);
            
            if (!result.success || result.data.length === 0) {
                result = await podcastService.getWriterPodcasts('published', '', 1, 10);
            }

            if (result.success && result.data && result.data.length > 0) {
                const formattedPodcasts = result.data.map(podcast => ({
                    id: podcast._id,
                    title: podcast.title,
                    description: podcast.summary?.substring(0, 100) + '...',
                    image: podcast.coverImage,
                    likes: podcast.likes || Math.floor(Math.random() * 100) + 50,
                    comments: podcast.comments || Math.floor(Math.random() * 20) + 1,
                    shares: podcast.shares || Math.floor(Math.random() * 10) + 1,
                    likesDisplay: formatNumber(podcast.likes || Math.floor(Math.random() * 100) + 50),
                    commentsDisplay: formatNumber(podcast.comments || Math.floor(Math.random() * 20) + 1),
                    sharesDisplay: (podcast.shares || Math.floor(Math.random() * 10) + 1).toString(),
                    status: podcast.status,
                    createdAt: podcast.createdAt,
                }));
                setPodcasts(formattedPodcasts);
            } else {
                setPodcasts([]);
            }
        } catch (error) {
            console.error('Error fetching podcasts:', error);
            setPodcasts([]);
        }
    };

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        await Promise.all([
            fetchWriterProfile(),
            fetchArticles(1),
            fetchPodcasts()
        ]);
        setLoading(false);
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadData().finally(() => setRefreshing(false));
    };

    const loadMoreArticles = () => {
        if (hasMoreArticles && !loading) {
            fetchArticles(articlePage + 1, true);
        }
    };

    const toggleLike = (id, currentLikes) => {
        setLikedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));

        setLikeCounts(prev => ({
            ...prev,
            [id]: !likedItems[id] ? currentLikes + 1 : currentLikes - 1
        }));

        if (!likedItems[id]) {
            Alert.alert('Liked', 'You liked this content!');
        }
    };

    const handleComment = (item) => {
        Alert.alert(
            'Comments',
            `This has ${item.commentsDisplay} comments. Would you like to add one?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'View Comments',
                    onPress: () => {
                        setCommentCounts(prev => ({
                            ...prev,
                            [item.id]: (prev[item.id] || 0) + 1
                        }));
                        Alert.alert('Comments', 'Viewing comments');
                    }
                },
                {
                    text: 'Add Comment',
                    onPress: () => {
                        setCommentCounts(prev => ({
                            ...prev,
                            [item.id]: (prev[item.id] || 0) + 1
                        }));
                        Alert.alert('Add Comment', 'Comment added successfully!');
                    }
                },
            ]
        );
    };

    const handleShare = async (item) => {
        try {
            const shareUrl = `https://hoped.com/story/${item.id}`;
            const result = await Share.share({
                message: `${item.title}\n\nRead more: ${shareUrl}\n\nShared via HOPED App`,
                title: 'Share Content',
                url: shareUrl
            });

            if (result.action === Share.sharedAction) {
                setShareCounts(prev => ({
                    ...prev,
                    [item.id]: (prev[item.id] || 0) + 1
                }));
                Alert.alert('Shared', 'Content shared successfully!');
            }
        } catch (error) {
            console.log('Error sharing:', error);
        }
    };

    const handleThreeDotPress = (itemId) => {
        setSelectedItem(itemId);
        setMenuVisible(true);
    };

    const handleMenuOption = (option) => {
        setMenuVisible(false);
        switch (option) {
            case 'edit':
                Alert.alert('Edit', 'Edit content');
                break;
            case 'delete':
                Alert.alert('Delete', 'Delete this content');
                break;
            case 'save':
                Alert.alert('Save', 'Content saved to bookmarks!');
                break;
            case 'report':
                Alert.alert('Report', 'Thank you for reporting. We will review this content.');
                break;
        }
    };

    const getDisplayLikes = (item) => {
        if (likeCounts[item.id]) {
            return formatNumber(likeCounts[item.id]);
        }
        return item.likesDisplay;
    };

    const getDisplayComments = (item) => {
        if (commentCounts[item.id]) {
            const total = (parseInt(item.comments) || 0) + commentCounts[item.id];
            return formatNumber(total);
        }
        return item.commentsDisplay;
    };

    const getDisplayShares = (item) => {
        if (shareCounts[item.id]) {
            return ((parseInt(item.shares) || 0) + shareCounts[item.id]).toString();
        }
        return item.sharesDisplay;
    };

    const renderArticleItem = (item) => {
        const isLiked = likedItems[item.id] || false;
        // console.log("item for article", item)
        return (
            <TouchableOpacity 
                onPress={() => navigation.navigate('WriterStoreDetail', { storyId: item.id })} 
                key={item.id} 
                style={styles.articleCard}
            >
                <View style={styles.contentItem}>
                    <View style={styles.contentTextContainer}>
                        <ThemedText style={styles.contentTitle}>{item.title}</ThemedText>
                        <ThemedText style={styles.contentDescription} numberOfLines={2}>
                            {item.description}
                        </ThemedText>
                        <TouchableOpacity style={styles.readMoreButton}>
                            <ThemedText style={styles.readMoreText}>Read More</ThemedText>
                        </TouchableOpacity>
                    </View>
                    <Image source={{ uri: item.image }} style={styles.contentImage} />
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statsContainer}>
                        <TouchableOpacity
                            style={styles.statItem}
                            onPress={() => toggleLike(item.id, item.likes)}
                        >
                            <Foundation
                                name="like"
                                size={16}
                                color={isLiked ? "#4B59B3" : "#999"}
                            />
                            <ThemedText style={[styles.statText, isLiked && { color: '#4B59B3' }]}>
                                {getDisplayLikes(item)}
                            </ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.statItem}
                            onPress={() => handleComment(item)}
                        >
                            <Ionicons name="chatbubble-outline" size={16} color="#999" />
                            <ThemedText style={styles.statText}>
                                {getDisplayComments(item)}
                            </ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.statItem}
                            onPress={() => handleShare(item)}
                        >
                            <Ionicons name="share-social-outline" size={16} color="#999" />
                            <ThemedText style={styles.statText}>
                                {getDisplayShares(item)}
                            </ThemedText>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={() => handleThreeDotPress(item.id)}>
                        <Ionicons name="ellipsis-horizontal" size={16} color="#999" />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    const renderPodcastItem = (item) => {
        const isLiked = likedItems[item.id] || false;
        // console.log("podcast item", item )

        return (
            <TouchableOpacity 
                key={item.id} 
                style={styles.articleCard}
                onPress={() => navigation.navigate('PodcastDetail', { podcastId: item.id })}
            >
                <View style={styles.contentItem}>
                    <Image source={{ uri: item.image }} style={styles.contentImage} />
                    <View style={styles.contentTextContainer}>
                        <ThemedText style={styles.contentTitle}>{item.title}</ThemedText>
                        <ThemedText style={styles.contentDescription} numberOfLines={2}>
                            {item.description}
                        </ThemedText>
                        <TouchableOpacity style={styles.readMoreButton}>
                            <ThemedText style={styles.readMoreText}>Listen Now</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statsContainer}>
                        <TouchableOpacity
                            style={styles.statItem}
                            onPress={() => toggleLike(item.id, item.likes)}
                        >
                            <Foundation
                                name="like"
                                size={16}
                                color={isLiked ? "#4B59B3" : "#999"}
                            />
                            <ThemedText style={[styles.statText, isLiked && { color: '#4B59B3' }]}>
                                {getDisplayLikes(item)}
                            </ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.statItem}
                            onPress={() => handleComment(item)}
                        >
                            <Ionicons name="chatbubble-outline" size={16} color="#999" />
                            <ThemedText style={styles.statText}>
                                {getDisplayComments(item)}
                            </ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.statItem}
                            onPress={() => handleShare(item)}
                        >
                            <Ionicons name="share-social-outline" size={16} color="#999" />
                            <ThemedText style={styles.statText}>
                                {getDisplayShares(item)}
                            </ThemedText>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={() => handleThreeDotPress(item.id)}>
                        <Ionicons name="ellipsis-horizontal" size={16} color="#999" />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading && !writer) {
        return (
            <ThemedView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4B59B3" />
            </ThemedView>
        );
    }

    console.log("isloading", loading)
    console.log("writer", writer)

    return (
        <ThemedView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshing={refreshing}
                onRefresh={onRefresh}
            >
                {/* Profile Section */}
                <View style={styles.profileSection}>
                    <Image source={{ uri: writer?.avatar }} style={styles.profileImage} />
                    <ThemedText style={styles.writerName}>{writer?.name}</ThemedText>
                    <ThemedText style={styles.writerBio}>{writer?.bio}</ThemedText>
                </View>

                {/* Articles | Podcast Tabs */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'Articles' && styles.activeTab]}
                        onPress={() => setActiveTab('Articles')}
                    >
                        <ThemedText style={[styles.tabText, activeTab === 'Articles' && styles.activeTabText]}>
                            Articles ({articles.length})
                        </ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'Podcast' && styles.activeTab]}
                        onPress={() => setActiveTab('Podcast')}
                    >
                        <ThemedText style={[styles.tabText, activeTab === 'Podcast' && styles.activeTabText]}>
                            Podcast ({podcasts.length})
                        </ThemedText>
                    </TouchableOpacity>
                </View>

                {/* Content List */}
                {activeTab === 'Articles' ? (
                    <View style={styles.contentList}>
                        {articles.length > 0 ? (
                            articles.map((item) => renderArticleItem(item))
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Ionicons name="document-text-outline" size={60} color="#ccc" />
                                <ThemedText style={styles.emptyTitle}>No Articles Yet</ThemedText>
                                <ThemedText style={styles.emptySubText}>
                                    Your published articles will appear here
                                </ThemedText>
                                {/* <TouchableOpacity 
                                    style={styles.createButton}
                                    onPress={() => navigation.navigate('AddStory')}
                                >
                                    <ThemedText style={styles.createButtonText}>Create New Story</ThemedText>
                                </TouchableOpacity> */}
                            </View>
                        )}
                        {hasMoreArticles && articles.length > 0 && (
                            <TouchableOpacity onPress={loadMoreArticles} style={styles.loadMoreButton}>
                                <ThemedText style={styles.loadMoreText}>Load More</ThemedText>
                            </TouchableOpacity>
                        )}
                    </View>
                ) : (
                    <View style={styles.contentList}>
                        {podcasts.length > 0 ? (
                            podcasts.map((item) => renderPodcastItem(item))
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Ionicons name="mic-outline" size={60} color="#ccc" />
                                <ThemedText style={styles.emptyTitle}>No Podcasts Yet</ThemedText>
                                <ThemedText style={styles.emptySubText}>
                                    Your podcasts will appear here
                                </ThemedText>
                                {/* <TouchableOpacity 
                                    style={styles.createButton}
                                    onPress={() => navigation.navigate('AddPodcast')}
                                >
                                    <ThemedText style={styles.createButtonText}>Create New Podcast</ThemedText>
                                </TouchableOpacity> */}
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>

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
                            onPress={() => handleMenuOption('edit')}
                        >
                            <Ionicons name="create-outline" size={20} color="#000" />
                            <ThemedText style={styles.menuText}>Edit</ThemedText>
                        </TouchableOpacity>

                        <View style={styles.menuDivider} />

                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => handleMenuOption('save')}
                        >
                            <Ionicons name="bookmark-outline" size={20} color="#000" />
                            <ThemedText style={styles.menuText}>Save</ThemedText>
                        </TouchableOpacity>

                        <View style={styles.menuDivider} />

                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => handleMenuOption('delete')}
                        >
                            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                            <ThemedText style={[styles.menuText, styles.deleteText]}>Delete</ThemedText>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: '#FFFFFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        paddingBottom: 30,
    },
    profileSection: {
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 12,
        borderWidth: 3,
        borderColor: '#4B59B3',
        backgroundColor: '#FFFFFF',
    },
    writerName: {
        fontSize: 24,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        marginBottom: 8,
    },
    writerBio: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#666',
        lineHeight: 20,
        textAlign: 'center',
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 24,
    },
    tab: {
        flex: 1,
        paddingBottom: 4,
        marginBottom: 10
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#4B59B3',
    },
    tabText: {
        fontSize: 18,
        fontFamily: 'CoFoRaffineBold',
        color: '#999',
        textAlign: 'center'
    },
    activeTabText: {
        color: '#4B59B3',
        fontFamily: 'CoFoRaffineBold',
    },
    contentList: {
        paddingHorizontal: 16,
        gap: 20,
    },
    articleCard: {
        backgroundColor: '#fff',
        elevation: 1,
        padding: 12,
        borderRadius: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        marginBottom: 8,
    },
    contentItem: {
        flexDirection: 'row',
        gap: 12,
        paddingBottom: 16,
    },
    contentImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    contentTextContainer: {
        flex: 1,
    },
    contentTitle: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        marginBottom: 4,
        lineHeight: 20,
    },
    contentDescription: {
        fontSize: 13,
        fontFamily: 'tenez',
        color: '#666',
        lineHeight: 18,
        marginBottom: 8,
    },
    readMoreButton: {
        marginBottom: 10,
    },
    readMoreText: {
        fontSize: 13,
        fontFamily: 'CoFoRaffineMedium',
        color: '#4B59B3',
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statText: {
        fontSize: 12,
        fontFamily: 'tenez',
        color: '#999',
    },
    loadMoreButton: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    loadMoreText: {
        fontSize: 14,
        fontFamily: 'CoFoRaffineBold',
        color: '#4B59B3',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyTitle: {
        fontSize: 18,
        fontFamily: 'CoFoRaffineBold',
        color: '#666',
        marginTop: 16,
    },
    emptySubText: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#999',
        marginTop: 8,
        textAlign: 'center',
    },
    createButton: {
        marginTop: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#4B59B3',
        borderRadius: 25,
    },
    createButtonText: {
        fontSize: 14,
        fontFamily: 'CoFoRaffineBold',
        color: '#FFFFFF',
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
    deleteText: {
        color: '#FF3B30',
    },
});