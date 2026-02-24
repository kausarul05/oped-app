import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Newsletter({ navigation }) {
    const { colors } = useTheme();

    // Newsletter data
    const newsletters = [
        {
            id: '1',
            name: 'Eric Lach',
            avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
            isLinked: true,
            hasNotification: true,
            hasMessage: false,
            notificationCount: 3,
        },
        {
            id: '2',
            name: 'Eric Lach',
            avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
            isLinked: true,
            hasNotification: false,
            hasMessage: true,
            messageCount: 1,
        },
        {
            id: '3',
            name: 'Eric Lach',
            avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
            isLinked: true,
            hasNotification: true,
            hasMessage: true,
            notificationCount: 5,
            messageCount: 2,
        },
        {
            id: '4',
            name: 'Eric Lach',
            avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
            isLinked: true,
            hasNotification: false,
            hasMessage: false,
        },
        {
            id: '5',
            name: 'Eric Lach',
            avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
            isLinked: true,
            hasNotification: true,
            hasMessage: false,
            notificationCount: 2,
        },
        {
            id: '6',
            name: 'Eric Lach',
            avatar: 'https://randomuser.me/api/portraits/men/7.jpg',
            isLinked: true,
            hasNotification: false,
            hasMessage: true,
            messageCount: 1,
        },
        {
            id: '7',
            name: 'Eric Lach',
            avatar: 'https://randomuser.me/api/portraits/men/8.jpg',
            isLinked: true,
            hasNotification: true,
            hasMessage: true,
            notificationCount: 4,
            messageCount: 3,
        },
        {
            id: '8',
            name: 'Eric Lach',
            avatar: 'https://randomuser.me/api/portraits/men/9.jpg',
            isLinked: true,
            hasNotification: false,
            hasMessage: false,
        },
        {
            id: '9',
            name: 'Eric Lach',
            avatar: 'https://randomuser.me/api/portraits/men/10.jpg',
            isLinked: true,
            hasNotification: true,
            hasMessage: false,
            notificationCount: 1,
        },
        {
            id: '10',
            name: 'Eric Lach',
            avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
            isLinked: true,
            hasNotification: false,
            hasMessage: true,
            messageCount: 2,
        },
        {
            id: '11',
            name: 'Eric Lach',
            avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
            isLinked: true,
            hasNotification: true,
            hasMessage: true,
            notificationCount: 3,
            messageCount: 1,
        },
        {
            id: '12',
            name: 'Eric Lach',
            avatar: 'https://randomuser.me/api/portraits/men/13.jpg',
            isLinked: true,
            hasNotification: false,
            hasMessage: false,
        },
    ];

    const renderNewsletterItem = ({ item }) => (
        <TouchableOpacity
            style={styles.newsletterItem}
            onPress={() => console.log('Pressed:', item.name)}
        >
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.newsletterContent}>
                <View style={styles.nameContainer}>
                    <ThemedText style={styles.newsletterName}>{item.name}</ThemedText>
                    {/* {item.isLinked && (
                        <Ionicons name="link-outline" size={16} color="#4B59B3" />
                    )} */}
                </View>

                <View style={styles.iconContainer}>
                    {/* {item.hasNotification && ( */}
                    <View style={styles.iconWithBadge}>
                        {/* <Ionicons name="notifications-outline" size={18} color="#666" /> */}
                        {/* <View style={styles.badge}>
                                <ThemedText style={styles.badgeText}>{item.notificationCount || 1}</ThemedText>
                            </View> */}
                        <Ionicons name="notifications-outline" size={24} color="#000000" />
                    </View>
                    {/* )} */}

                    {/* {item.hasMessage && ( */}
                    <View style={styles.iconWithBadge}>
                        {/* <Ionicons name="chatbubble-outline" size={18} color="#666" /> */}
                        <MaterialCommunityIcons name="message-text-outline" size={24} color="#000000" />
                        {/* <View style={styles.badge}>
                                <ThemedText style={styles.badgeText}>{item.messageCount || 1}</ThemedText>
                            </View> */}
                    </View>
                    {/* )} */}
                </View>
            </View>
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
                    <ThemedText style={styles.headerTitle}>Your Newsletters</ThemedText>
                    <View style={{ width: 40 }} />
                </View>

                {/* Newsletter List - Single Column */}
                <FlatList
                    data={newsletters}
                    renderItem={renderNewsletterItem}
                    keyExtractor={(item) => item.id}
                    numColumns={1}
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
    backButton: {
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
    listContent: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 12,
    },
    newsletterItem: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F0F0F0',
        elevation: 1,
        marginBottom: 2
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.05,
        // shadowRadius: 2,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 16,
        borderWidth: 2,
        borderColor: '#4B59B3',
    },
    newsletterContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    newsletterName: {
        fontSize: 18,
        fontWeight: '500',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconWithBadge: {
        position: 'relative',
        padding: 4,
    },
    badge: {
        position: 'absolute',
        top: -2,
        right: -6,
        backgroundColor: '#FF3B30',
        borderRadius: 10,
        minWidth: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        fontSize: 10,
        fontFamily: 'CoFoRaffineBold',
        color: '#FFFFFF',
    },
});