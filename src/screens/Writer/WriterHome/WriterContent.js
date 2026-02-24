import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Foundation, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    ScrollView,
    Share,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';


export default function WriterContent({ navigation }) {
    const { colors } = useTheme();
    const [activeTab, setActiveTab] = useState('Articles');
    const [likedItems, setLikedItems] = useState({});
    const [likeCounts, setLikeCounts] = useState({});
    const [commentCounts, setCommentCounts] = useState({});
    const [shareCounts, setShareCounts] = useState({});
    const [menuVisible, setMenuVisible] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

    // Writer data
    const writer = {
        name: 'Daniel Thompson',
        avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
        bio: 'Katy Waldman is a culture and lifestyle writer who explores modern trends, human stories, and creative perspectives. Her writing focuses on thoughtful analysis and engaging storytelling. She brings clarity and insight to complex topics through well-researched and compelling articles.',
    };

    // Articles data with stats
    const articles = [
        {
            id: '1',
            title: 'Why Subscription-Based Content Is Growing Fast.',
            description: 'As technology evolves and reader habits shift, independ...',
            image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            likes: 9000000,
            comments: 45000,
            shares: 854,
            likesDisplay: '9M',
            commentsDisplay: '45K',
            sharesDisplay: '854',
        },
        {
            id: '2',
            title: 'Why Subscription-Based Content Is Growing Fast.',
            description: 'As technology evolves and reader habits shift, independ...',
            image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            likes: 9000000,
            comments: 45000,
            shares: 854,
            likesDisplay: '9M',
            commentsDisplay: '45K',
            sharesDisplay: '854',
        },
        {
            id: '3',
            title: 'Why Subscription-Based Content Is Growing Fast.',
            description: 'As technology evolves and reader habits shift, independ...',
            image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            likes: 9000000,
            comments: 45000,
            shares: 854,
            likesDisplay: '9M',
            commentsDisplay: '45K',
            sharesDisplay: '854',
        },
        {
            id: '4',
            title: 'Why Subscription-Based Content Is Growing Fast.',
            description: 'As technology evolves and reader habits shift, independ...',
            image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            likes: 9000000,
            comments: 45000,
            shares: 854,
            likesDisplay: '9M',
            commentsDisplay: '45K',
            sharesDisplay: '854',
        },
        {
            id: '5',
            title: 'Why Subscription-Based Content Is Growing Fast.',
            description: 'As technology evolves and reader habits shift, independ...',
            image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            likes: 9000000,
            comments: 45000,
            shares: 854,
            likesDisplay: '9M',
            commentsDisplay: '45K',
            sharesDisplay: '854',
        },
        {
            id: '6',
            title: 'Why Subscription-Based Content Is Growing Fast.',
            description: 'As technology evolves and reader habits shift, independ...',
            image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            likes: 9000000,
            comments: 45000,
            shares: 854,
            likesDisplay: '9M',
            commentsDisplay: '45K',
            sharesDisplay: '854',
        },
    ];

    // Podcasts data with stats
    const podcasts = [
        {
            id: '1',
            title: 'Why Subscription-Based Content Is Growing Fast.',
            description: 'As technology evolves and reader habits shift, independ...',
            image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            likes: 9000000,
            comments: 45000,
            shares: 854,
            likesDisplay: '9M',
            commentsDisplay: '45K',
            sharesDisplay: '854',
        },
        {
            id: '2',
            title: 'Why Subscription-Based Content Is Growing Fast.',
            description: 'As technology evolves and reader habits shift, independ...',
            image: 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            likes: 9000000,
            comments: 45000,
            shares: 854,
            likesDisplay: '9M',
            commentsDisplay: '45K',
            sharesDisplay: '854',
        },
        {
            id: '3',
            title: 'Why Subscription-Based Content Is Growing Fast.',
            description: 'As technology evolves and reader habits shift, independ...',
            image: 'https://images.unsplash.com/photo-1590602847861-f3579e41b79e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            likes: 9000000,
            comments: 45000,
            shares: 854,
            likesDisplay: '9M',
            commentsDisplay: '45K',
            sharesDisplay: '854',
        },
    ];

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
            const result = await Share.share({
                message: `${item.title}\n\n${item.description}\n\nRead more on HOPED app`,
                title: 'Share Content'
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
            case 'save':
                Alert.alert('Save', 'Content saved to bookmarks!');
                break;
            case 'hide':
                Alert.alert('Hide', 'This content will be hidden from your feed.');
                break;
            case 'report':
                Alert.alert('Report', 'Thank you for reporting. We will review this content.');
                break;
            case 'notInterested':
                Alert.alert('Not Interested', 'We will show fewer posts like this.');
                break;
        }
    };

    const getDisplayLikes = (item) => {
        if (likeCounts[item.id]) {
            return likeCounts[item.id] > 1000000 
                ? (likeCounts[item.id] / 1000000).toFixed(1) + 'M'
                : likeCounts[item.id] > 1000
                    ? (likeCounts[item.id] / 1000).toFixed(1) + 'K'
                    : likeCounts[item.id].toString();
        }
        return item.likesDisplay;
    };

    const getDisplayComments = (item) => {
        if (commentCounts[item.id]) {
            const total = item.comments + commentCounts[item.id];
            return total > 1000 
                ? (total / 1000).toFixed(1) + 'K'
                : total.toString();
        }
        return item.commentsDisplay;
    };

    const getDisplayShares = (item) => {
        if (shareCounts[item.id]) {
            return (item.shares + shareCounts[item.id]).toString();
        }
        return item.sharesDisplay;
    };

    const renderArticleItem = (item) => {
        const isLiked = likedItems[item.id] || false;

        return (
            <View key={item.id} style={styles.contentItem}>
                <View style={styles.contentTextContainer}>
                    <ThemedText style={styles.contentTitle}>{item.title}</ThemedText>
                    <ThemedText style={styles.contentDescription} numberOfLines={1}>
                        {item.description}
                    </ThemedText>

                    {/* Read More Button */}
                    <TouchableOpacity style={styles.readMoreButton}>
                        <ThemedText style={styles.readMoreText}>Read More</ThemedText>
                    </TouchableOpacity>

                    {/* Stats Section with 3-dot */}
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
                            <Ionicons name="ellipsis-vertical" size={16} color="#999" />
                        </TouchableOpacity>
                    </View>
                </View>
                <Image source={{ uri: item.image }} style={styles.contentImage} />
            </View>
        );
    };

    const renderPodcastItem = (item) => {
        const isLiked = likedItems[item.id] || false;

        return (
            <View key={item.id} style={styles.contentItem}>
                <Image source={{ uri: item.image }} style={styles.contentImage} />
                <View style={styles.contentTextContainer}>
                    <ThemedText style={styles.contentTitle}>{item.title}</ThemedText>
                    <ThemedText style={styles.contentDescription} numberOfLines={1}>
                        {item.description}
                    </ThemedText>

                    {/* Listen Now Button */}
                    <TouchableOpacity style={styles.readMoreButton}>
                        <ThemedText style={styles.readMoreText}>Listen Now</ThemedText>
                    </TouchableOpacity>

                    {/* Stats Section with 3-dot */}
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
                            <Ionicons name="ellipsis-vertical" size={16} color="#999" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <ThemedView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Profile Section */}
                <View style={styles.profileSection}>
                    <Image source={{ uri: writer.avatar }} style={styles.profileImage} />
                    <ThemedText style={styles.writerName}>{writer.name}</ThemedText>
                    <ThemedText style={styles.writerBio}>{writer.bio}</ThemedText>
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
                        {articles.map((item) => renderArticleItem(item))}
                    </View>
                ) : (
                    <View style={styles.contentList}>
                        {podcasts.map((item) => renderPodcastItem(item))}
                    </View>
                )}
            </ScrollView>

            <View style={{ height: 1 }} />

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
                            <ThemedText style={styles.menuText}>Save</ThemedText>
                        </TouchableOpacity>

                        <View style={styles.menuDivider} />

                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => handleMenuOption('hide')}
                        >
                            <Ionicons name="eye-off-outline" size={20} color="#000" />
                            <ThemedText style={styles.menuText}>Hide</ThemedText>
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
                            <ThemedText style={[styles.menuText, styles.reportText]}>Report</ThemedText>
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
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 24,
    },
    tab: {
        paddingBottom: 4,
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
    contentList: {
        paddingHorizontal: 16,
        gap: 20,
    },
    contentItem: {
        flexDirection: 'row',
        gap: 12,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        elevation: 1,
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#fff'
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