import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { BlurView } from 'expo-blur';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    ScrollView,
    Share,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import podcastService from '../../../services/podcastService';
import reactionService from '../../../services/reactionService';

const { width } = Dimensions.get('window');

export default function PodcastDetail({ route, navigation }) {
    const { colors } = useTheme();
    const { podcastId } = route.params || {};
    console.log("podcast id", podcastId)
    const [isPlaying, setIsPlaying] = useState(false);
    const [sound, setSound] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [podcastData, setPodcastData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [currentUserId, setCurrentUserId] = useState(null);

    // Get current user ID from storage
    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const userDataString = await AsyncStorage.getItem('userData');
                if (userDataString) {
                    const userData = JSON.parse(userDataString);
                    let userId = null;
                    if (userData.data?.id) {
                        userId = userData.data.id;
                    } else if (userData.id) {
                        userId = userData.id;
                    } else if (userData._id) {
                        userId = userData._id;
                    }
                    setCurrentUserId(userId);
                }
            } catch (error) {
                console.error('Error getting current user:', error);
            }
        };
        getCurrentUser();
    }, []);

    // Fetch podcast details from API
    useEffect(() => {
        if (podcastId) {
            fetchPodcastDetail();
        }
    }, [podcastId]);

    const fetchPodcastDetail = async () => {
        try {
            const result = await podcastService.getPodcastById(podcastId);

            console.log("result", result)
            
            if (result.success && result.data) {
                const podcastData = result.data.data || result.data;
                
                // Get like status
                let likeStatus = false;
                let totalLikes = 0;
                try {
                    const reactionResult = await reactionService.getReactions(podcastData._id);
                    if (reactionResult.success && reactionResult.data) {
                        totalLikes = reactionResult.data.summary?.total || 0;
                        likeStatus = reactionResult.data.myReaction === 'like';
                    }
                } catch (error) {
                    console.error('Error fetching reactions:', error);
                }
                
                setPodcastData({
                    id: podcastData._id,
                    title: podcastData.title,
                    category: podcastData.category,
                    image: podcastData.coverImage,
                    audioUrl: podcastData.audioFile,
                    duration: `${podcastData.audioDuration} min`,
                    fullDate: new Date(podcastData.createdAt).toLocaleDateString('en-US', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                    }),
                    aboutEpisode: podcastData.aboutEpisode,
                    summary: podcastData.summary,
                    tags: podcastData.tags || [],
                    isPremium: podcastData.isPremium,
                    author: podcastData.author?.name,
                    authorImage: podcastData.author?.profileImage,
                    authorBio: podcastData.author?.bio,
                    createdAt: podcastData.createdAt,
                });
                setLikeCount(totalLikes);
                setLiked(likeStatus);
            }
        } catch (error) {
            console.error('Error fetching podcast:', error);
            Alert.alert('Error', 'Failed to load podcast');
        } finally {
            setLoading(false);
        }
    };

    // Clean up sound on unmount
    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    const togglePlay = async () => {
        if (isPlaying) {
            if (sound) {
                await sound.pauseAsync();
                setIsPlaying(false);
            }
        } else {
            if (sound) {
                await sound.playAsync();
                setIsPlaying(true);
            } else {
                await loadAndPlayAudio();
            }
        }
    };

    const loadAndPlayAudio = async () => {
        if (!podcastData?.audioUrl) return;
        
        try {
            setIsLoading(true);

            const { granted } = await Audio.requestPermissionsAsync();
            if (!granted) {
                Alert.alert('Permission Required', 'Please grant audio permissions to play podcasts.');
                setIsLoading(false);
                return;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                staysActiveInBackground: true,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                playThroughEarpieceAndroid: false,
            });

            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: podcastData.audioUrl },
                { shouldPlay: true },
                onPlaybackStatusUpdate
            );

            setSound(newSound);
            setIsPlaying(true);
            setIsLoading(false);

        } catch (error) {
            console.error('Error loading audio:', error);
            Alert.alert('Error', 'Failed to load audio. Please try again.');
            setIsLoading(false);
        }
    };

    const onPlaybackStatusUpdate = (status) => {
        if (status.didJustFinish) {
            setIsPlaying(false);
            if (sound) {
                sound.setPositionAsync(0);
            }
        }
    };

    const toggleLike = async () => {
        const newLikedState = !liked;
        setLiked(newLikedState);
        setLikeCount(newLikedState ? likeCount + 1 : likeCount - 1);

        if (newLikedState) {
            const result = await reactionService.addReaction('podcast', podcastData.id, 'like');
            if (!result.success) {
                setLiked(!newLikedState);
                setLikeCount(likeCount);
                Alert.alert('Error', 'Failed to like the podcast');
            }
        } else {
            const result = await reactionService.removeReaction('podcast', podcastData.id);
            if (!result.success) {
                setLiked(!newLikedState);
                setLikeCount(likeCount);
                Alert.alert('Error', 'Failed to unlike the podcast');
            }
        }
    };

    const toggleBookmark = async () => {
        const newState = !bookmarked;
        setBookmarked(newState);

        if (newState) {
            await podcastService.bookmarkPodcast(podcastData.id);
            Alert.alert('Saved', 'Podcast bookmarked successfully!');
        } else {
            await podcastService.unbookmarkPodcast(podcastData.id);
            Alert.alert('Removed', 'Bookmark removed');
        }
    };

    const handleShare = async () => {
        try {
            const shareUrl = `https://hoped.com/podcast/${podcastData.id}`;
            await Share.share({
                message: `${podcastData.title}\n\nListen more: ${shareUrl}\n\nShared via HOPED App`,
                title: 'Share Podcast',
                url: shareUrl
            });
        } catch (error) {
            console.log('Error sharing:', error);
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

    if (loading) {
        return (
            <ThemedView style={[styles.container, styles.centerContainer]}>
                <ActivityIndicator size="large" color="#4B59B3" />
            </ThemedView>
        );
    }

    if (!podcastData) {
        return (
            <ThemedView style={[styles.container, styles.centerContainer]}>
                <ThemedText style={styles.noDataText}>Podcast not found</ThemedText>
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
                    <ThemedText style={styles.headerTitle}>Podcast</ThemedText>
                    <View style={styles.headerActions}>
                        <TouchableOpacity onPress={toggleBookmark} style={styles.headerAction}>
                            <Ionicons 
                                name={bookmarked ? "bookmark" : "bookmark-outline"} 
                                size={22} 
                                color={bookmarked ? "#4B59B3" : "#000"} 
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleShare} style={styles.headerAction}>
                            <FontAwesome6 name="share-from-square" size={20} color="#000" />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Podcast Image with Overlay */}
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: podcastData.image }} style={styles.podcastImage} />
                        
                        {podcastData.isPremium && (
                            <View style={styles.premiumBadge}>
                                <ThemedText style={styles.premiumText}>PREMIUM</ThemedText>
                            </View>
                        )}

                        <BlurView intensity={40} tint="dark" style={styles.blurOverlay}>
                            <View style={styles.overlayContent}>
                                <ThemedText style={styles.overlayCategory}>{podcastData.category}</ThemedText>
                                <ThemedText style={styles.overlayDate}>{formatDate(podcastData.createdAt)}</ThemedText>
                            </View>
                        </BlurView>
                    </View>

                    {/* Podcast Title */}
                    <ThemedText style={styles.podcastTitle}>{podcastData.title}</ThemedText>

                    {/* Category and Listen Button Row */}
                    <View style={styles.categoryRow}>
                        <ThemedText style={styles.categoryText}>{podcastData.category}</ThemedText>
                        <TouchableOpacity
                            style={styles.listenButton}
                            onPress={togglePlay}
                            disabled={isLoading}
                        >
                            <Ionicons
                                name={isPlaying ? "pause-circle" : "play-circle"}
                                size={24}
                                color="#fff"
                            />
                            <ThemedText style={styles.listenText}>
                                {isLoading ? 'Loading...' : isPlaying ? 'Pause' : 'Listen'}
                            </ThemedText>
                        </TouchableOpacity>
                    </View>

                    {/* Like Button Row */}
                    <View style={styles.likeRow}>
                        <TouchableOpacity 
                            style={[styles.likeButton, liked && styles.likeButtonActive]} 
                            onPress={toggleLike}
                        >
                            <Ionicons 
                                name={liked ? "heart" : "heart-outline"} 
                                size={22} 
                                color={liked ? "#FF3B30" : "#666"} 
                            />
                            <ThemedText style={[styles.likeText, liked && { color: '#FF3B30' }]}>
                                {likeCount}
                            </ThemedText>
                        </TouchableOpacity>
                    </View>

                    {/* About This Episode Section */}
                    <View style={styles.aboutCard}>
                        <ThemedText style={styles.aboutTitle}>About this episode</ThemedText>

                        {/* Duration and Date */}
                        <View style={styles.durationContainer}>
                            <Ionicons name="time-outline" size={14} color="#666" />
                            <ThemedText style={styles.durationText}>
                                {podcastData.duration} • {podcastData.fullDate}
                            </ThemedText>
                        </View>

                        {/* Description */}
                        <ThemedText style={styles.description}>
                            {podcastData.aboutEpisode || podcastData.summary}
                        </ThemedText>
                    </View>

                    {/* Author Section */}
                    {podcastData.author && (
                        <TouchableOpacity 
                            style={styles.authorSection}
                            onPress={() => navigation.navigate('AuthorProfile', { 
                                authorId: podcastData.authorId,
                                authorName: podcastData.author,
                                authorImage: podcastData.authorImage,
                                authorBio: podcastData.authorBio
                            })}
                        >
                            <ThemedText style={styles.authorTitle}>Author</ThemedText>
                            <View style={styles.authorCard}>
                                <Image source={{ uri: podcastData.authorImage }} style={styles.authorImage} />
                                <View style={styles.authorInfo}>
                                    <ThemedText style={styles.authorName}>{podcastData.author}</ThemedText>
                                    <ThemedText style={styles.authorBio}>{podcastData.authorBio}</ThemedText>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}

                    {/* Tags Section */}
                    {podcastData.tags && podcastData.tags.length > 0 && (
                        <View style={styles.tagsSection}>
                            <ThemedText style={styles.tagsTitle}>Tags</ThemedText>
                            <View style={styles.tagsContainer}>
                                {podcastData.tags.map((tag, index) => (
                                    <View key={index} style={styles.tagChip}>
                                        <ThemedText style={styles.tagText}>{tag}</ThemedText>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
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
    centerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    noDataText: {
        fontSize: 16,
        fontFamily: 'tenez',
        color: '#999',
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
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerAction: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingBottom: 30,
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 250,
        marginBottom: 16,
    },
    podcastImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    premiumBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: '#FF9500',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        zIndex: 10,
    },
    premiumText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
    },
    blurOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    overlayContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    overlayCategory: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#FFFFFF',
    },
    overlayDate: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#FFFFFF',
    },
    podcastTitle: {
        fontSize: 20,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        lineHeight: 28,
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    categoryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    categoryText: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#4B59B3',
    },
    listenButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#212121',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 4,
    },
    listenText: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#FFFFFF',
    },
    likeRow: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    likeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        alignSelf: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    likeButtonActive: {
        backgroundColor: '#FFF0F0',
    },
    likeText: {
        fontSize: 14,
        fontFamily: 'CoFoRaffineMedium',
        color: '#666',
    },
    aboutCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        marginHorizontal: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    aboutTitle: {
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        marginBottom: 12,
    },
    durationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    durationText: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#666',
    },
    description: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#444',
        lineHeight: 22,
    },
    authorSection: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    authorTitle: {
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        marginBottom: 12,
    },
    authorCard: {
        flexDirection: 'row',
        gap: 12,
    },
    authorImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    authorInfo: {
        flex: 1,
    },
    authorName: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        marginBottom: 4,
    },
    authorBio: {
        fontSize: 13,
        fontFamily: 'tenez',
        color: '#666',
        lineHeight: 18,
    },
    tagsSection: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    tagsTitle: {
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        marginBottom: 12,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tagChip: {
        backgroundColor: '#F0F0F0',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    tagText: {
        fontSize: 12,
        fontFamily: 'tenez',
        color: '#666',
    },
});