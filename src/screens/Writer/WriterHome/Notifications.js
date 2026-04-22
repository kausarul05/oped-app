import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import notificationService from '../../../services/notificationService';

export default function Notifications({ navigation }) {
    const { colors } = useTheme();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        total: 0,
        totalPages: 1
    });

    // Fetch notifications from API
    const fetchNotifications = async (page = 1, isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else if (page === 1) {
                setLoading(true);
            }

            const result = await notificationService.getNotifications(page, 10);

            console.log("result", result)

            if (result.success) {
                const formattedNotifications = result.data.map(notification => ({
                    id: notification._id,
                    type: notification.type || 'general',
                    title: notification.title,
                    description: notification.body,
                    time: formatTimeAgo(notification.createdAt),
                    createdAt: notification.createdAt,
                    isRead: notification.isRead || false,
                    metadata: notification.metadata,
                }));

                if (isRefresh || page === 1) {
                    setNotifications(formattedNotifications);
                } else {
                    setNotifications(prev => [...prev, ...formattedNotifications]);
                }

                setUnreadCount(result.unreadCount || 0);
                
                if (result.pagination) {
                    setPagination(result.pagination);
                }
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            Alert.alert('Error', 'Failed to load notifications');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        return date.toLocaleDateString();
    };

    const onRefresh = () => {
        fetchNotifications(1, true);
    };

    const loadMore = () => {
        if (pagination.page < pagination.totalPages && !loading && !refreshing) {
            fetchNotifications(pagination.page + 1);
        }
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            const result = await notificationService.markAsRead(notificationId);
            if (result.success) {
                setNotifications(prev => prev.map(notif => 
                    notif.id === notificationId ? { ...notif, isRead: true } : notif
                ));
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        Alert.alert(
            'Mark All as Read',
            'Are you sure you want to mark all notifications as read?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Mark All',
                    onPress: async () => {
                        try {
                            const result = await notificationService.markAllAsRead();
                            if (result.success) {
                                setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
                                setUnreadCount(0);
                                Alert.alert('Success', 'All notifications marked as read');
                            } else {
                                Alert.alert('Error', result.error || 'Failed to mark all as read');
                            }
                        } catch (error) {
                            console.error('Error marking all as read:', error);
                            Alert.alert('Error', 'Failed to mark all as read');
                        }
                    }
                }
            ]
        );
    };

    const handleDeleteNotification = async (notificationId) => {
        Alert.alert(
            'Delete Notification',
            'Are you sure you want to delete this notification?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const result = await notificationService.deleteNotification(notificationId);
                            if (result.success) {
                                const deletedNotif = notifications.find(n => n.id === notificationId);
                                setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
                                if (deletedNotif && !deletedNotif.isRead) {
                                    setUnreadCount(prev => Math.max(0, prev - 1));
                                }
                                Alert.alert('Success', 'Notification deleted');
                            } else {
                                Alert.alert('Error', result.error || 'Failed to delete notification');
                            }
                        } catch (error) {
                            console.error('Error deleting notification:', error);
                            Alert.alert('Error', 'Failed to delete notification');
                        }
                    }
                }
            ]
        );
    };

    const handleNotificationPress = async (item) => {
        if (!item.isRead) {
            await handleMarkAsRead(item.id);
        }
        
        // Navigate based on notification type and metadata
        if (item.metadata) {
            const { contentType, contentId } = item.metadata;
            if (contentType === 'story' && contentId) {
                navigation.navigate('StoryDetail', { storyId: contentId });
            } else if (contentType === 'podcast' && contentId) {
                navigation.navigate('PodcastDetail', { podcastId: contentId });
            } else if (item.metadata.authorId) {
                navigation.navigate('AuthorProfile', { authorId: item.metadata.authorId });
            }
        }
    };

    const getIconForType = (type) => {
        switch(type) {
            case 'story':
            case 'article':
                return 'document-text-outline';
            case 'comment':
                return 'chatbubble-outline';
            case 'subscription':
                return 'alert-circle-outline';
            case 'follow':
                return 'person-add-outline';
            case 'like':
                return 'heart-outline';
            default:
                return 'notifications-outline';
        }
    };

    const renderNotificationItem = ({ item }) => (
        <TouchableOpacity 
            style={[styles.notificationItem, !item.isRead && styles.unreadNotification]}
            onPress={() => handleNotificationPress(item)}
            onLongPress={() => handleDeleteNotification(item.id)}
            activeOpacity={0.7}
        >
            <View style={styles.iconContainer}>
                <Ionicons name={getIconForType(item.type)} size={24} color="#4B59B3" />
            </View>
            
            <View style={styles.notificationContent}>
                <ThemedText style={styles.notificationTitle}>{item.title}</ThemedText>
                {item.description ? (
                    <ThemedText style={styles.notificationDescription} numberOfLines={2}>
                        {item.description}
                    </ThemedText>
                ) : null}
                <ThemedText style={styles.notificationTime}>{item.time}</ThemedText>
            </View>

            {!item.isRead && <View style={styles.newDot} />}
            
            <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleDeleteNotification(item.id)}
            >
                <Ionicons name="close" size={18} color="#999" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const renderEmptyComponent = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="notifications-outline" size={64} color="#ccc" />
            <ThemedText style={styles.emptyText}>No notifications</ThemedText>
            <ThemedText style={styles.emptySubText}>
                When you receive notifications, they will appear here
            </ThemedText>
        </View>
    );

    useEffect(() => {
        fetchNotifications();
    }, []);

    if (loading && notifications.length === 0) {
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
                    <ThemedText style={styles.headerTitle}>Notifications</ThemedText>
                    {unreadCount > 0 && (
                        <TouchableOpacity 
                            style={styles.markAllButton}
                            onPress={handleMarkAllAsRead}
                        >
                            <Ionicons name="checkmark-done-circle-outline" size={24} color="#4B59B3" />
                        </TouchableOpacity>
                    )}
                    {unreadCount === 0 && <View style={{ width: 40 }} />}
                </View>

                {/* Notifications List */}
                <FlatList
                    data={notifications}
                    renderItem={renderNotificationItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#4B59B3']}
                        />
                    }
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.3}
                    ListFooterComponent={
                        pagination.page < pagination.totalPages && (
                            <View style={styles.loaderMore}>
                                <ActivityIndicator size="small" color="#4B59B3" />
                            </View>
                        )
                    }
                    ListEmptyComponent={renderEmptyComponent}
                />
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
        letterSpacing: 1,
    },
    markAllButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 20,
    },
    separator: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 8,
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        position: 'relative',
    },
    unreadNotification: {
        backgroundColor: '#F8F9FF',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F0F3FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    notificationContent: {
        flex: 1,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        marginBottom: 2,
        letterSpacing: 1,
    },
    notificationDescription: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#666',
        lineHeight: 18,
        marginBottom: 4,
        letterSpacing: 1,
    },
    notificationTime: {
        fontSize: 12,
        fontFamily: 'tenez',
        color: '#999',
        letterSpacing: 1,
    },
    newDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4B59B3',
        position: 'absolute',
        right: 40,
        top: 20,
    },
    deleteButton: {
        padding: 8,
        marginLeft: 4,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
    },
    emptyText: {
        fontSize: 18,
        fontFamily: 'CoFoRaffineBold',
        color: '#999',
        marginTop: 16,
    },
    emptySubText: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#ccc',
        marginTop: 8,
        textAlign: 'center',
    },
    loaderMore: {
        paddingVertical: 16,
        alignItems: 'center',
    },
});