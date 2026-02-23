import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { BlurView } from 'expo-blur';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function PodcastDetail({ route, navigation }) {
    const { colors } = useTheme();
    const { podcast } = route.params || {};
    const [isPlaying, setIsPlaying] = useState(false);
    const [sound, setSound] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Mock podcast data (in case route.params is not provided)
    const podcastData = {
        id: '1',
        title: 'İhracı Dink anıldı, Avrupa\'nın planı | 20 Ocak 2026',
        category: 'Expert opinions',
        image: 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        duration: '6 min',
        fullDate: '19 January 2026',
        description: 'BM Genel Sekreteri Guterres, Maduro operasyonunun emsal teşkil etmesinden endişe ettiğini söyledi. Danimarka Başbakanı, ABD\'nin olası bir Grönland müdahalesinin "NATO\'nun sonu" anlamına geleceğini vurguladı. Bu bölüm Diageo Türkiye hakkında reklam içermektedir. Samandağı Gastronomi Köyü projesi, bölgenin köklü mutfak kültürünü yaşatmayı ve özellikle kadınların sosyal ve ekonomik yaşama katılımını artırmayı amaçlıyor. Ayrıntılı bilgiye buradan erişebilirsiniz.',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Sample audio URL
    };

    // console.log("podcastData", podcastData.description)

    // Clean up sound on unmount
    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    const togglePlay = async () => {
        if (isPlaying) {
            // Pause audio
            if (sound) {
                await sound.pauseAsync();
                setIsPlaying(false);
            }
        } else {
            // Play audio
            if (sound) {
                await sound.playAsync();
                setIsPlaying(true);
            } else {
                await loadAndPlayAudio();
            }
        }
    };

    const loadAndPlayAudio = async () => {
        try {
            setIsLoading(true);

            // Request audio permissions
            const { granted } = await Audio.requestPermissionsAsync();
            if (!granted) {
                Alert.alert('Permission Required', 'Please grant audio permissions to play podcasts.');
                setIsLoading(false);
                return;
            }

            // Configure audio mode
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                staysActiveInBackground: true,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                playThroughEarpieceAndroid: false,
            });

            // Load and play audio
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
            // Reset to beginning
            if (sound) {
                sound.setPositionAsync(0);
            }
        }
    };

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <ThemedText style={styles.headerTitle}>Podcast</ThemedText>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Podcast Image with Overlay */}
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: podcastData.image }} style={styles.podcastImage} />
                        

                        {/* Blur Overlay with Category and Date */}
                        <BlurView intensity={40} tint="dark" style={styles.blurOverlay}>
                            <View style={styles.overlayContent}>
                                <ThemedText style={styles.overlayCategory}>{podcastData.category}</ThemedText>
                                <ThemedText style={styles.overlayDate}>20 Ocak 2026</ThemedText>
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

                    {/* About This Episode Section - Card Design */}
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
                            {podcastData.description}
                        </ThemedText>
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
        marginBottom: 24,
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
    aboutCard: {
        backgroundColor: '#ffff',
        borderRadius: 12,
        padding: 20,
        marginHorizontal: 16,
        marginBottom: 24,
        borderWidth: 0,
        // Android elevation
        elevation: 3,
        // iOS shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
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
});