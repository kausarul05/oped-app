import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import storyService from '../../../services/storyService';

export default function SavedDrafts({ navigation }) {
    const { colors } = useTheme();
    const [activeTab, setActiveTab] = useState('Draft');
    const [menuVisible, setMenuVisible] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedFeedbackItem, setSelectedFeedbackItem] = useState(null);
    const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
    const [feedbackContent, setFeedbackContent] = useState('');
    const [loadingFeedback, setLoadingFeedback] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [storiesData, setStoriesData] = useState({
        draft: [],
        pending: [],
        published: [],
        rejected: [],
        revision: [],
        scheduled: [],
    });
    const scrollViewRef = useRef(null);

    // All tabs with their respective status
    const tabs = [
        { key: 'Draft', label: 'Draft', status: 'draft', apiEndpoint: 'my-stories' },
        { key: 'Pending', label: 'Pending', status: 'pending', apiEndpoint: 'my-stories' },
        { key: 'Published', label: 'Published', status: 'published', apiEndpoint: 'my-stories' },
        { key: 'Rejected', label: 'Rejected', status: 'rejected', apiEndpoint: 'my-stories' },
        { key: 'Revision', label: 'Revision', status: 'revision', apiEndpoint: 'my-stories' },
        { key: 'Scheduled', label: 'Scheduled', status: 'scheduled', apiEndpoint: 'scheduled' },
    ];

    const gradientColors = ['#343E87', '#3448D6', '#343E87'];

    // Fetch stories for a specific status
    const fetchStoriesByStatus = async (status, apiEndpoint, page = 1, limit = 50) => {
        try {
            let result;
            if (apiEndpoint === 'scheduled') {
                // Use dedicated scheduled API
                result = await storyService.getScheduledStories(page, limit);
            } else {
                // Use regular my-stories API
                result = await storyService.getWriterStories(status, page, limit);
            }
            
            if (result.success && result.data) {
                const formattedStories = result.data.map(story => ({
                    id: story._id,
                    title: story.title,
                    description: story.summary?.substring(0, 100) + '...',
                    image: story.coverImage,
                    date: formatDate(story.createdAt),
                    scheduledDate: story.scheduledAt ? formatDate(story.scheduledAt) : null,
                    status: story.status,
                    type: story.type || 'story',
                    isPremium: story.isPremium,
                }));
                return formattedStories;
            }
            return [];
        } catch (error) {
            console.error(`Error fetching ${status} stories:`, error);
            return [];
        }
    };

    // Fetch feedback for a story
    const fetchFeedback = async (storyId) => {
        setLoadingFeedback(true);
        try {
            const result = await storyService.getStoryFeedback(storyId);
            if (result.success) {
                if (result.data?.feedback) {
                    setFeedbackContent(result.data.feedback);
                } else {
                    setFeedbackContent('No feedback available for this story.');
                }
            } else {
                setFeedbackContent('Unable to load feedback. Please try again.');
            }
        } catch (error) {
            console.error('Error fetching feedback:', error);
            setFeedbackContent('Error loading feedback.');
        } finally {
            setLoadingFeedback(false);
            setFeedbackModalVisible(true);
        }
    };

    // Fetch all stories for all statuses
    const fetchAllStories = async () => {
        setLoading(true);
        try {
            const results = await Promise.all([
                fetchStoriesByStatus('draft', 'my-stories'),
                fetchStoriesByStatus('pending', 'my-stories'),
                fetchStoriesByStatus('published', 'my-stories'),
                fetchStoriesByStatus('rejected', 'my-stories'),
                fetchStoriesByStatus('revision', 'my-stories'),
                fetchStoriesByStatus('scheduled', 'scheduled'),
            ]);
            
            setStoriesData({
                draft: results[0],
                pending: results[1],
                published: results[2],
                rejected: results[3],
                revision: results[4],
                scheduled: results[5],
            });
        } catch (error) {
            console.error('Error fetching all stories:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAllStories();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchAllStories();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            day: 'numeric', 
            month: 'long', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    // Get data for current active tab
    const getCurrentTabData = () => {
        const tab = tabs.find(t => t.key === activeTab);
        if (!tab) return [];
        return storiesData[tab.status] || [];
    };

    const handleThreeDotPress = (itemId) => {
        setSelectedItem(itemId);
        setMenuVisible(true);
    };

    const handleViewFeedback = (storyId) => {
        setMenuVisible(false);
        fetchFeedback(storyId);
    };

    const handleMenuOption = (option) => {
        setMenuVisible(false);
        if (option === 'View Feedback') {
            fetchFeedback(selectedItem);
        } else {
            console.log(`${option} clicked for item ${selectedItem}`);
        }
    };

    const getMenuOptions = () => {
        if (activeTab === 'Draft') {
            return [
                { icon: 'create-outline', label: 'Edit', color: '#000' },
                { icon: 'send-outline', label: 'Submit for Review', color: '#000' },
                { icon: 'trash-outline', label: 'Delete', color: '#FF3B30' },
            ];
        } else if (activeTab === 'Pending') {
            return [
                { icon: 'eye-outline', label: 'View Details', color: '#000' },
                { icon: 'close-circle-outline', label: 'Cancel Request', color: '#FF3B30' },
            ];
        } else if (activeTab === 'Published') {
            return [
                { icon: 'eye-outline', label: 'View', color: '#000' },
                { icon: 'share-social-outline', label: 'Share', color: '#000' },
                { icon: 'trash-outline', label: 'Delete', color: '#FF3B30' },
            ];
        } else if (activeTab === 'Rejected') {
            return [
                { icon: 'eye-outline', label: 'View Details', color: '#000' },
                { icon: 'chatbubble-outline', label: 'View Feedback', color: '#4B59B3' },
                { icon: 'create-outline', label: 'Edit & Resubmit', color: '#000' },
                { icon: 'trash-outline', label: 'Delete', color: '#FF3B30' },
            ];
        } else if (activeTab === 'Revision') {
            return [
                { icon: 'eye-outline', label: 'View Details', color: '#000' },
                { icon: 'chatbubble-outline', label: 'View Feedback', color: '#4B59B3' },
                { icon: 'create-outline', label: 'Make Changes', color: '#000' },
                { icon: 'trash-outline', label: 'Delete', color: '#FF3B30' },
            ];
        } else if (activeTab === 'Scheduled') {
            return [
                { icon: 'create-outline', label: 'Edit', color: '#000' },
                { icon: 'calendar-outline', label: 'Reschedule', color: '#000' },
                { icon: 'close-circle-outline', label: 'Cancel Schedule', color: '#FF3B30' },
            ];
        }
        return [
            { icon: 'create-outline', label: 'Edit', color: '#000' },
            { icon: 'trash-outline', label: 'Delete', color: '#FF3B30' },
        ];
    };

    const renderDraftItem = ({ item }) => {
        const showTime = activeTab === 'Published' || activeTab === 'Scheduled';
        const isRequestRevision = activeTab === 'Revision';
        const isPending = activeTab === 'Pending';
        const isRejected = activeTab === 'Rejected';
        const displayDate = activeTab === 'Scheduled' && item.scheduledDate ? item.scheduledDate : item.date;

        return (
            <TouchableOpacity 
                style={styles.draftItem}
                onPress={() => {
                    if (item.type === 'story') {
                        navigation.navigate('WriterStoreDetail', { storyId: item.id });
                    } else {
                        navigation.navigate('PodcastDetail', { podcastId: item.id });
                    }
                }}
            >
                <View style={styles.draftHeader}>
                    {showTime && displayDate && (
                        <ThemedText style={styles.draftDate}>{displayDate}</ThemedText>
                    )}
                    
                    {(isRequestRevision || isRejected) && (
                        <TouchableOpacity 
                            style={styles.feedbackButton}
                            onPress={() => fetchFeedback(item.id)}
                        >
                            <ThemedText style={styles.feedbackButtonText}>View Feedback</ThemedText>
                        </TouchableOpacity>
                    )}

                    {isPending && (
                        <View style={styles.pendingBadge}>
                            <ThemedText style={styles.pendingText}>Under Review</ThemedText>
                        </View>
                    )}

                    {!showTime && !isRequestRevision && !isRejected && !isPending && (
                        <View />
                    )}

                    <TouchableOpacity
                        style={styles.menuButton}
                        onPress={() => handleThreeDotPress(item.id)}
                    >
                        <Ionicons name="ellipsis-horizontal" size={16} color="#999" />
                    </TouchableOpacity>
                </View>
                
                <View style={styles.draftContent}>
                    <View style={styles.draftTextContent}>
                        <ThemedText style={styles.draftTitle}>{item.title}</ThemedText>
                        <ThemedText style={styles.draftDescription} numberOfLines={2}>
                            {item.description}
                        </ThemedText>
                        {item.isPremium && (
                            <View style={styles.premiumBadge}>
                                <ThemedText style={styles.premiumBadgeText}>PREMIUM</ThemedText>
                            </View>
                        )}
                    </View>
                    <Image source={{ uri: item.image }} style={styles.draftImage} />
                </View>
            </TouchableOpacity>
        );
    };

    const currentData = getCurrentTabData();
    const menuOptions = getMenuOptions();

    if (loading && !refreshing) {
        return (
            <ThemedView style={styles.loadingContainer}>
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
                    <ThemedText style={styles.headerTitle}>Save & Draft</ThemedText>
                    <View />
                </View>

                {/* Horizontal Scroll Tabs */}
                <View style={styles.tabsWrapper}>
                    <ScrollView
                        ref={scrollViewRef}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.tabsScrollContent}
                    >
                        {tabs.map((tab) => {
                            const count = storiesData[tab.status]?.length || 0;
                            const displayLabel = `${tab.label} (${count})`;
                            return (
                                <TouchableOpacity
                                    key={tab.key}
                                    onPress={() => setActiveTab(tab.key)}
                                    style={styles.tabContainer}
                                >
                                    {activeTab === tab.key ? (
                                        <LinearGradient
                                            colors={gradientColors}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={styles.activeTabGradient}
                                        >
                                            <ThemedText style={styles.activeTabText}>
                                                {displayLabel}
                                            </ThemedText>
                                        </LinearGradient>
                                    ) : (
                                        <View style={[styles.inactiveTab, { borderColor: '#343E87' }]}>
                                            <ThemedText style={styles.inactiveTabText}>
                                                {displayLabel}
                                            </ThemedText>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Drafts List */}
                {currentData.length > 0 ? (
                    <FlatList
                        data={currentData}
                        renderItem={renderDraftItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                ) : (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="document-text-outline" size={60} color="#ccc" />
                        <ThemedText style={styles.emptyTitle}>No {activeTab} Stories</ThemedText>
                        <ThemedText style={styles.emptySubText}>
                            {activeTab === 'Draft' && 'Your draft stories will appear here'}
                            {activeTab === 'Pending' && 'No stories pending review'}
                            {activeTab === 'Published' && 'Your published stories will appear here'}
                            {activeTab === 'Rejected' && 'Rejected stories will appear here'}
                            {activeTab === 'Revision' && 'Stories needing revision will appear here'}
                            {activeTab === 'Scheduled' && 'Scheduled stories will appear here'}
                        </ThemedText>
                        {/* {(activeTab === 'Draft' || activeTab === 'Published') && (
                            <TouchableOpacity 
                                style={styles.createButton}
                                onPress={() => navigation.navigate('AddStory')}
                            >
                                <ThemedText style={styles.createButtonText}>Create New Story</ThemedText>
                            </TouchableOpacity>
                        )} */}
                    </View>
                )}
            </SafeAreaView>

            {/* Feedback Modal */}
            <Modal
                visible={feedbackModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setFeedbackModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setFeedbackModalVisible(false)}
                >
                    <View style={styles.feedbackModalContainer}>
                        <View style={styles.feedbackModalHeader}>
                            <ThemedText style={styles.feedbackModalTitle}>Feedback</ThemedText>
                            <TouchableOpacity onPress={() => setFeedbackModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.feedbackModalContent}>
                            {loadingFeedback ? (
                                <ActivityIndicator size="large" color="#4B59B3" />
                            ) : (
                                <ThemedText style={styles.feedbackModalText}>
                                    {feedbackContent}
                                </ThemedText>
                            )}
                        </ScrollView>
                        <TouchableOpacity 
                            style={styles.feedbackModalButton}
                            onPress={() => setFeedbackModalVisible(false)}
                        >
                            <ThemedText style={styles.feedbackModalButtonText}>Close</ThemedText>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

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
                        {menuOptions.map((option, index) => (
                            <React.Fragment key={option.label}>
                                <TouchableOpacity
                                    style={styles.menuItem}
                                    onPress={() => handleMenuOption(option.label)}
                                >
                                    <Ionicons name={option.icon} size={20} color={option.color} />
                                    <ThemedText style={[styles.menuText, option.label === 'Delete' && styles.deleteText]}>
                                        {option.label}
                                    </ThemedText>
                                </TouchableOpacity>
                                {index < menuOptions.length - 1 && <View style={styles.menuDivider} />}
                            </React.Fragment>
                        ))}
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    headerTitle: {
        fontSize: 20,
        fontWeight: '400',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
    },
    tabsWrapper: {
        paddingVertical: 12,
    },
    tabsScrollContent: {
        paddingHorizontal: 16,
        gap: 12,
    },
    tabContainer: {
        marginRight: 8,
    },
    activeTabGradient: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 25,
        shadowColor: '#343E87',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#343E87',
    },
    activeTabText: {
        fontSize: 14,
        fontFamily: 'CoFoRaffineBold',
        color: '#FFFFFF',
        letterSpacing: 1
    },
    inactiveTab: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 25,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#343E87',
    },
    inactiveTabText: {
        fontSize: 14,
        fontFamily: 'CoFoRaffineMedium',
        color: '#666',
        letterSpacing: 1
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginBottom: 8,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 20,
    },
    draftItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        gap: 12,
        backgroundColor: '#fff',
        elevation: 1,
        marginBottom: 16,
        borderRadius: 8,
        padding: 8
    },
    draftHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    draftContent: {
        flexDirection: "row",
        justifyContent: 'space-between',
        gap: 12
    },
    draftTextContent: {
        width: '70%',
    },
    draftDate: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#000',
        marginBottom: 4,
        backgroundColor: '#AAB44F1A',
        padding: 4,
        borderRadius: 25,
        paddingHorizontal: 8,
        letterSpacing: 1
    },
    draftTitle: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        marginBottom: 4,
        letterSpacing: 1
    },
    draftDescription: {
        fontSize: 13,
        fontFamily: 'tenez',
        color: '#666',
        lineHeight: 18,
        marginBottom: 8,
        letterSpacing: 1
    },
    draftImage: {
        width: 90,
        height: 90,
        borderRadius: 8,
    },
    menuButton: {
        padding: 4,
    },
    feedbackButton: {
        backgroundColor: '#e9ecff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        alignSelf: 'flex-start',
    },
    feedbackButtonText: {
        fontSize: 12,
        fontFamily: 'CoFoRaffineBold',
        color: '#4B59B3',
    },
    pendingBadge: {
        backgroundColor: '#FF9500',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 16,
    },
    pendingText: {
        fontSize: 12,
        fontFamily: 'CoFoRaffineBold',
        color: '#FFFFFF',
    },
    premiumBadge: {
        backgroundColor: '#FF9500',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    premiumBadgeText: {
        fontSize: 10,
        fontFamily: 'CoFoRaffineBold',
        color: '#FFFFFF',
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
    feedbackModalContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        width: '85%',
        maxHeight: '70%',
    },
    feedbackModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    feedbackModalTitle: {
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
    },
    feedbackModalContent: {
        padding: 16,
        maxHeight: 300,
    },
    feedbackModalText: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#444',
        lineHeight: 20,
    },
    feedbackModalButton: {
        backgroundColor: '#4B59B3',
        margin: 16,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    feedbackModalButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: 'CoFoRaffineBold',
    },
});