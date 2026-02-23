import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function ReaderQuickLink() {
    const { colors } = useTheme();
    const navigation = useNavigation();

    const quickLinks = [
        {
            id: 1,
            title: 'LIVE',
            subtitle: 'Live News',
            description: 'Latest developments.',
            icon: 'radio-outline',
            color: '#FF3B30',
        },
        {
            id: 2,
            title: 'Top Stories',
            subtitle: 'Today\'s highlights.',
            description: '',
            icon: 'newspaper-outline',
            color: '#4B59B3',
        },
        {
            id: 3,
            title: 'Bricflog',
            subtitle: 'Quick updates.',
            description: '',
            icon: 'flash-outline',
            color: '#FF9500',
        },
        {
            id: 4,
            title: 'Discover',
            subtitle: 'Stories for you.',
            description: '',
            icon: 'compass-outline',
            color: '#34C759',
        },
    ];

    const handlePress = (item) => {
        if (item.title === 'Discover') {
            navigation.navigate('DiscoverQuickLink');
        } else if (item.title === 'LIVE') {
            navigation.navigate('LiveNews');
        } else if (item.title === "Top Stories") {
            navigation.navigate('CategoryStories', { category: 'Top Stories' });
        } else {
            console.log('Pressed:', item.title);
            // Handle other quick links
        }
    };

    return (
        <ThemedView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <ThemedText style={styles.headerTitle}>Quick Links</ThemedText>
                {/* <TouchableOpacity onPress={() => console.log('See all')}>
                    <ThemedText style={[styles.seeAllText, { color: '#4B59B3' }]}>
                        See All
                    </ThemedText>
                </TouchableOpacity> */}
            </View>

            {/* Quick Links Grid */}
            <View style={styles.gridContainer}>
                {quickLinks.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.linkCard}
                        onPress={() => handlePress(item)}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
                            <Ionicons name={item.icon} size={24} color={item.color} />
                        </View>
                        <View style={styles.textContainer}>
                            <ThemedText style={styles.linkTitle}>{item.title}</ThemedText>
                            <ThemedText style={styles.linkSubtitle} numberOfLines={1}>
                                {item.subtitle}
                            </ThemedText>
                            {item.description ? (
                                <ThemedText style={styles.linkDescription} numberOfLines={1}>
                                    {item.description}
                                </ThemedText>
                            ) : null}
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingHorizontal: 16,
        paddingVertical: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '400',
        fontFamily: 'CoFoRaffineBold',
        letterSpacing: 0.5,
        color: '#000',
    },
    seeAllText: {
        fontSize: 14,
        fontWeight: '500',
        fontFamily: 'CoFoRaffineMedium',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 14,
    },
    linkCard: {
        width: '47%', // Approximately half width with gap
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    linkTitle: {
        fontSize: 16,
        fontWeight: '400',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        marginBottom: 2,
    },
    linkSubtitle: {
        fontSize: 12,
        fontWeight: '400',
        fontFamily: 'tenez',
        color: '#666',
        marginBottom: 2,
    },
    linkDescription: {
        fontSize: 11,
        fontWeight: '400',
        fontFamily: 'tenez',
        color: '#999',
    },
});