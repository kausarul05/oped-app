import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import Carousel from 'react-native-snap-carousel-new';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7; // Slightly smaller to show prev/next cards clearly
const CARD_HEIGHT = 380;
const SLIDER_WIDTH = width;

import { LogBox } from 'react-native';

LogBox.ignoreLogs([
    'A props object containing a "key" prop is being spread into JSX',
    'EventEmitter.removeListener'
]);

export default function ReaderSlider() {
    const { colors } = useTheme();
    const [likedItems, setLikedItems] = useState({});
    const [bookmarkedItems, setBookmarkedItems] = useState({});
    const [activeIndex, setActiveIndex] = useState(1); // Start with middle card (index 1)
    const carouselRef = useRef(null);

    // Sample data - replace with your actual data
    const articles = [
        {
            id: '1',
            title: 'Manchester United',
            subtitle: 'The Future of Digital Media and the Changing Voice of Independent Journal...',
            description: 'As technology evolves and reader habits shift, independent platforms are redefining how stories ...',
            image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            category: 'Sports',
            readTime: '5 min read',
            likes: 124,
            comments: 18,
        },
        {
            id: '2',
            title: 'Digital Revolution',
            subtitle: 'How AI is Transforming the Way We Consume News and Information',
            description: 'Artificial intelligence is reshaping journalism, bringing personalized content...',
            image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            category: 'Technology',
            readTime: '4 min read',
            likes: 89,
            comments: 12,
        },
        {
            id: '3',
            title: 'Global Economy',
            subtitle: 'Markets React to Changing Political Landscapes Across Europe and Asia',
            description: 'Investors are watching closely as economic indicators shift...',
            image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            category: 'Finance',
            readTime: '6 min read',
            likes: 56,
            comments: 7,
        },
        {
            id: '4',
            title: 'Cultural Renaissance',
            subtitle: 'How Local Artists Are Gaining Global Recognition',
            description: 'The internet has democratized art, allowing creators from remote corners...',
            image: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80',
            category: 'Culture',
            readTime: '7 min read',
            likes: 42,
            comments: 5,
        },
        {
            id: '5',
            title: 'Tech Innovation',
            subtitle: 'How Startups Are Revolutionizing Work',
            description: 'New technologies are emerging every day, changing how we interact...',
            image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            category: 'Technology',
            readTime: '5 min read',
            likes: 67,
            comments: 9,
        },
    ];

    const toggleLike = (id) => {
        setLikedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const toggleBookmark = (id) => {
        setBookmarkedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleShare = (item) => {
        console.log('Share:', item.title);
    };

    const handleComment = (item) => {
        console.log('Comments for:', item.title);
    };

    const onSnapToItem = (index) => {
        setActiveIndex(index);
    };

    const renderItem = ({ item, index }) => {
        const isLiked = likedItems[item.id] || false;
        const isBookmarked = bookmarkedItems[item.id] || false;
        const isActive = index === activeIndex;

        return (
            <TouchableOpacity
                activeOpacity={0.95}
                style={[
                    styles.cardContainer,
                    {
                        backgroundColor: '#FFFFFF',
                        shadowColor: '#000',
                        // Make active card stand out more
                        transform: [
                            { scale: isActive ? 1 : 0.95 }
                        ]
                    }
                ]}
            >
                <Image
                    source={{ uri: item.image }}
                    style={styles.cardImage}
                />

                <View style={[styles.categoryBadge, { backgroundColor: '#4B59B3' }]}>
                    <ThemedText style={styles.categoryText}>{item.category}</ThemedText>
                </View>

                <View style={styles.cardContent}>
                    <ThemedText style={styles.cardTitle}>{item.title}</ThemedText>

                    <ThemedText style={styles.cardSubtitle} numberOfLines={2}>
                        {item.subtitle}
                    </ThemedText>

                    <ThemedText style={styles.cardDescription} numberOfLines={2}>
                        {item.description}
                    </ThemedText>

                    <View style={styles.footerContainer}>
                        <View style={styles.metaItem}>
                            <Ionicons name="time-outline" size={14} color="#666" />
                            <ThemedText style={styles.metaText}>{item.readTime}</ThemedText>
                        </View>

                        <View style={styles.actionIcons}>
                            <TouchableOpacity onPress={() => toggleLike(item.id)}>
                                <Ionicons
                                    name={isLiked ? "heart" : "heart-outline"}
                                    size={18}
                                    color={isLiked ? "#FF3B30" : "#666"}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => handleComment(item)}>
                                <Ionicons name="chatbubble-outline" size={18} color="#666" />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => toggleBookmark(item.id)}>
                                <Ionicons
                                    name={isBookmarked ? "bookmark" : "bookmark-outline"}
                                    size={18}
                                    color={isBookmarked ? "#4B59B3" : "#666"}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => handleShare(item)}>
                                <Ionicons name="share-social-outline" size={18} color="#666" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <ThemedView style={styles.container}>
            <Carousel
                ref={carouselRef}
                data={articles}
                renderItem={renderItem}
                sliderWidth={SLIDER_WIDTH}
                itemWidth={300}
                layout="default"
                loop={true}
                autoplay={true}
                inactiveSlideScale={1} // Make side cards smaller
                inactiveSlideOpacity={0.9} // Make side cards more transparent
                activeSlideAlignment="center"
                containerCustomStyle={styles.carouselContainer}
                contentContainerCustomStyle={styles.carouselContent}
                removeClippedSubviews={false}
                onSnapToItem={onSnapToItem}
                firstItem={2} // Start with middle card (index 2 of 5 items)
                enableSnap={true}
                useScrollView={true}
                scrollEnabled={true}
                shouldOptimizeUpdates={true}
                enableMomentum={false}
                decelerationRate="fast"
                inactiveSlideShift={0}
            />
            
            {/* Pagination Dots */}
            <View style={styles.paginationContainer}>
                {articles.map((_, index) => (
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
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 16,
    },
    carouselContainer: {
        flexGrow: 1,
    },
    carouselContent: {
        alignItems: 'center',
    },
    cardContainer: {
        width: '100%',
        height: CARD_HEIGHT,
        borderRadius: 16,
        overflow: 'hidden',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardImage: {
        width: '100%',
        height: 140,
        resizeMode: 'cover',
    },
    categoryBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 16,
    },
    categoryText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineMedium',
    },
    cardContent: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        fontFamily: 'CoFoRaffineBold',
        marginBottom: 4,
        color: '#000',
    },
    cardSubtitle: {
        fontSize: 13,
        fontWeight: '500',
        fontFamily: 'CoFoRaffineMedium',
        marginBottom: 4,
        color: '#333',
        lineHeight: 16,
    },
    cardDescription: {
        fontSize: 12,
        fontWeight: '400',
        fontFamily: 'tenez',
        marginBottom: 8,
        color: '#666',
        lineHeight: 15,
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 11,
        fontFamily: 'tenez',
        color: '#666',
    },
    actionIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
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
});