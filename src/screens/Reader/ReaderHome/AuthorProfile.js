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
import authService from '../../../services/authService';
import storyService from '../../../services/storyService';

export default function AuthorProfile({ route, navigation }) {
    const { colors } = useTheme();
    const { authorId, authorName, authorImage, authorBio } = route.params || {};
    const [activeTab, setActiveTab] = useState('Stories');
    const [menuVisible, setMenuVisible] = useState(false);
    const [author, setAuthor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stories, setStories] = useState([]);
    const [podcasts, setPodcasts] = useState([]);

    // Fetch author profile from API
    useEffect(() => {
        fetchAuthorProfile();
        fetchAuthorStories();
    }, [authorId]);

    const fetchAuthorProfile = async () => {
        try {
            // If we have author data from params, use it
            if (authorName && authorImage) {
                setAuthor({
                    id: authorId,
                    name: authorName,
                    profileImage: authorImage,
                    bio: authorBio || 'No bio available',
                    coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&auto=format&fit=crop&w=2020&q=80',
                });
                setLoading(false);
                return;
            }

            // Otherwise fetch from API
            const result = await authService.getProfile();
            if (result.success && result.data) {
                const profileData = result.data;
                setAuthor({
                    id: profileData._id,
                    name: profileData.name,
                    profileImage: profileData.profileImage,
                    bio: profileData.bio || 'No bio available',
                    coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&auto=format&fit=crop&w=2020&q=80',
                    email: profileData.email,
                    isVerified: profileData.isVerified,
                    isSubscribed: profileData.isSubscribed,
                });
            } else {
                // Fallback mock data
                setAuthor({
                    id: '1',
                    name: authorName || 'Eric Lach',
                    profileImage: authorImage || 'https://randomuser.me/api/portraits/women/1.jpg',
                    bio: authorBio || 'Writer and storyteller passionate about digital media and independent journalism.',
                    coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&auto=format&fit=crop&w=2020&q=80',
                });
            }
        } catch (error) {
            console.error('Error fetching author profile:', error);
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

    const fetchAuthorStories = async () => {
        try {
            // Fetch stories by author
            const result = await storyService.getStories('', 1, 10);
            if (result.success && result.data) {
                const authorStories = result.data.filter(story => story.author?._id === authorId);
                setStories(authorStories.map(story => ({
                    id: story._id,
                    title: story.title,
                    type: story.isPremium ? 'Premium Story' : 'Featured Story',
                    image: story.coverImage,
                })));
            } else {
                // Mock data
                setStories([
                    { id: '1', title: 'The Future of Digital Media and the Changing Voice of Independent Journalism...', type: 'Featured Story', image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80' },
                    { id: '2', title: 'The Future of Digital Media and the Changing Voice of Independent Journalism...', type: 'Featured Article', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80' },
                ]);
            }
        } catch (error) {
            console.error('Error fetching author stories:', error);
        }
    };

    const handleMenuOption = (option) => {
        setMenuVisible(false);
        switch(option) {
            case 'follow':
                Alert.alert('Follow', `You are now following ${author?.name}`);
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
            onPress={() => navigation.navigate('StoryDetail', { postId: item.id })}
        >
            <Image source={{ uri: item.image }} style={styles.storyImage} />
            <View style={styles.storyContent}>
                <ThemedText style={styles.storyTitle}>{item.title}</ThemedText>
                <ThemedText style={styles.storyType}>{item.type}</ThemedText>
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
                        <Ionicons name="ellipsis-vertical" size={24} color="#000" />
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
                        </View>

                        {/* Author Bio */}
                        <ThemedText style={styles.authorBio}>{author?.bio}</ThemedText>

                        {/* Follow and Feedback Buttons */}
                        <View style={styles.actionButtonsContainer}>
                            <TouchableOpacity 
                                style={styles.followButton}
                                onPress={() => Alert.alert('Follow', `You are now following ${author?.name}`)}
                            >
                                <Ionicons name="person-add-outline" size={18} color="#FFFFFF" />
                                <ThemedText style={styles.followButtonText}>Follow author</ThemedText>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.feedbackButton}
                                onPress={() => Alert.alert('Give Feedback', 'Thank you for your feedback!')}
                            >
                                <Ionicons name="chatbubble-outline" size={18} color="#4B59B3" />
                                <ThemedText style={styles.feedbackButtonText}>Give feedback</ThemedText>
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
                                Stories ({stories.length})
                            </ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'Podcasts' && styles.activeTab]}
                            onPress={() => setActiveTab('Podcasts')}
                        >
                            <ThemedText style={[styles.tabText, activeTab === 'Podcasts' && styles.activeTabText]}>
                                Podcasts ({podcasts.length})
                            </ThemedText>
                        </TouchableOpacity>
                    </View>

                    {/* Stories List */}
                    {activeTab === 'Stories' && (
                        <View style={styles.listContainer}>
                            <FlatList
                                data={stories}
                                renderItem={renderStoryItem}
                                keyExtractor={(item) => item.id}
                                scrollEnabled={false}
                                contentContainerStyle={styles.listContent}
                            />
                        </View>
                    )}

                    {/* Podcasts List */}
                    {activeTab === 'Podcasts' && (
                        <View style={styles.listContainer}>
                            <FlatList
                                data={podcasts}
                                renderItem={renderStoryItem}
                                keyExtractor={(item) => item.id}
                                scrollEnabled={false}
                                contentContainerStyle={styles.listContent}
                            />
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
                                <Ionicons name="person-add-outline" size={20} color="#000" />
                                <ThemedText style={styles.menuText}>Follow Author</ThemedText>
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
        marginTop: 8
    },
    authorName: {
        fontSize: 24,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
    },
    authorBio: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#666',
        lineHeight: 20,
        marginBottom: 16,
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
    followButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: 'CoFoRaffineMedium',
    },
    feedbackButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F0F0F0',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        gap: 8,
    },
    feedbackButtonText: {
        color: '#4B59B3',
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
});