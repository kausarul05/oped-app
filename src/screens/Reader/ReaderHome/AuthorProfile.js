import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import exploreService from '../../../services/exploreService';
import followService from '../../../services/followService';

export default function AuthorProfile({ route, navigation }) {
    const { colors } = useTheme();
    const { authorId, authorName, authorImage, authorBio } = route.params || {};
    const [activeTab, setActiveTab] = useState('Stories');
    const [menuVisible, setMenuVisible] = useState(false);
    const [author, setAuthor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stories, setStories] = useState([]);
    const [podcasts, setPodcasts] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followingLoading, setFollowingLoading] = useState(false);
    const [followerCount, setFollowerCount] = useState(0);
    const [totalStories, setTotalStories] = useState(0);
    const [totalPodcasts, setTotalPodcasts] = useState(0);
    const [storiesPage, setStoriesPage] = useState(1);
    const [podcastsPage, setPodcastsPage] = useState(1);
    const [hasMoreStories, setHasMoreStories] = useState(true);
    const [hasMorePodcasts, setHasMorePodcasts] = useState(true);
    const [loadingMoreStories, setLoadingMoreStories] = useState(false);
    const [loadingMorePodcasts, setLoadingMorePodcasts] = useState(false);

    // Fetch author profile from API
    useEffect(() => {
        if (authorId) {
            fetchWriterProfile();
            fetchStories(1, true);
            fetchPodcasts(1, true);
            checkFollowStatus();
            fetchFollowerCount();
        }
    }, [authorId]);

    const fetchWriterProfile = async () => {
        try {
            const result = await exploreService.getWriterProfile(authorId);
            
            if (result.success && result.data) {
                const { writer, stories, podcasts } = result.data;
                
                // Set author data
                setAuthor({
                    id: writer._id,
                    name: writer.name,
                    profileImage: writer.profileImage,
                    bio: writer.bio || 'No bio available',
                    coverImage: writer.coverImage || 'https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&auto=format&fit=crop&w=2020&q=80',
                    email: writer.email,
                    isVerified: writer.isVerified,
                    isSubscribed: writer.isSubscribed,
                    followersCount: writer.followersCount || 0,
                    totalStories: writer.totalStories || 0,
                    totalPodcasts: writer.totalPodcasts || 0,
                    totalContent: writer.totalContent || 0,
                });
                
                // Set follow status from API response
                setIsFollowing(writer.isFollowing || false);
                setFollowerCount(writer.followersCount || 0);
                setTotalStories(writer.totalStories || 0);
                setTotalPodcasts(writer.totalPodcasts || 0);
            } else {
                // Fallback if API fails
                setAuthor({
                    id: authorId || '1',
                    name: authorName || 'Eric Lach',
                    profileImage: authorImage || 'https://randomuser.me/api/portraits/women/1.jpg',
                    bio: authorBio || 'Writer and storyteller passionate about digital media and independent journalism.',
                    coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&auto=format&fit=crop&w=2020&q=80',
                });
            }
        } catch (error) {
            console.error('Error fetching writer profile:', error);
            // Fallback mock data
            setAuthor({
                id: authorId || '1',
                name: authorName || 'Eric Lach',
                profileImage: authorImage || 'https://randomuser.me/api/portraits/women/1.jpg',
                bio: authorBio || 'Writer and storyteller passionate about digital media and independent journalism.',
                coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&auto=format&fit=crop&w=2020&q=80',
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchStories = async (page = 1, isRefresh = false) => {
        try {
            if (isRefresh) {
                setStoriesPage(1);
                setHasMoreStories(true);
            }
            
            if (page === 1) {
                setLoadingMoreStories(true);
            } else {
                setLoadingMoreStories(true);
            }
            
            const result = await exploreService.getWriterStories(authorId, page, 10);
            
            if (result.success && result.data) {
                const newStories = result.data.map(story => ({
                    id: story._id,
                    title: story.title,
                    summary: story.summary,
                    type: story.isPremium ? 'Premium Story' : 'Featured Story',
                    image: story.coverImage,
                    createdAt: story.createdAt,
                    readingTime: story.readingTime,
                    category: story.category,
                }));
                
                if (isRefresh || page === 1) {
                    setStories(newStories);
                } else {
                    setStories(prev => [...prev, ...newStories]);
                }
                
                if (result.pagination) {
                    setHasMoreStories(page < result.pagination.totalPages);
                    setStoriesPage(page);
                }
            }
        } catch (error) {
            console.error('Error fetching stories:', error);
        } finally {
            setLoadingMoreStories(false);
        }
    };

    const fetchPodcasts = async (page = 1, isRefresh = false) => {
        try {
            if (isRefresh) {
                setPodcastsPage(1);
                setHasMorePodcasts(true);
            }
            
            if (page === 1) {
                setLoadingMorePodcasts(true);
            } else {
                setLoadingMorePodcasts(true);
            }
            
            const result = await exploreService.getWriterPodcasts(authorId, page, 10);
            
            if (result.success && result.data) {
                const newPodcasts = result.data.map(podcast => ({
                    id: podcast._id,
                    title: podcast.title,
                    summary: podcast.summary,
                    type: podcast.isPremium ? 'Premium Podcast' : 'Featured Podcast',
                    image: podcast.coverImage,
                    createdAt: podcast.createdAt,
                    duration: podcast.audioDuration,
                    category: podcast.category,
                }));
                
                if (isRefresh || page === 1) {
                    setPodcasts(newPodcasts);
                } else {
                    setPodcasts(prev => [...prev, ...newPodcasts]);
                }
                
                if (result.pagination) {
                    setHasMorePodcasts(page < result.pagination.totalPages);
                    setPodcastsPage(page);
                }
            }
        } catch (error) {
            console.error('Error fetching podcasts:', error);
        } finally {
            setLoadingMorePodcasts(false);
        }
    };

    const loadMoreStories = () => {
        if (hasMoreStories && !loadingMoreStories && activeTab === 'Stories') {
            fetchStories(storiesPage + 1);
        }
    };

    const loadMorePodcasts = () => {
        if (hasMorePodcasts && !loadingMorePodcasts && activeTab === 'Podcasts') {
            fetchPodcasts(podcastsPage + 1);
        }
    };

    const checkFollowStatus = async () => {
        try {
            const result = await followService.checkFollowStatus(authorId);
            if (result.success) {
                setIsFollowing(result.isFollowing);
            }
        } catch (error) {
            console.error('Error checking follow status:', error);
        }
    };

    const fetchFollowerCount = async () => {
        try {
            const result = await followService.getFollowerCount(authorId);
            if (result.success) {
                setFollowerCount(result.count);
            }
        } catch (error) {
            console.error('Error fetching follower count:', error);
        }
    };

    const handleFollowToggle = async () => {
        if (followingLoading) return;
        
        setFollowingLoading(true);
        try {
            const result = await followService.toggleFollow(authorId);
            
            if (result.success) {
                setIsFollowing(result.isFollowing);
                setFollowerCount(prev => result.isFollowing ? prev + 1 : prev - 1);
                
                Alert.alert(
                    'Success', 
                    result.isFollowing ? `You are now following ${author?.name}` : `You unfollowed ${author?.name}`
                );
            } else {
                Alert.alert('Error', result.error || 'Failed to update follow status');
            }
        } catch (error) {
            console.error('Error toggling follow:', error);
            Alert.alert('Error', 'Failed to update follow status');
        } finally {
            setFollowingLoading(false);
        }
    };

    const handleMenuOption = (option) => {
        setMenuVisible(false);
        switch(option) {
            case 'follow':
                handleFollowToggle();
                break;
            case 'feedback':
                Alert.alert('Give Feedback', 'Thank you for your feedback!');
                break;
            case 'report':
                Alert.alert('Report', 'Thank you for reporting. We will review this profile.');
                break;
            case 'block':
                Alert.alert('Block', `You have blocked ${author?.name}`);
                break;
        }
    };

    const renderStoryItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.storyItem}
            onPress={() => navigation.navigate('StoryDetail', { storyId: item.id })}
        >
            <Image source={{ uri: item.image }} style={styles.storyImage} />
            <View style={styles.storyContent}>
                <ThemedText style={styles.storyTitle} numberOfLines={2}>{item.title}</ThemedText>
                <ThemedText style={styles.storyType}>{item.type}</ThemedText>
                <ThemedText style={styles.storyMeta}>{item.readingTime} min read</ThemedText>
            </View>
        </TouchableOpacity>
    );

    const renderPodcastItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.storyItem}
            onPress={() => navigation.navigate('PodcastDetail', { podcastId: item.id })}
        >
            <Image source={{ uri: item.image }} style={styles.storyImage} />
            <View style={styles.storyContent}>
                <ThemedText style={styles.storyTitle} numberOfLines={2}>{item.title}</ThemedText>
                <ThemedText style={styles.storyType}>{item.type}</ThemedText>
                <ThemedText style={styles.storyMeta}>{item.duration} min</ThemedText>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <ThemedView style={[styles.container, styles.centerContainer]}>
                <ActivityIndicator size="large" color="#4B59B3" />
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* Header with Back Button and 3-dot Menu */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <ThemedText style={styles.headerTitle}>Author Profile</ThemedText>
                    <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
                        <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Cover Image */}
                    <Image source={{ uri: author?.coverImage }} style={styles.coverImage} />

                    {/* Profile Info Section */}
                    <View style={styles.profileInfoContainer}>
                        {/* Profile Image - Positioned to overlap cover */}
                        <View style={styles.profileImageWrapper}>
                            <Image source={{ uri: author?.profileImage }} style={styles.profileImage} />
                        </View>

                        {/* Author Name */}
                        <View style={styles.nameContainer}>
                            <ThemedText style={styles.authorName}>{author?.name}</ThemedText>
                            {followerCount > 0 && (
                                <ThemedText style={styles.followerCount}>
                                    {followerCount} {followerCount === 1 ? 'follower' : 'followers'}
                                </ThemedText>
                            )}
                        </View>

                        {/* Author Bio */}
                        <ThemedText style={styles.authorBio}>{author?.bio}</ThemedText>

                        {/* Stats */}
                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <ThemedText style={styles.statNumber}>{totalStories}</ThemedText>
                                <ThemedText style={styles.statLabel}>Stories</ThemedText>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <ThemedText style={styles.statNumber}>{totalPodcasts}</ThemedText>
                                <ThemedText style={styles.statLabel}>Podcasts</ThemedText>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <ThemedText style={styles.statNumber}>{followerCount}</ThemedText>
                                <ThemedText style={styles.statLabel}>Followers</ThemedText>
                            </View>
                        </View>

                        {/* Follow Button */}
                        <View style={styles.actionButtonsContainer}>
                            <TouchableOpacity 
                                style={[styles.followButton, isFollowing && styles.followingButton]}
                                onPress={handleFollowToggle}
                                disabled={followingLoading}
                            >
                                {followingLoading ? (
                                    <ActivityIndicator size="small" color="#FFFFFF" />
                                ) : (
                                    <>
                                        <Ionicons 
                                            name={isFollowing ? "person-remove-outline" : "person-add-outline"} 
                                            size={18} 
                                            color="#FFFFFF" 
                                        />
                                        <ThemedText style={styles.followButtonText}>
                                            {isFollowing ? 'Unfollow' : 'Follow author'}
                                        </ThemedText>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Stories | Podcasts Tabs */}
                    <View style={styles.tabsContainer}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'Stories' && styles.activeTab]}
                            onPress={() => setActiveTab('Stories')}
                        >
                            <ThemedText style={[styles.tabText, activeTab === 'Stories' && styles.activeTabText]}>
                                Stories ({totalStories})
                            </ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'Podcasts' && styles.activeTab]}
                            onPress={() => setActiveTab('Podcasts')}
                        >
                            <ThemedText style={[styles.tabText, activeTab === 'Podcasts' && styles.activeTabText]}>
                                Podcasts ({totalPodcasts})
                            </ThemedText>
                        </TouchableOpacity>
                    </View>

                    {/* Stories List */}
                    {activeTab === 'Stories' && (
                        <View style={styles.listContainer}>
                            {stories.length > 0 ? (
                                <FlatList
                                    data={stories}
                                    renderItem={renderStoryItem}
                                    keyExtractor={(item) => item.id}
                                    scrollEnabled={false}
                                    contentContainerStyle={styles.listContent}
                                    onEndReached={loadMoreStories}
                                    onEndReachedThreshold={0.3}
                                    ListFooterComponent={
                                        loadingMoreStories ? (
                                            <ActivityIndicator size="small" color="#4B59B3" style={styles.loaderMore} />
                                        ) : null
                                    }
                                />
                            ) : (
                                <View style={styles.emptyContainer}>
                                    <Ionicons name="document-text-outline" size={48} color="#ccc" />
                                    <ThemedText style={styles.emptyText}>No stories yet</ThemedText>
                                </View>
                            )}
                        </View>
                    )}

                    {/* Podcasts List */}
                    {activeTab === 'Podcasts' && (
                        <View style={styles.listContainer}>
                            {podcasts.length > 0 ? (
                                <FlatList
                                    data={podcasts}
                                    renderItem={renderPodcastItem}
                                    keyExtractor={(item) => item.id}
                                    scrollEnabled={false}
                                    contentContainerStyle={styles.listContent}
                                    onEndReached={loadMorePodcasts}
                                    onEndReachedThreshold={0.3}
                                    ListFooterComponent={
                                        loadingMorePodcasts ? (
                                            <ActivityIndicator size="small" color="#4B59B3" style={styles.loaderMore} />
                                        ) : null
                                    }
                                />
                            ) : (
                                <View style={styles.emptyContainer}>
                                    <Ionicons name="mic-outline" size={48} color="#ccc" />
                                    <ThemedText style={styles.emptyText}>No podcasts yet</ThemedText>
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
                        <View style={[styles.menuContainer, { backgroundColor: '#FFFFFF' }]}>
                            <TouchableOpacity 
                                style={styles.menuItem}
                                onPress={() => handleMenuOption('follow')}
                            >
                                <Ionicons 
                                    name={isFollowing ? "person-remove-outline" : "person-add-outline"} 
                                    size={20} 
                                    color="#000" 
                                />
                                <ThemedText style={styles.menuText}>
                                    {isFollowing ? 'Unfollow Author' : 'Follow Author'}
                                </ThemedText>
                            </TouchableOpacity>
                            
                            <View style={styles.menuDivider} />
                            
                            <TouchableOpacity 
                                style={styles.menuItem}
                                onPress={() => handleMenuOption('feedback')}
                            >
                                <Ionicons name="chatbubble-outline" size={20} color="#000" />
                                <ThemedText style={styles.menuText}>Give Feedback</ThemedText>
                            </TouchableOpacity>
                            
                            <View style={styles.menuDivider} />
                            
                            <TouchableOpacity 
                                style={styles.menuItem}
                                onPress={() => handleMenuOption('report')}
                            >
                                <Ionicons name="flag-outline" size={20} color="#000" />
                                <ThemedText style={styles.menuText}>Report Author</ThemedText>
                            </TouchableOpacity>
                            
                            <View style={styles.menuDivider} />
                            
                            <TouchableOpacity 
                                style={[styles.menuItem, styles.blockItem]}
                                onPress={() => handleMenuOption('block')}
                            >
                                <Ionicons name="ban-outline" size={20} color="#FF3B30" />
                                <ThemedText style={[styles.menuText, styles.blockText]}>Block Author</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        backgroundColor: '#FFFFFF',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '400',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
    },
    coverImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    profileInfoContainer: {
        paddingHorizontal: 16,
        paddingTop: 40,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    profileImageWrapper: {
        position: 'absolute',
        top: -40,
        left: 16,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#FFFFFF',
        backgroundColor: '#FFFFFF',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    nameContainer: {
        marginBottom: 12,
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    authorName: {
        fontSize: 24,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        flex: 1,
    },
    followerCount: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#666',
        marginLeft: 8,
    },
    authorBio: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#666',
        lineHeight: 20,
        marginBottom: 16,
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginBottom: 20,
        paddingVertical: 12,
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
    },
    statLabel: {
        fontSize: 12,
        fontFamily: 'tenez',
        color: '#666',
        marginTop: 4,
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#E0E0E0',
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    followButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4B59B3',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        gap: 8,
    },
    followingButton: {
        backgroundColor: '#FF3B30',
    },
    followButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: 'CoFoRaffineMedium',
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        gap: 24,
    },
    tab: {
        paddingBottom: 8,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#4B59B3',
    },
    tabText: {
        fontSize: 16,
        fontFamily: 'CoFoRaffineMedium',
        color: '#999',
    },
    activeTabText: {
        color: '#4B59B3',
        fontFamily: 'CoFoRaffineBold',
    },
    listContainer: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    listContent: {
        gap: 16,
    },
    storyItem: {
        flexDirection: 'row',
        gap: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        elevation: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 8,
        marginBottom: 8
    },
    storyImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },
    storyContent: {
        flex: 1,
        justifyContent: 'center',
    },
    storyTitle: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#333',
        marginBottom: 4,
        lineHeight: 18,
    },
    storyType: {
        fontSize: 12,
        fontFamily: 'CoFoRaffineMedium',
        color: '#4B59B3',
    },
    storyMeta: {
        fontSize: 10,
        fontFamily: 'tenez',
        color: '#999',
        marginTop: 2,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuContainer: {
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
    blockItem: {},
    blockText: {
        color: '#FF3B30',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        fontFamily: 'tenez',
        color: '#999',
        marginTop: 12,
    },
    loaderMore: {
        paddingVertical: 16,
    },
});