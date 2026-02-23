import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import {
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PodcastHome({ navigation }) {
    const { colors } = useTheme();

    const featuredPodcasts = [
        {
            id: '1',
            title: 'The Future of AI',
            host: 'John Smith',
            image: 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            duration: '45 min',
            episodes: 12,
        },
        {
            id: '2',
            title: 'Tech Talks Daily',
            host: 'Sarah Johnson',
            image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            duration: '30 min',
            episodes: 8,
        },
        {
            id: '3',
            title: 'Business Insights',
            host: 'Michael Chen',
            image: 'https://images.unsplash.com/photo-1590602847861-f3579e41b79e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            duration: '60 min',
            episodes: 24,
        },
    ];

    const categories = [
        { id: '1', name: 'Technology', icon: 'hardware-chip-outline', color: '#4B59B3' },
        { id: '2', name: 'Business', icon: 'briefcase-outline', color: '#34C759' },
        { id: '3', name: 'Comedy', icon: 'happy-outline', color: '#FF9500' },
        { id: '4', name: 'Education', icon: 'school-outline', color: '#FF3B30' },
        { id: '5', name: 'News', icon: 'newspaper-outline', color: '#6C5CE7' },
    ];

    const renderFeaturedItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.featuredCard}
            onPress={() => navigation.navigate('PodcastDetail', { podcast: item })}
        >
            <Image source={{ uri: item.image }} style={styles.featuredImage} />
            <View style={styles.featuredOverlay}>
                <ThemedText style={styles.featuredTitle}>{item.title}</ThemedText>
                <ThemedText style={styles.featuredHost}>{item.host}</ThemedText>
                <View style={styles.featuredMeta}>
                    <Ionicons name="time-outline" size={12} color="#FFF" />
                    <ThemedText style={styles.featuredMetaText}>{item.duration}</ThemedText>
                    <Ionicons name="albums-outline" size={12} color="#FFF" style={{ marginLeft: 8 }} />
                    <ThemedText style={styles.featuredMetaText}>{item.episodes} episodes</ThemedText>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <ThemedText style={styles.headerTitle}>Podcasts</ThemedText>
                    <TouchableOpacity style={styles.searchButton}>
                        <Ionicons name="search-outline" size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Categories */}
                    <View style={styles.categoriesContainer}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {categories.map((category) => (
                                <TouchableOpacity key={category.id} style={styles.categoryChip}>
                                    <Ionicons name={category.icon} size={18} color={category.color} />
                                    <ThemedText style={styles.categoryText}>{category.name}</ThemedText>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Featured Section */}
                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Featured Podcasts</ThemedText>
                        <FlatList
                            data={featuredPodcasts}
                            renderItem={renderFeaturedItem}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.featuredList}
                        />
                    </View>

                    {/* Popular Podcasts */}
                    <View style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Popular This Week</ThemedText>
                        {featuredPodcasts.map((podcast) => (
                            <TouchableOpacity key={podcast.id} style={styles.popularItem}>
                                <Image source={{ uri: podcast.image }} style={styles.popularImage} />
                                <View style={styles.popularContent}>
                                    <ThemedText style={styles.popularTitle}>{podcast.title}</ThemedText>
                                    <ThemedText style={styles.popularHost}>{podcast.host}</ThemedText>
                                    <View style={styles.popularMeta}>
                                        <Ionicons name="time-outline" size={12} color="#999" />
                                        <ThemedText style={styles.popularMetaText}>{podcast.duration}</ThemedText>
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.playButton}>
                                    <Ionicons name="play-circle" size={40} color="#4B59B3" />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
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
    searchButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoriesContainer: {
        paddingVertical: 12,
        paddingLeft: 16,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
        gap: 6,
    },
    categoryText: {
        fontSize: 13,
        fontFamily: 'CoFoRaffineMedium',
        color: '#666',
    },
    section: {
        paddingVertical: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '400',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    featuredList: {
        paddingLeft: 16,
        paddingRight: 8,
        gap: 12,
    },
    featuredCard: {
        width: 280,
        height: 160,
        borderRadius: 12,
        overflow: 'hidden',
        marginRight: 12,
    },
    featuredImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    featuredOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 12,
    },
    featuredTitle: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#FFF',
        marginBottom: 4,
    },
    featuredHost: {
        fontSize: 12,
        fontFamily: 'tenez',
        color: '#FFF',
        opacity: 0.9,
        marginBottom: 6,
    },
    featuredMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    featuredMetaText: {
        fontSize: 10,
        fontFamily: 'tenez',
        color: '#FFF',
        marginLeft: 4,
    },
    popularItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    popularImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    popularContent: {
        flex: 1,
    },
    popularTitle: {
        fontSize: 15,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        marginBottom: 4,
    },
    popularHost: {
        fontSize: 12,
        fontFamily: 'tenez',
        color: '#999',
        marginBottom: 4,
    },
    popularMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    popularMetaText: {
        fontSize: 11,
        fontFamily: 'tenez',
        color: '#999',
    },
    playButton: {
        marginLeft: 8,
    },
});