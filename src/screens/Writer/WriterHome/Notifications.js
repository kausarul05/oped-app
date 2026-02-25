import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    FlatList,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Notifications({ navigation }) {
    const { colors } = useTheme();

    // Notifications data
    const notifications = [
        {
            id: '1',
            type: 'article',
            title: 'Article Published',
            description: 'The Future of Digital Media™ by Jane Doe is now live.',
            time: '5h ago',
            isNew: true,
        },
        {
            id: '2',
            type: 'comment',
            title: 'John Smith commented on your article "Tech Trends 2026".',
            description: '',
            time: '5h ago',
            isNew: true,
        },
        {
            id: '3',
            type: 'subscription',
            title: 'Subscription Reminder',
            description: 'Your premium subscription expires in 3 days. Renew now to continue access.',
            time: '6 days ago',
            isNew: false,
        },
        {
            id: '4',
            type: 'article',
            title: 'Article Published',
            description: 'The Future of Digital Media™ by Jane Doe is now live.',
            time: '6 days ago',
            isNew: false,
        },
        {
            id: '5',
            type: 'article',
            title: 'Article Published',
            description: 'The Future of Digital Media™ by Jane Doe is now live.',
            time: '6 days ago',
            isNew: false,
        },
        {
            id: '6',
            type: 'article',
            title: 'Article Published',
            description: 'The Future of Digital Media™ by Jane Doe is now live.',
            time: '6 days ago',
            isNew: false,
        },
        {
            id: '7',
            type: 'article',
            title: 'Article Published',
            description: 'The Future of Digital Media™ by Jane Doe is now live.',
            time: '6 days ago',
            isNew: false,
        },
    ];

    const getIconForType = (type) => {
        switch(type) {
            case 'article':
                return 'document-text-outline';
            case 'comment':
                return 'chatbubble-outline';
            case 'subscription':
                return 'alert-circle-outline';
            default:
                return 'notifications-outline';
        }
    };

    const renderNotificationItem = ({ item }) => (
        <TouchableOpacity style={[styles.notificationItem, item.isNew && styles.newNotification]}>
            <View style={styles.iconContainer}>
                <Ionicons name={getIconForType(item.type)} size={24} color="#4B59B3" />
            </View>
            
            <View style={styles.notificationContent}>
                {item.type === 'comment' ? (
                    <ThemedText style={styles.commentText}>{item.title}</ThemedText>
                ) : (
                    <>
                        <ThemedText style={styles.notificationTitle}>{item.title}</ThemedText>
                        {item.description ? (
                            <ThemedText style={styles.notificationDescription}>{item.description}</ThemedText>
                        ) : null}
                    </>
                )}
                
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
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <ThemedText style={styles.headerTitle}>Notifications</ThemedText>
                    {/* <TouchableOpacity style={styles.settingsButton}>
                        <Ionicons name="settings-outline" size={24} color="#000" />
                    </TouchableOpacity> */}
                    <View/>
                </View>

                {/* Notifications List */}
                <FlatList
                    data={notifications}
                    renderItem={renderNotificationItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    settingsButton: {
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
    newNotification: {
        // No background color, just the dot indicator
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
    commentText: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#666',
        lineHeight: 18,
        marginBottom: 4,
        
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
        right: 0,
        top: 20,
    },
});