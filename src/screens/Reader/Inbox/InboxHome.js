import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function InboxHome({ navigation }) {
    const { colors } = useTheme();
    const [activeTab, setActiveTab] = useState('messages');

    const messages = [
        {
            id: '1',
            name: 'Sarah Johnson',
            avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
            lastMessage: 'Thanks for sharing the article! Really enjoyed it.',
            time: '5 min ago',
            unread: 2,
            online: true,
        },
        {
            id: '2',
            name: 'Michael Chen',
            avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
            lastMessage: 'When are we meeting for the podcast recording?',
            time: '1 hour ago',
            unread: 0,
            online: false,
        },
        {
            id: '3',
            name: 'Priya Patel',
            avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
            lastMessage: 'Did you see the new episode? Let me know your thoughts.',
            time: '3 hours ago',
            unread: 1,
            online: true,
        },
        {
            id: '4',
            name: 'David Williams',
            avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
            lastMessage: 'The live news update was very informative. Thanks!',
            time: '1 day ago',
            unread: 0,
            online: false,
        },
        {
            id: '5',
            name: 'Emma Thompson',
            avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
            lastMessage: 'Looking forward to our collaboration next week!',
            time: '2 days ago',
            unread: 0,
            online: false,
        },
    ];

    const notifications = [
        {
            id: '1',
            type: 'like',
            user: 'Rahul Sharma',
            userAvatar: 'https://randomuser.me/api/portraits/men/2.jpg',
            content: 'liked your comment on "The Future of Digital Media"',
            time: '10 min ago',
            isNew: true,
        },
        {
            id: '2',
            type: 'comment',
            user: 'Neha Singh',
            userAvatar: 'https://randomuser.me/api/portraits/women/5.jpg',
            content: 'replied to your comment',
            time: '30 min ago',
            isNew: true,
        },
        {
            id: '3',
            type: 'follow',
            user: 'Amit Kumar',
            userAvatar: 'https://randomuser.me/api/portraits/men/4.jpg',
            content: 'started following you',
            time: '2 hours ago',
            isNew: false,
        },
        {
            id: '4',
            type: 'mention',
            user: 'Vikram Mehta',
            userAvatar: 'https://randomuser.me/api/portraits/men/6.jpg',
            content: 'mentioned you in a comment',
            time: '5 hours ago',
            isNew: false,
        },
        {
            id: '5',
            type: 'share',
            user: 'Katy Waldman',
            userAvatar: 'https://randomuser.me/api/portraits/women/1.jpg',
            content: 'shared your article',
            time: '1 day ago',
            isNew: false,
        },
    ];

    const renderMessageItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.messageItem}
            onPress={() => navigation.navigate('ChatDetail', { user: item })}
        >
            <View style={styles.avatarContainer}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                {item.online && <View style={styles.onlineDot} />}
            </View>
            <View style={styles.messageContent}>
                <View style={styles.messageHeader}>
                    <ThemedText style={styles.messageName}>{item.name}</ThemedText>
                    <ThemedText style={styles.messageTime}>{item.time}</ThemedText>
                </View>
                <ThemedText style={styles.messagePreview} numberOfLines={1}>
                    {item.lastMessage}
                </ThemedText>
            </View>
            {item.unread > 0 && (
                <View style={styles.unreadBadge}>
                    <ThemedText style={styles.unreadText}>{item.unread}</ThemedText>
                </View>
            )}
        </TouchableOpacity>
    );

    const renderNotificationItem = ({ item }) => (
        <TouchableOpacity style={[styles.notificationItem, item.isNew && styles.newNotification]}>
            <Image source={{ uri: item.userAvatar }} style={styles.notificationAvatar} />
            <View style={styles.notificationContent}>
                <ThemedText style={styles.notificationText}>
                    <ThemedText style={styles.notificationUser}>{item.user}</ThemedText> {item.content}
                </ThemedText>
                <ThemedText style={styles.notificationTime}>{item.time}</ThemedText>
            </View>
            {item.isNew && <View style={styles.newDot} />}
        </TouchableOpacity>
    );

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <ThemedText style={styles.headerTitle}>Inbox</ThemedText>
                    <TouchableOpacity style={styles.composeButton}>
                        <Ionicons name="create-outline" size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                {/* Tabs */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'messages' && styles.activeTab]}
                        onPress={() => setActiveTab('messages')}
                    >
                        <Ionicons 
                            name="chatbubbles-outline" 
                            size={20} 
                            color={activeTab === 'messages' ? '#4B59B3' : '#999'} 
                        />
                        <ThemedText style={[styles.tabText, activeTab === 'messages' && styles.activeTabText]}>
                            Messages
                        </ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'notifications' && styles.activeTab]}
                        onPress={() => setActiveTab('notifications')}
                    >
                        <Ionicons 
                            name="notifications-outline" 
                            size={20} 
                            color={activeTab === 'notifications' ? '#4B59B3' : '#999'} 
                        />
                        <ThemedText style={[styles.tabText, activeTab === 'notifications' && styles.activeTabText]}>
                            Notifications
                        </ThemedText>
                    </TouchableOpacity>
                </View>

                {/* List */}
                <FlatList
                    data={activeTab === 'messages' ? messages : notifications}
                    renderItem={activeTab === 'messages' ? renderMessageItem : renderNotificationItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '400',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
    },
    composeButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        gap: 24,
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingBottom: 8,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#4B59B3',
    },
    tabText: {
        fontSize: 14,
        fontFamily: 'CoFoRaffineMedium',
        color: '#999',
    },
    activeTabText: {
        color: '#4B59B3',
        fontFamily: 'CoFoRaffineBold',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    messageItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 12,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    onlineDot: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#34C759',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    messageContent: {
        flex: 1,
    },
    messageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    messageName: {
        fontSize: 15,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
    },
    messageTime: {
        fontSize: 11,
        fontFamily: 'tenez',
        color: '#999',
    },
    messagePreview: {
        fontSize: 13,
        fontFamily: 'tenez',
        color: '#666',
    },
    unreadBadge: {
        backgroundColor: '#4B59B3',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    unreadText: {
        fontSize: 10,
        fontFamily: 'CoFoRaffineBold',
        color: '#FFFFFF',
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    newNotification: {
        backgroundColor: '#F0F3FF',
    },
    notificationAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 12,
    },
    notificationContent: {
        flex: 1,
    },
    notificationText: {
        fontSize: 13,
        fontFamily: 'tenez',
        color: '#333',
        lineHeight: 18,
        marginBottom: 4,
    },
    notificationUser: {
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
    },
    notificationTime: {
        fontSize: 11,
        fontFamily: 'tenez',
        color: '#999',
    },
    newDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4B59B3',
        marginLeft: 8,
    },
});