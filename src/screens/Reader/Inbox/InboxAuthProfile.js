import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
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

export default function InboxAuthProfile({ route, navigation }) {
    const { colors } = useTheme();
    const [activeTab, setActiveTab] = useState('Stories');
    const [menuVisible, setMenuVisible] = useState(false);
    const [isFollowing, setIsFollowing] = useState(true);

    const { author } = route.params || {};

    // Mock author data (use passed data or fallback)
    const authorData = author || {
        id: '1',
        name: 'Eric Lach',
        formerTitle: 'FORMERLY MasterChef',
        coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2020&q=80',
        profileImage: 'https://randomuser.me/api/portraits/men/2.jpg',
        bio: 'Katy Waldman is a culture and lifestyle writer who explores modern trends, human stories, and creative perspectives. Her writing focuses on thoughtful analysis and engaging storytelling. She brings clarity and insight to complex topics through well-researched and compelling articles.',
    };

    // Mock stories data
    const stories = [
        {
            id: '1',
            title: 'The Future of Digital Media and the Changing Voice of Independent Journal...',
            type: 'Featured Story',
            image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        },
        {
            id: '2',
            title: 'The Future of Digital Media and the Changing Voice of Independent Journal...',
            type: 'Featured Article',
            image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        },
        {
            id: '3',
            title: 'The Future of Digital Media and the Changing Voice of Independent Journal...',
            type: 'Featuring Story',
            image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        },
        {
            id: '4',
            title: 'The Future of Digital Media and the Changing Voice of Independent Journal...',
            type: 'Featured Story',
            image: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80',
        },
        {
            id: '5',
            title: 'The Future of Digital Media and the Changing Voice of Independent Journal...',
            type: 'Featuring Story',
            image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        },
    ];

    // Mock podcasts data
    const podcasts = [
        {
            id: '1',
            title: 'The Future of Digital Media and the Changing Voice of Independent Journal...',
            type: 'Featured Podcast',
            image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        },
        {
            id: '2',
            title: 'The Future of Digital Media and the Changing Voice of Independent Journal...',
            type: 'Featured Podcast',
            image: 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        },
        {
            id: '3',
            title: 'The Future of Digital Media and the Changing Voice of Independent Journal...',
            type: 'Featured Podcast',
            image: 'https://images.unsplash.com/photo-1590602847861-f3579e41b79e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        },
    ];

    const handleMenuOption = (option) => {
        setMenuVisible(false);
        switch (option) {
            case 'report':
                Alert.alert('Report', 'Thank you for reporting. We will review this profile.');
                break;
            case 'block':
                Alert.alert('Block', `You have blocked ${authorData.name}`);
                break;
        }
    };

    const handleNotificationPress = () => {
        Alert.alert('Notifications', `Notification settings for ${authorData.name}`);
    };

    const handleMessagePress = () => {
        Alert.alert('Message', `Send message to ${authorData.name}`);
    };

    const handleUnfollowPress = () => {
        setIsFollowing(!isFollowing);
        Alert.alert(
            isFollowing ? 'Unfollowed' : 'Followed',
            isFollowing ? `You have unfollowed ${authorData.name}` : `You are now following ${authorData.name}`
        );
    };

    const renderStoryItem = ({ item }) => (
        <TouchableOpacity style={styles.storyItem}>
            <Image source={{ uri: item.image }} style={styles.storyImage} />
            <View style={styles.storyContent}>
                <ThemedText style={styles.storyTitle}>{item.title}</ThemedText>
                <ThemedText style={styles.storyType}>{item.type}</ThemedText>
            </View>
        </TouchableOpacity>
    );

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
                    <Image source={{ uri: authorData.coverImage }} style={styles.coverImage} />

                    {/* Profile Info Section */}
                    <View style={styles.profileInfoContainer}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View>
                                {/* Profile Image - Positioned to overlap cover */}
                                <View style={styles.profileImageWrapper}>
                                    <Image source={{ uri: authorData.profileImage }} style={styles.profileImage} />
                                </View>

                                {/* Author Name */}
                                <View style={styles.nameContainer}>
                                    <ThemedText style={styles.authorName}>{authorData.name}</ThemedText>
                                </View>
                            </View>

                            {/* Notification, Message and Unfollow Buttons */}
                            <View style={styles.actionButtonsContainer}>
                                <TouchableOpacity
                                    style={styles.iconButton}
                                    onPress={handleNotificationPress}
                                >
                                    <Ionicons name="notifications-outline" size={22} color="#000000" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.iconButton}
                                    onPress={handleMessagePress}
                                >
                                    <MaterialCommunityIcons name="message-text-outline" size={22} color="#000000" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.unfollowButton, isFollowing && styles.followingButton]}
                                    onPress={handleUnfollowPress}
                                >
                                    {/* <Ionicons 
                                    name={isFollowing ? "person-remove-outline" : "person-add-outline"} 
                                    size={18} 
                                    color={isFollowing ? "#fff" : "#FFFFFF"} 
                                /> */}
                                    <ThemedText style={[styles.unfollowButtonText, isFollowing && styles.followingButtonText]}>
                                        {isFollowing ? 'Unfollow' : 'Follow'}
                                    </ThemedText>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Author Bio */}
                        <ThemedText style={styles.authorBio}>{authorData.bio}</ThemedText>
                    </View>

                    {/* Stories | Podcasts Tabs */}
                    <View style={styles.tabsContainer}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'Stories' && styles.activeTab]}
                            onPress={() => setActiveTab('Stories')}
                        >
                            <ThemedText style={[styles.tabText, activeTab === 'Stories' && styles.activeTabText]}>
                                Stories
                            </ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'Podcasts' && styles.activeTab]}
                            onPress={() => setActiveTab('Podcasts')}
                        >
                            <ThemedText style={[styles.tabText, activeTab === 'Podcasts' && styles.activeTabText]}>
                                Podcasts
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
        top: -80,
        left: 0,
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
        alignItems: 'center',
        gap: 16,
        marginTop: -30
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        // backgroundColor: '#ffff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#0000001F'
    },
    unfollowButton: {
        // flex: 1,
        // flexDirection: 'row',
        // alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: '#000000',
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 25,
        gap: 8,
    },
    followingButton: {
        backgroundColor: '#000000',
        // borderWidth: 1,
        // borderColor: '#FF3B30',
    },
    unfollowButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: 'CoFoRaffineMedium',
    },
    followingButtonText: {
        color: '#ffff',
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