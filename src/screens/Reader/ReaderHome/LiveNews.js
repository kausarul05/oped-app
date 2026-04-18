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
    RefreshControl,
    ScrollView,
    Share,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import liveNewsService from '../../../services/liveNewsService';

export default function LiveNews({ navigation }) {
    const { colors } = useTheme();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [liveTime, setLiveTime] = useState('');
    const [liveNewsData, setLiveNewsData] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    
    // Modal states
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedNews, setSelectedNews] = useState(null);
    const [bookmarked, setBookmarked] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [shareCount, setShareCount] = useState(0);
    const [modalCurrentTime, setModalCurrentTime] = useState('');

    // Update live time every second
    useEffect(() => {
        const updateLiveTime = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit',
                hour12: false 
            });
            setLiveTime(timeString);
            setModalCurrentTime(timeString);
        };

        updateLiveTime();
        const interval = setInterval(updateLiveTime, 1000);
        return () => clearInterval(interval);
    }, []);

    // Fetch live news from API
    useEffect(() => {
        fetchLiveNews(1);
    }, []);

    const fetchLiveNews = async (pageNum = 1, isLoadMore = false) => {
        try {
            const result = await liveNewsService.getLiveNews(pageNum, 20);
            
            if (result.success && result.data) {
                const formattedNews = result.data.map((news, index) => ({
                    id: news._id,
                    time: formatTime(news.postedAt || news.createdAt),
                    title: news.content.substring(0, 100) + (news.content.length > 100 ? '...' : ''),
                    content: news.content,
                    isBreaking: index === 0,
                    author: news.author?.name || 'Unknown',
                    authorImage: news.author?.profileImage || 'https://randomuser.me/api/portraits/men/1.jpg',
                    postedAt: news.postedAt || news.createdAt,
                    createdAt: news.createdAt,
                    likes: news.likes || Math.floor(Math.random() * 100) + 10,
                    shares: news.shares || Math.floor(Math.random() * 20) + 5,
                }));
                
                if (isLoadMore) {
                    setLiveNewsData(prev => [...prev, ...formattedNews]);
                } else {
                    setLiveNewsData(formattedNews);
                }
                
                if (result.pagination) {
                    setHasMore(pageNum < result.pagination.totalPages);
                    setTotalPages(result.pagination.totalPages);
                }
                setPage(pageNum);
            }
        } catch (error) {
            console.error('Error fetching live news:', error);
            Alert.alert('Error', 'Failed to load live news');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
    };

    const formatPostedTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        return `${diffDays} days ago`;
    };

    const onRefresh = () => {
        setRefreshing(true);
        setPage(1);
        fetchLiveNews(1);
    };

    const loadMore = () => {
        if (hasMore && !loading && !refreshing) {
            fetchLiveNews(page + 1, true);
        }
    };

    const openNewsModal = (news) => {
        setSelectedNews(news);
        setLikeCount(news.likes);
        setShareCount(news.shares);
        setLiked(false);
        setBookmarked(false);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedNews(null);
    };

    const toggleLike = () => {
        const newLikedState = !liked;
        setLiked(newLikedState);
        setLikeCount(newLikedState ? likeCount + 1 : likeCount - 1);
    };

    const toggleBookmark = () => {
        const newState = !bookmarked;
        setBookmarked(newState);
        Alert.alert(
            newState ? 'Saved' : 'Removed',
            newState ? 'News saved to bookmarks!' : 'Bookmark removed'
        );
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `${selectedNews?.content}\n\nRead more on HOPED app`,
                title: 'Share Live News'
            });
            setShareCount(shareCount + 1);
        } catch (error) {
            console.log('Error sharing:', error);
        }
    };

    const renderNewsItem = ({ item, index }) => (
        <TouchableOpacity 
            style={[
                styles.newsItem,
                index === 0 && styles.firstNewsItem
            ]}
            onPress={() => openNewsModal(item)}
        >
            {/* Time Column */}
            <View style={styles.timeColumn}>
                <ThemedText style={styles.timeText}>{item.time}</ThemedText>
                {item.isBreaking && (
                    <View style={styles.breakingBadge}>
                        <ThemedText style={styles.breakingText}>BREAKING</ThemedText>
                    </View>
                )}
            </View>

            {/* Content Column */}
            <View style={styles.contentColumn}>
                <ThemedText style={styles.newsTitle}>{item.title}</ThemedText>
                <ThemedText style={styles.newsDescription} numberOfLines={3}>
                    {item.content}
                </ThemedText>
                
                {/* Live Indicator for first item */}
                {index === 0 && (
                    <View style={styles.liveIndicator}>
                        <View style={styles.liveDot} />
                        <ThemedText style={styles.liveText}>{formatPostedTime(item.createdAt)}</ThemedText>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    if (loading && liveNewsData.length === 0) {
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
                    <View style={styles.headerTitleContainer}>
                        <ThemedText style={styles.headerTitle}>Live News</ThemedText>
                        <View style={styles.headerLiveIndicator}>
                            <View style={styles.headerLiveDot} />
                            <ThemedText style={styles.headerLiveText}>LIVE</ThemedText>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
                        <Ionicons name="refresh-outline" size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                {/* Live Time Bar */}
                <View style={styles.liveTimeBar}>
                    <Ionicons name="radio-outline" size={18} color="#FF3B30" />
                    <ThemedText style={styles.liveTimeText}>{liveTime}</ThemedText>
                    <View style={styles.liveNowBadge}>
                        <View style={styles.liveNowDot} />
                        <ThemedText style={styles.liveNowText}>LIVE NOW</ThemedText>
                    </View>
                </View>

                {/* News List */}
                <FlatList
                    data={liveNewsData}
                    renderItem={renderNewsItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.newsList}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        loading && liveNewsData.length > 0 ? (
                            <View style={styles.loaderFooter}>
                                <ActivityIndicator size="small" color="#4B59B3" />
                            </View>
                        ) : null
                    }
                />
            </SafeAreaView>

            {/* News Detail Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {/* Modal Header */}
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={closeModal} style={styles.modalCloseButton}>
                                <Ionicons name="close" size={24} color="#000" />
                            </TouchableOpacity>
                            <View style={styles.modalLiveIndicator}>
                                <View style={styles.modalLiveDot} />
                                <ThemedText style={styles.modalLiveText}>LIVE</ThemedText>
                            </View>
                            <View style={styles.modalHeaderActions}>
                                <TouchableOpacity onPress={toggleBookmark} style={styles.modalHeaderAction}>
                                    <Ionicons 
                                        name={bookmarked ? "bookmark" : "bookmark-outline"} 
                                        size={20} 
                                        color={bookmarked ? "#4B59B3" : "#000"} 
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleShare} style={styles.modalHeaderAction}>
                                    <Ionicons name="share-outline" size={20} color="#000" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScrollContent}>
                            {/* Live Time Bar in Modal */}
                            <View style={styles.modalLiveTimeBar}>
                                <Ionicons name="radio-outline" size={14} color="#FF3B30" />
                                <ThemedText style={styles.modalLiveTimeText}>{modalCurrentTime}</ThemedText>
                                <View style={styles.modalLiveNowBadge}>
                                    <View style={styles.modalLiveNowDot} />
                                    <ThemedText style={styles.modalLiveNowText}>LIVE NOW</ThemedText>
                                </View>
                            </View>

                            {/* Breaking Badge */}
                            <View style={styles.modalBreakingContainer}>
                                <View style={styles.modalBreakingBadge}>
                                    <ThemedText style={styles.modalBreakingText}>BREAKING NEWS</ThemedText>
                                </View>
                                <ThemedText style={styles.modalPostedTime}>
                                    {formatPostedTime(selectedNews?.createdAt)}
                                </ThemedText>
                            </View>

                            {/* News Content */}
                            <View style={styles.modalContentContainer}>
                                <ThemedText style={styles.modalNewsContent}>
                                    {selectedNews?.content}
                                </ThemedText>
                            </View>

                            {/* Author Info */}
                            <View style={styles.modalAuthorSection}>
                                <Image source={{ uri: selectedNews?.authorImage }} style={styles.modalAuthorImage} />
                                <View style={styles.modalAuthorInfo}>
                                    <ThemedText style={styles.modalAuthorName}>{selectedNews?.author}</ThemedText>
                                    <ThemedText style={styles.modalAuthorRole}>Live News Reporter</ThemedText>
                                </View>
                            </View>

                            {/* Action Buttons */}
                            {/* <View style={styles.modalActionContainer}>
                                <TouchableOpacity 
                                    style={[styles.modalActionButton, liked && styles.modalActionButtonActive]} 
                                    onPress={toggleLike}
                                >
                                    <Ionicons 
                                        name={liked ? "heart" : "heart-outline"} 
                                        size={20} 
                                        color={liked ? "#FF3B30" : "#666"} 
                                    />
                                    <ThemedText style={[styles.modalActionText, liked && { color: '#FF3B30' }]}>
                                        {likeCount}
                                    </ThemedText>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.modalActionButton}>
                                    <Ionicons name="chatbubble-outline" size={20} color="#666" />
                                    <ThemedText style={styles.modalActionText}>Comment</ThemedText>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.modalActionButton} onPress={handleShare}>
                                    <Ionicons name="share-social-outline" size={20} color="#666" />
                                    <ThemedText style={styles.modalActionText}>Share</ThemedText>
                                </TouchableOpacity>
                            </View> */}

                            {/* Info Cards */}
                            <View style={styles.modalInfoSection}>
                                <View style={styles.modalInfoCard}>
                                    <Ionicons name="time-outline" size={18} color="#4B59B3" />
                                    <View style={styles.modalInfoContent}>
                                        <ThemedText style={styles.modalInfoTitle}>Published</ThemedText>
                                        <ThemedText style={styles.modalInfoText}>
                                            {selectedNews && new Date(selectedNews.postedAt).toLocaleString()}
                                        </ThemedText>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
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
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '400',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
    },
    headerLiveIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF3B30',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    headerLiveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FFFFFF',
    },
    headerLiveText: {
        fontSize: 10,
        fontFamily: 'CoFoRaffineBold',
        color: '#FFFFFF',
    },
    refreshButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    liveTimeBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF0F0',
        paddingHorizontal: 16,
        paddingVertical: 10,
        gap: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#FFE0E0',
    },
    liveTimeText: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#FF3B30',
        flex: 1,
    },
    liveNowBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF3B30',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    liveNowDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FFFFFF',
    },
    liveNowText: {
        fontSize: 10,
        fontFamily: 'CoFoRaffineBold',
        color: '#FFFFFF',
    },
    newsList: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    newsItem: {
        flexDirection: 'row',
        paddingVertical: 16,
    },
    firstNewsItem: {
        backgroundColor: '#FFF9F9',
        borderRadius: 12,
        paddingHorizontal: 12,
        marginHorizontal: -12,
    },
    timeColumn: {
        width: 60,
        marginRight: 12,
    },
    timeText: {
        fontSize: 16,
        fontFamily: 'CoFoRaffineBold',
        color: '#4B59B3',
        marginBottom: 4,
    },
    breakingBadge: {
        backgroundColor: '#FF3B30',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
    breakingText: {
        fontSize: 8,
        fontFamily: 'CoFoRaffineBold',
        color: '#FFFFFF',
    },
    contentColumn: {
        flex: 1,
    },
    newsTitle: {
        fontSize: 14,
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        lineHeight: 20,
        marginBottom: 6,
    },
    newsDescription: {
        fontSize: 13,
        fontFamily: 'tenez',
        color: '#666',
        lineHeight: 18,
    },
    liveIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 6,
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FF3B30',
    },
    liveText: {
        fontSize: 11,
        fontFamily: 'tenez',
        color: '#FF3B30',
    },
    separator: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 8,
    },
    loaderFooter: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    // Modal Styles
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    modalCloseButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalLiveIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF3B30',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    modalLiveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FFFFFF',
    },
    modalLiveText: {
        fontSize: 10,
        fontFamily: 'CoFoRaffineBold',
        color: '#FFFFFF',
    },
    modalHeaderActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    modalHeaderAction: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalScrollContent: {
        paddingBottom: 30,
    },
    modalLiveTimeBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF0F0',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 8,
    },
    modalLiveTimeText: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#FF3B30',
        flex: 1,
    },
    modalLiveNowBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF3B30',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    modalLiveNowDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FFFFFF',
    },
    modalLiveNowText: {
        fontSize: 10,
        fontFamily: 'CoFoRaffineBold',
        color: '#FFFFFF',
    },
    modalBreakingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    modalBreakingBadge: {
        backgroundColor: '#FF3B30',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
    },
    modalBreakingText: {
        fontSize: 12,
        fontFamily: 'CoFoRaffineBold',
        color: '#FFFFFF',
    },
    modalPostedTime: {
        fontSize: 12,
        fontFamily: 'tenez',
        color: '#999',
    },
    modalContentContainer: {
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    modalNewsContent: {
        fontSize: 16,
        fontFamily: 'tenez',
        color: '#333',
        lineHeight: 24,
    },
    modalAuthorSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        gap: 12,
    },
    modalAuthorImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    modalAuthorInfo: {
        flex: 1,
    },
    modalAuthorName: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        marginBottom: 4,
    },
    modalAuthorRole: {
        fontSize: 12,
        fontFamily: 'tenez',
        color: '#999',
    },
    modalActionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    modalActionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    modalActionButtonActive: {
        backgroundColor: '#FFF0F0',
    },
    modalActionText: {
        fontSize: 13,
        fontFamily: 'CoFoRaffineMedium',
        color: '#666',
    },
    modalInfoSection: {
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    modalInfoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#F8F9FA',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    modalInfoContent: {
        flex: 1,
    },
    modalInfoTitle: {
        fontSize: 12,
        fontFamily: 'tenez',
        color: '#999',
        marginBottom: 2,
    },
    modalInfoText: {
        fontSize: 14,
        fontFamily: 'CoFoRaffineMedium',
        color: '#333',
    },
});