import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { BlurView } from 'expo-blur';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import podcastService from '../../../services/podcastService';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32; // Full width minus padding

export default function PodcastHome({ navigation }) {
    const { colors } = useTheme();
    const [activeIndex, setActiveIndex] = useState(0);
    const [playingId, setPlayingId] = useState(null);
    const [sound, setSound] = useState(null);
    const [expertOpinions, setExpertOpinions] = useState([]);
    const [topEpisodes, setTopEpisodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const flatListRef = useRef(null);

    // Fetch podcasts from API
    const fetchPodcasts = async () => {
        try {
            const result = await podcastService.getPodcasts('politics', 1, 10);

            if (result.success && result.data) {
                // Format data for Expert Opinions section (horizontal scroll)
                const formattedExpert = result.data.map(podcast => ({
                    id: podcast._id,
                    title: podcast.title,
                    category: 'Expert opinions',
                    image: podcast.coverImage,
                    audioUrl: podcast.audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                    duration: `${podcast.audioDuration} min`,
                    date: formatDate(podcast.createdAt),
                    isPremium: podcast.isPremium,
                    author: podcast.author?.name,
                }));
                setExpertOpinions(formattedExpert);

                // Format data for Top Episodes section
                const formattedTopEpisodes = result.data.map(podcast => ({
                    id: podcast._id,
                    title: podcast.title,
                    date: formatDate(podcast.createdAt),
                    duration: `${podcast.audioDuration} min`,
                    fullDate: new Date(podcast.createdAt).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    }),
                    category: podcast.category,
                    image: podcast.coverImage,
                    audioUrl: podcast.audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                    isPremium: podcast.isPremium,
                }));
                setTopEpisodes(formattedTopEpisodes);
            }
        } catch (error) {
            console.error('Error fetching podcasts:', error);
            Alert.alert('Error', 'Failed to load podcasts');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    useEffect(() => {
        fetchPodcasts();
    }, []);

    // Clean up sound on unmount
    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, []);

    // Stop audio when navigating away
    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            if (sound) {
                sound.stopAsync();
                sound.unloadAsync();
                setSound(null);
                setPlayingId(null);
            }
        });

        return unsubscribe;
    }, [navigation, sound]);

    // Audio playback functions
    const playAudio = async (item) => {
        try {
            if (sound) {
                await sound.stopAsync();
                await sound.unloadAsync();
                setSound(null);
                setPlayingId(null);
            }

            const { granted } = await Audio.requestPermissionsAsync();
            if (!granted) {
                Alert.alert('Permission Required', 'Please grant audio permissions to play podcasts.');
                return;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                staysActiveInBackground: false,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                playThroughEarpieceAndroid: false,
            });

            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: item.audioUrl },
                { shouldPlay: true },
                (status) => {
                    if (status.didJustFinish) {
                        setPlayingId(null);
                        setSound(null);
                    }
                }
            );

            setSound(newSound);
            setPlayingId(item.id);

        } catch (error) {
            console.error('Error playing audio:', error);
            Alert.alert('Error', 'Failed to play audio. Please try again.');
        }
    };

    const stopAudio = async () => {
        if (sound) {
            await sound.stopAsync();
            await sound.unloadAsync();
            setSound(null);
            setPlayingId(null);
        }
    };

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setActiveIndex(viewableItems[0].index);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50
    }).current;

    const handleExpertCardPress = (item) => {
        if (sound) {
            stopAudio();
        }
        console.log("item", item.id)
        navigation.navigate('PodcastDetail', { podcastId: item.id });
    };

    const handleExpertListenPress = async (item, event) => {
        event.stopPropagation();

        if (playingId === item.id) {
            await stopAudio();
        } else {
            await playAudio(item);
        }
    };

    const renderExpertOpinionItem = ({ item }) => {
        const isPlaying = playingId === item.id;

        return (
            <TouchableOpacity
                style={[styles.expertCard, { width: CARD_WIDTH }]}
                onPress={() => handleExpertCardPress(item)}
                activeOpacity={0.7}
            >
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.image }} style={styles.expertImage} />

                    {/* Premium Badge */}
                    {item.isPremium && (
                        <View style={styles.premiumBadge}>
                            <ThemedText style={styles.premiumText}>PREMIUM</ThemedText>
                        </View>
                    )}

                    <BlurView intensity={70} tint="dark" style={styles.blurOverlay}>
                        <View style={styles.overlayContent}>
                            <ThemedText style={styles.overlayTitle}>{item.category}</ThemedText>
                        </View>
                    </BlurView>
                </View>

                <View style={styles.expertContent}>
                    <View style={styles.expertTextContent}>
                        <ThemedText style={styles.expertTitle}>{item.title}</ThemedText>
                    </View>
                    <TouchableOpacity
                        style={styles.expertListenContainer}
                        onPress={(event) => handleExpertListenPress(item, event)}
                    >
                        <Ionicons
                            name={isPlaying ? "pause-circle" : "play-circle"}
                            size={26}
                            color="#fff"
                        />
                        <ThemedText style={styles.expertListenText}>
                            {isPlaying ? 'Pause' : 'Listen'}
                        </ThemedText>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    const handleTopEpisodeCardPress = (episode) => {
        if (sound) {
            stopAudio();
        }
        console.log("episode", episode.id)
        navigation.navigate('PodcastDetail', { podcastId: episode.id });
    };

    const handleTopEpisodeListenPress = async (episode, event) => {
        event.stopPropagation();

        if (playingId === episode.id) {
            await stopAudio();
        } else {
            await playAudio(episode);
        }
    };

    const renderTopEpisodeItem = ({ item }) => {
        const isPlaying = playingId === item.id;

        return (
            <TouchableOpacity
                style={styles.episodeCard}
                onPress={() => handleTopEpisodeCardPress(item)}
                activeOpacity={0.7}
            >
                <Image source={{ uri: item.image }} style={styles.episodeImage} />
                {item.isPremium && (
                    <View style={styles.episodePremiumBadge}>
                        <ThemedText style={styles.episodePremiumText}>PREMIUM</ThemedText>
                    </View>
                )}
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
                        <TouchableOpacity
                            onPress={(event) => handleTopEpisodeListenPress(item, event)}
                        >
                            <Ionicons
                                name={isPlaying ? "pause-circle" : "play-circle"}
                                size={36}
                                color={isPlaying ? "#FF3B30" : "#4B59B3"}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const sections = [
        { type: 'expert', data: expertOpinions },
        { type: 'topEpisodes', data: topEpisodes },
    ];

    const renderSection = ({ item }) => {
        if (item.type === 'expert') {
            return (
                <View style={styles.section}>
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
                <View style={[styles.section, { marginTop: 38 }]}>
                    <View style={styles.sectionHeader}>
                        <ThemedText style={styles.sectionTitle}>This Week's Top Episodes</ThemedText>
                    </View>
                    <View style={styles.episodesContainer}>
                        {item.data.map((episode) => (
                            <TouchableOpacity
                                key={episode.id}
                                style={styles.episodeCard}
                                onPress={() => handleTopEpisodeCardPress(episode)}
                                activeOpacity={0.7}
                            >
                                <Image source={{ uri: episode.image }} style={styles.episodeImage} />
                                {episode.isPremium && (
                                    <View style={styles.episodePremiumBadge}>
                                        <ThemedText style={styles.episodePremiumText}>PREMIUM</ThemedText>
                                    </View>
                                )}
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
                                        <TouchableOpacity
                                            onPress={(event) => handleTopEpisodeListenPress(episode, event)}
                                        >
                                            <Ionicons
                                                name={playingId === episode.id ? "pause-circle" : "play-circle"}
                                                size={36}
                                                color={playingId === episode.id ? "#FF3B30" : "#4B59B3"}
                                            />
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

    if (loading && expertOpinions.length === 0) {
        return (
            <ThemedView style={[styles.container, styles.centerContainer]}>
                <ActivityIndicator size="large" color="#4B59B3" />
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <View>
                        <ThemedText style={styles.headerTitle}>Podcasts</ThemedText>
                        <ThemedText style={styles.headerSubtitle}>Discover amazing content</ThemedText>
                    </View>
                    <TouchableOpacity style={styles.searchButton}>
                        <Ionicons name="search-outline" size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={sections}
                    renderItem={renderSection}
                    keyExtractor={(item) => item.type}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.contentContainer}
                    refreshing={refreshing}
                    onRefresh={fetchPodcasts}
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
    expertList: {
        paddingHorizontal: 16,
        gap: 16,
    },
    expertCard: {
        overflow: 'hidden',
        paddingHorizontal: 26,
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
    },
    expertImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    premiumBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: '#FF9500',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 16,
        zIndex: 10,
    },
    premiumText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineMedium',
    },
    blurOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '100%',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    overlayContent: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlayTitle: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#FFFFFF',
    },
    expertContent: {
        padding: 16,
        alignItems: 'center',
    },
    expertTextContent: {
        marginRight: 12,
    },
    expertTitle: {
        fontSize: 20,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        lineHeight: 28,
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
        position: 'relative',
    },
    episodePremiumBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#FF9500',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        zIndex: 10,
    },
    episodePremiumText: {
        color: '#FFFFFF',
        fontSize: 8,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineMedium',
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