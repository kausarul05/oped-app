import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32; // Full width minus padding

export default function PodcastHome({ navigation }) {
    const { colors } = useTheme();
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef(null);

    // Expert opinions podcasts (horizontal scroll) - Full width cards
    const expertOpinions = [
        {
            id: '1',
            title: 'Hrant Dink anıldı, Avrupa\'nın planı | 20 Ocak 2026',
            category: 'Expert opinions',
            image: 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        },
        {
            id: '2',
            title: 'İrandan uyan, İhlakçıcı tahlihci | 12 Ocak 2026',
            category: 'Expert opinions',
            image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        },
        {
            id: '3',
            title: 'Küresel ekonomide yeni dengeler | 15 Ocak 2026',
            category: 'Expert opinions',
            image: 'https://images.unsplash.com/photo-1590602847861-f3579e41b79e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        },
        {
            id: '4',
            title: 'Teknoloji ve insanlık ilişkisi | 18 Ocak 2026',
            category: 'Expert opinions',
            image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        },
    ];

    // Top episodes this week
    const topEpisodes = [
        {
            id: '1',
            title: 'İrandan uyan, İhlakçıcı tahlihci',
            date: '12 Ocak 2026',
            duration: '6 min',
            fullDate: '19 January 2026',
            category: 'Expert opinions',
            image: 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        },
        {
            id: '2',
            title: 'Hrant Dink anıldı, Avrupa\'nın planı',
            date: '20 Ocak 2026',
            duration: '8 min',
            fullDate: '20 January 2026',
            category: 'Expert opinions',
            image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        },
        {
            id: '3',
            title: 'Küresel ekonomide yeni dengeler',
            date: '15 Ocak 2026',
            duration: '7 min',
            fullDate: '15 January 2026',
            category: 'Expert opinions',
            image: 'https://images.unsplash.com/photo-1590602847861-f3579e41b79e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        },
        {
            id: '4',
            title: 'Teknoloji ve insanlık ilişkisi',
            date: '18 Ocak 2026',
            duration: '5 min',
            fullDate: '18 January 2026',
            category: 'Expert opinions',
            image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        },
        {
            id: '5',
            title: 'Avrupa Birliği ve Türkiye',
            date: '10 Ocak 2026',
            duration: '9 min',
            fullDate: '10 January 2026',
            category: 'Expert opinions',
            image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        },
    ];

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setActiveIndex(viewableItems[0].index);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50
    }).current;

    const renderExpertOpinionItem = ({ item }) => (
        <TouchableOpacity 
            style={[styles.expertCard, { width: CARD_WIDTH }]}
            onPress={() => navigation.navigate('PodcastDetail', { podcast: item })}
        >
            <Image source={{ uri: item.image }} style={styles.expertImage} />
            <View style={styles.expertContent}>
                <View style={styles.expertTextContent}>
                    {/* <ThemedText style={styles.expertCategory}>{item.category}</ThemedText> */}
                    <ThemedText style={styles.expertTitle}>{item.title}</ThemedText>
                </View>
                <View style={styles.expertListenContainer}>
                    <Ionicons name="play-circle" size={26} color="#fff" />
                    <ThemedText style={styles.expertListenText}>Listen</ThemedText>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderTopEpisodeItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.episodeCard}
            onPress={() => navigation.navigate('PodcastDetail', { podcast: item })}
        >
            <Image source={{ uri: item.image }} style={styles.episodeImage} />
            <View style={styles.episodeContent}>
                <View style={styles.episodeHeader}>
                    <ThemedText style={styles.episodeCategory}>{item.category}</ThemedText>
                    <ThemedText style={styles.episodeTitle}>{item.title}</ThemedText>
                </View>
                <View style={styles.episodeFooter}>
                    <View style={styles.episodeMeta}>
                        <Ionicons name="time-outline" size={14} color="#999" />
                        <ThemedText style={styles.episodeDuration}>{item.duration} • {item.fullDate}</ThemedText>
                    </View>
                    <TouchableOpacity>
                        <Ionicons name="play-circle" size={36} color="#4B59B3" />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    // Combine all sections into one FlatList
    const sections = [
        { type: 'expert', data: expertOpinions },
        { type: 'topEpisodes', data: topEpisodes },
    ];

    const renderSection = ({ item }) => {
        if (item.type === 'expert') {
            return (
                <View style={styles.section}>
                    {/* <View style={styles.sectionHeader}>
                        <ThemedText style={styles.sectionTitle}>Expert opinions</ThemedText>
                        <TouchableOpacity>
                            <ThemedText style={styles.seeAllText}>See All</ThemedText>
                        </TouchableOpacity>
                    </View> */}
                    
                    <FlatList
                        data={item.data}
                        renderItem={renderExpertOpinionItem}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={CARD_WIDTH + 16}
                        snapToAlignment="start"
                        decelerationRate="fast"
                        contentContainerStyle={styles.expertList}
                        onViewableItemsChanged={onViewableItemsChanged}
                        viewabilityConfig={viewabilityConfig}
                    />
                    
                    {/* Pagination Dots */}
                    <View style={styles.paginationContainer}>
                        {expertOpinions.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.paginationDot,
                                    {
                                        backgroundColor: index === activeIndex ? '#4B59B3' : '#D9D9D9',
                                        width: index === activeIndex ? 24 : 8,
                                    }
                                ]}
                            />
                        ))}
                    </View>
                </View>
            );
        } else {
            return (
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <ThemedText style={styles.sectionTitle}>This Week's Top Episodes</ThemedText>
                        <TouchableOpacity>
                            <ThemedText style={styles.seeAllText}>See All</ThemedText>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.episodesContainer}>
                        {item.data.map((episode) => (
                            <TouchableOpacity 
                                key={episode.id}
                                style={styles.episodeCard}
                                onPress={() => navigation.navigate('PodcastDetail', { podcast: episode })}
                            >
                                <Image source={{ uri: episode.image }} style={styles.episodeImage} />
                                <View style={styles.episodeContent}>
                                    <View style={styles.episodeHeader}>
                                        <ThemedText style={styles.episodeCategory}>{episode.category}</ThemedText>
                                        <ThemedText style={styles.episodeTitle}>{episode.title}</ThemedText>
                                    </View>
                                    <View style={styles.episodeFooter}>
                                        <View style={styles.episodeMeta}>
                                            <Ionicons name="time-outline" size={14} color="#999" />
                                            <ThemedText style={styles.episodeDuration}>{episode.duration} • {episode.fullDate}</ThemedText>
                                        </View>
                                        <TouchableOpacity>
                                            <Ionicons name="play-circle" size={36} color="#4B59B3" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            );
        }
    };

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <ThemedText style={styles.headerTitle}>Podcasts</ThemedText>
                        <ThemedText style={styles.headerSubtitle}>Discover amazing content</ThemedText>
                    </View>
                    <TouchableOpacity style={styles.searchButton}>
                        <Ionicons name="search-outline" size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                {/* Main FlatList - No nesting issues */}
                <FlatList
                    data={sections}
                    renderItem={renderSection}
                    keyExtractor={(item) => item.type}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.contentContainer}
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
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '400',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#999',
    },
    searchButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        paddingBottom: 20,
    },
    section: {
        marginTop: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '400',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
    },
    seeAllText: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#4B59B3',
    },
    expertList: {
        paddingHorizontal: 16,
        gap: 16,
    },
    expertCard: {
        // backgroundColor: '#FFFFFF',
        // borderRadius: 12,
        // borderWidth: 1,
        // borderColor: '#F0F0F0',
        overflow: 'hidden',
        // elevation: 3,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 4,
        // marginRight: 16,
        paddingHorizontal: 24
    },
    expertImage: {
        width: '100%',
        height: 180,
        resizeMode: 'cover',
        borderRadius: 12
    },
    expertContent: {
        padding: 16,
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center',
    },
    expertTextContent: {
        flex: 1,
        marginRight: 12,
    },
    expertCategory: {
        fontSize: 12,
        fontFamily: 'tenez',
        color: '#4B59B3',
        marginBottom: 4,
    },
    expertTitle: {
        fontSize: 24,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        lineHeight: 36,
        textAlign: 'center',
    },
    expertListenContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#212121',
        paddingHorizontal: 26,
        paddingVertical: 12,
        borderRadius: 25,
        marginTop: 12,
    },
    expertListenText: {
        fontSize: 18,
        fontFamily: 'tenez',
        color: '#fff',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        gap: 8,
    },
    paginationDot: {
        height: 8,
        borderRadius: 4,
    },
    episodesContainer: {
        paddingHorizontal: 16,
        gap: 16,
    },
    episodeCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    episodeImage: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
    },
    episodeContent: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    episodeHeader: {
        marginBottom: 8,
    },
    episodeCategory: {
        fontSize: 12,
        fontFamily: 'tenez',
        color: '#4B59B3',
        marginBottom: 4,
    },
    episodeTitle: {
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        lineHeight: 18,
    },
    episodeFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    episodeMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    episodeDuration: {
        fontSize: 12,
        fontFamily: 'tenez',
        color: '#999',
    },
});