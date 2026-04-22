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
    const { authorId } = route.params || {};
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

    console.log("author id", authorId)

    // Single API call to get everything
    useEffect(() => {
        if (authorId) {
            fetchWriterProfile();
        }
    }, [authorId]);

    const fetchWriterProfile = async () => {
        try {
            setLoading(true);
            const result = await exploreService.getWriterProfile(authorId);
            
            if (result.success && result.data) {
                const { writer, stories: storiesData, podcasts: podcastsData } = result.data;
                
                // Set author data
                setAuthor({
                    id: writer._id,
                    name: writer.name,
                    profileImage: writer.profileImage,
                    bio: writer.bio || 'No bio available',
                    coverImage: writer.coverImage || 'https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&auto=format&fit=crop&w=2020&q=80',
                });
                
                // Set follow status and counts from writer object
                setIsFollowing(writer.isFollowing || false);
                setFollowerCount(writer.followersCount || 0);
                setTotalStories(writer.totalStories || 0);
                setTotalPodcasts(writer.totalPodcasts || 0);
                
                // Set stories from response
                if (storiesData && storiesData.data) {
                    setStories(storiesData.data.map(story => ({
                        id: story._id,
                        title: story.title,
                        summary: story.summary,
                        type: story.isPremium ? 'Premium' : 'Free',
                        image: story.coverImage,
                        createdAt: story.createdAt,
                        readingTime: story.readingTime,
                        category: story.category,
                    })));
                }
                
                // Set podcasts from response
                if (podcastsData && podcastsData.data) {
                    setPodcasts(podcastsData.data.map(podcast => ({
                        id: podcast._id,
                        title: podcast.title,
                        summary: podcast.summary,
                        type: podcast.isPremium ? 'Premium' : 'Free',
                        image: podcast.coverImage,
                        createdAt: podcast.createdAt,
                        duration: podcast.audioDuration,
                        category: podcast.category,
                    })));
                }
            }
        } catch (error) {
            console.error('Error fetching writer profile:', error);
            Alert.alert('Error', 'Failed to load profile');
        } finally {
            setLoading(false);
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
            case 'report':
                Alert.alert('Report', 'Thank you for reporting. We will review this profile.');
                break;
            case 'block':
                Alert.alert('Block', `You have blocked ${author?.name}`);
                break;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    };

    const renderStoryItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.contentCard}
            onPress={() => navigation.navigate('StoryDetail', { storyId: item.id })}
            activeOpacity={0.7}
        >
            <Image source={{ uri: item.image }} style={styles.contentImage} />
            <View style={styles.contentInfo}>
                <View style={styles.contentHeader}>
                    <ThemedText style={styles.contentTitle} numberOfLines={2}>{item.title}</ThemedText>
                    {item.type === 'Premium' && (
                        <View style={styles.premiumTag}>
                            <ThemedText style={styles.premiumTagText}>PREMIUM</ThemedText>
                        </View>
                    )}
                </View>
                <ThemedText style={styles.contentMeta} numberOfLines={1}>
                    {item.readingTime} min read • {formatDate(item.createdAt)}
                </ThemedText>
            </View>
        </TouchableOpacity>
    );

    const renderPodcastItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.contentCard}
            onPress={() => navigation.navigate('PodcastDetail', { podcastId: item.id })}
            activeOpacity={0.7}
        >
            <Image source={{ uri: item.image }} style={styles.contentImage} />
            <View style={styles.contentInfo}>
                <View style={styles.contentHeader}>
                    <ThemedText style={styles.contentTitle} numberOfLines={2}>{item.title}</ThemedText>
                    {item.type === 'Premium' && (
                        <View style={styles.premiumTag}>
                            <ThemedText style={styles.premiumTagText}>PREMIUM</ThemedText>
                        </View>
                    )}
                </View>
                <ThemedText style={styles.contentMeta} numberOfLines={1}>
                    🎙️ {item.duration} min • {formatDate(item.createdAt)}
                </ThemedText>
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
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <ThemedText style={styles.headerTitle}>Profile</ThemedText>
                    {/* <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
                        <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
                    </TouchableOpacity> */}
                    <View></View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                    {/* Cover Image */}
                    <Image source={{ uri: author?.coverImage }} style={styles.coverImage} />

                    {/* Profile Section */}
                    <View style={styles.profileSection}>
                        <View style={styles.profileImageWrapper}>
                            <Image source={{ uri: author?.profileImage }} style={styles.profileImage} />
                        </View>

                        <View style={styles.profileInfo}>
                            <ThemedText style={styles.authorName}>{author?.name}</ThemedText>
                            <ThemedText style={styles.authorBio}>{author?.bio}</ThemedText>
                        </View>

                        {/* Stats Row */}
                        <View style={styles.statsRow}>
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
                                        name={isFollowing ? "person-remove" : "person-add"} 
                                        size={18} 
                                        color="#FFFFFF" 
                                    />
                                    <ThemedText style={styles.followButtonText}>
                                        {isFollowing ? 'Unfollow' : 'Follow'}
                                    </ThemedText>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Tabs */}
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

                    {/* Content List */}
                    <View style={styles.listContainer}>
                        {activeTab === 'Stories' ? (
                            stories.length > 0 ? (
                                <FlatList
                                    data={stories}
                                    renderItem={renderStoryItem}
                                    keyExtractor={(item) => item.id}
                                    scrollEnabled={false}
                                    contentContainerStyle={styles.listContent}
                                />
                            ) : (
                                <View style={styles.emptyContainer}>
                                    <Ionicons name="document-text-outline" size={48} color="#ccc" />
                                    <ThemedText style={styles.emptyText}>No stories yet</ThemedText>
                                </View>
                            )
                        ) : (
                            podcasts.length > 0 ? (
                                <FlatList
                                    data={podcasts}
                                    renderItem={renderPodcastItem}
                                    keyExtractor={(item) => item.id}
                                    scrollEnabled={false}
                                    contentContainerStyle={styles.listContent}
                                />
                            ) : (
                                <View style={styles.emptyContainer}>
                                    <Ionicons name="mic-outline" size={48} color="#ccc" />
                                    <ThemedText style={styles.emptyText}>No podcasts yet</ThemedText>
                                </View>
                            )
                        )}
                    </View>
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
                                onPress={() => handleMenuOption('follow')}
                            >
                                <Ionicons 
                                    name={isFollowing ? "person-remove-outline" : "person-add-outline"} 
                                    size={20} 
                                    color="#000" 
                                />
                                <ThemedText style={styles.menuText}>
                                    {isFollowing ? 'Unfollow' : 'Follow'}
                                </ThemedText>
                            </TouchableOpacity>
                            
                            <View style={styles.menuDivider} />
                            
                            <TouchableOpacity 
                                style={styles.menuItem}
                                onPress={() => handleMenuOption('report')}
                            >
                                <Ionicons name="flag-outline" size={20} color="#000" />
                                <ThemedText style={styles.menuText}>Report</ThemedText>
                            </TouchableOpacity>
                            
                            <View style={styles.menuDivider} />
                            
                            <TouchableOpacity 
                                style={[styles.menuItem, styles.blockItem]}
                                onPress={() => handleMenuOption('block')}
                            >
                                <Ionicons name="ban-outline" size={20} color="#FF3B30" />
                                <ThemedText style={[styles.menuText, styles.blockText]}>Block</ThemedText>
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
        letterSpacing: .5
    },
    coverImage: {
        width: '100%',
        height: 180,
        resizeMode: 'cover',
    },
    profileSection: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    profileImageWrapper: {
        position: 'absolute',
        top: -40,
        left: 20,
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
    profileInfo: {
        marginTop: 50,
        marginBottom: 16,
    },
    authorName: {
        fontSize: 24,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        marginBottom: 6,
    },
    authorBio: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#666',
        lineHeight: 20,
    },
    statsRow: {
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
    followButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4B59B3',
        paddingVertical: 12,
        borderRadius: 10,
        gap: 8,
    },
    followingButton: {
        backgroundColor: '#EF4444',
    },
    followButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'CoFoRaffineMedium',
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        gap: 32,
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
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    listContent: {
        gap: 12,
    },
    contentCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        padding: 12,
        gap: 12,
    },
    contentImage: {
        width: 70,
        height: 70,
        borderRadius: 8,
    },
    contentInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    contentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
        flexWrap: 'wrap',
    },
    contentTitle: {
        fontSize: 14,
        fontFamily: 'CoFoRaffineMedium',
        color: '#000',
        flex: 1,
        lineHeight: 18,
    },
    premiumTag: {
        backgroundColor: '#FF9500',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    premiumTagText: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#FFF',
        fontFamily: 'CoFoRaffineBold',
    },
    contentMeta: {
        fontSize: 11,
        fontFamily: 'tenez',
        color: '#999',
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
        width: 250,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
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
    },
    blockItem: {},
    blockText: {
        color: '#FF3B30',
    },
});