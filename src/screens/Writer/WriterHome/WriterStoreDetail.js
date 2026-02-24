import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { FontAwesome6, Foundation, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    Share,
    StyleSheet,
    TouchableOpacity,
    useWindowDimensions,
    View
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WriterStoreDetail({ route, navigation }) {
    const { width } = useWindowDimensions();
    const { colors } = useTheme();
    const { article } = route.params || {};

    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [likeCount, setLikeCount] = useState(9);
    const [showFullContent, setShowFullContent] = useState(false);

    // Article data (from params or default)
    const articleData = article || {
        id: '1',
        title: 'Why Subscription-Based Content Is Growing Fast.',
        description: 'As technology evolves and reader habits shift, independent readers are increasingly turning to subscription-based content. As technology evolves and reader habits shift, independent readers are increasingly turning to subscription-based content.',
        image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        authorName: 'Daniel Thompson',
        authorImage: 'https://randomuser.me/api/portraits/men/2.jpg',
        postDate: '22 Jan, 2020',
        likes: '9M',
        comments: '45K',
        shares: '854',
        shortContent: `
            <h1>Why Subscription-Based Content Is Growing Fast.</h1>
            
            <p>I didn’t want a regular job, so my friend and I decided to start a business selling digital products. We spent a lot of time figuring out how to make it work.</p>
            
            <p>Eventually, we found a product to sell. My friend handled Facebook ads, and I created the ad designs in Canva. We started investing Rs. 600 each day in ads. I know it’s not much, but that’s all we could afford.</p>
            
            <p>To make a profit, we had to earn more than Rs. 600 a day. We lost money on the first day, but on the second day we made a profit of Rs. 150.</p>
        `,
        fullContent: `
            <h1>Why Subscription-Based Content Is Growing Fast.</h1>
            
            <p>I didn’t want a regular job, so my friend and I decided to start a business selling digital products. We spent a lot of time figuring out how to make it work.</p>
            
            <p>Eventually, we found a product to sell. My friend handled Facebook ads, and I created the ad designs in Canva. We started investing Rs. 600 each day in ads. I know it’s not much, but that’s all we could afford.</p>
            
            <p>To make a profit, we had to earn more than Rs. 600 a day. We lost money on the first day, but on the second day we made a profit of Rs. 150.</p>
            
            <p>As we continued investing our savings in Facebook ads in those first weeks, our money eventually ran out. We didn’t have any other source of income at that time, so we had to stop.</p>
            
            <p>Even though it felt like we had wasted our money and got nothing in return, I reminded myself that every—</p>
            
            <h1>Why Subscription-Based Content Is Growing Fast.</h1>
            
            <p>I didn’t want a regular job, so my friend and I decided to</p>
        `,
    };

    // Related articles data (same design as WriterContent)
    const relatedArticles = [
        {
            id: '2',
            title: 'Why Subscription-Based Content Is Growing Fast.',
            description: 'As technology evolves and reader habits shift, independ...',
            image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            likes: '9M',
            comments: '45K',
            shares: '854',
        },
        {
            id: '3',
            title: 'Why Subscription-Based Content Is Growing Fast.',
            description: 'As technology evolves and reader habits shift, independ...',
            image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            likes: '9M',
            comments: '45K',
            shares: '854',
        },
        {
            id: '4',
            title: 'Why Subscription-Based Content Is Growing Fast.',
            description: 'As technology evolves and reader habits shift, independ...',
            image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            likes: '9M',
            comments: '45K',
            shares: '854',
        },
    ];

    // HTML styles
    const htmlStyles = {
        h1: {
            fontSize: 18,
            fontWeight: '400',
            fontFamily: 'CoFoRaffineBold',
            color: '#000',
            lineHeight: 32,
            marginBottom: 16,
            marginTop: 8,
        },
        p: {
            fontSize: 16,
            fontFamily: 'tenez',
            color: '#444',
            lineHeight: 26,
            marginBottom: 18,
        },
    };

    const toggleLike = () => {
        setLiked(!liked);
        setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    };

    const toggleBookmark = () => {
        setBookmarked(!bookmarked);
        Alert.alert(
            bookmarked ? 'Bookmark Removed' : 'Bookmark Added',
            bookmarked ? 'Article removed from bookmarks' : 'Article saved to bookmarks'
        );
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `${articleData.title}\n\nRead more on HOPED app`,
                title: 'Share Article'
            });
        } catch (error) {
            console.log('Error sharing:', error);
        }
    };

    const renderRelatedArticle = (item) => (
        <TouchableOpacity
            key={item.id}
            style={{
                borderBottomWidth: 1,
                borderBottomColor: '#F0F0F0',
                backgroundColor: '#FFFFFF',
                borderRadius: 8,
                elevation: 1,
                padding: 8
            }}
            onPress={() => navigation.push('WriterStoreDetail', { article: item })}
        >
            <View style={styles.relatedArticleCard}>
                <View style={styles.relatedArticleContent}>
                    <ThemedText style={styles.relatedArticleTitle}>{item.title}</ThemedText>
                    <ThemedText style={styles.relatedArticleDescription} numberOfLines={2}>
                        {item.description}
                    </ThemedText>
                </View>
                <Image source={{ uri: item.image }} style={styles.relatedArticleImage} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {/* Stats Section */}
                <View style={styles.relatedArticleStats}>
                    <View style={styles.relatedStatItem}>
                        <Foundation name="like" size={12} color="#000" />
                        <ThemedText style={styles.relatedStatText}>{item.likes}</ThemedText>
                    </View>
                    <View style={styles.relatedStatItem}>
                        <Ionicons name="chatbubble-outline" size={12} color="#000" />
                        <ThemedText style={styles.relatedStatText}>{item.comments}</ThemedText>
                    </View>
                    <View style={styles.relatedStatItem}>
                        <Ionicons name="share-social-outline" size={12} color="#000" />
                        <ThemedText style={styles.relatedStatText}>{item.shares}</ThemedText>
                    </View>
                </View>
                <TouchableOpacity>
                    <Ionicons name="ellipsis-horizontal" size={16} color="#999" />
                </TouchableOpacity>
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

                    <View style={styles.headerActions}>
                        <ThemedText style={{ fontSize: 22, color: '#000', fontFamily: 'CoFoRaffineBold' }}>Store Detail</ThemedText>
                    </View>
                    <View />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Cover Image */}
                    <Image source={{ uri: articleData.image }} style={styles.coverImage} />

                    {/* Title */}
                    <ThemedText style={styles.articleTitle}>{articleData.title}</ThemedText>

                    {/* description */}
                    <View style={styles.summaryContainer}>
                        <ThemedText style={styles.summary}>{articleData.description}</ThemedText>
                    </View>

                    {/* Author Section */}
                    <TouchableOpacity
                        style={styles.authorSection}
                        onPress={() => navigation.navigate('WriterHome', { author: articleData.author })}
                    >
                        <View style={styles.authorInfo}>
                            <ThemedText style={styles.authorName}>{articleData.authorName}</ThemedText>
                            <ThemedText style={styles.postDate}>{articleData.postDate}</ThemedText>
                        </View>
                        <Image source={{ uri: articleData.authorImage }} style={styles.authorImage} />
                    </TouchableOpacity>

                    {/* HTML Content */}
                    <View style={styles.htmlContentArea}>
                        <RenderHTML
                            contentWidth={width - 32}
                            source={{ html: showFullContent ? articleData.fullContent : articleData.shortContent }}
                            tagsStyles={htmlStyles}
                            defaultTextProps={{
                                style: { fontFamily: 'tenez' }
                            }}
                        />
                    </View>

                    {/* Read More Section */}
                    {!showFullContent && (
                        <TouchableOpacity
                            style={styles.readMoreContainer}
                            onPress={() => setShowFullContent(true)}
                        >
                            <ThemedText style={styles.readMoreText}>Read more...</ThemedText>
                        </TouchableOpacity>
                    )}

                    {/* Action Buttons */}
                    <View style={styles.actionContainer}>
                        <TouchableOpacity style={[styles.actionButton, liked && styles.actionButtonActive]} onPress={toggleLike}>
                            <Foundation name="like" size={22} color={liked ? "#4B59B3" : "#666"} />
                            <ThemedText style={[styles.actionText, liked && { color: '#4B59B3' }]}>{articleData.likes}</ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton}>
                            <MaterialCommunityIcons name="message-text-outline" size={22} color="#666" />
                            <ThemedText style={styles.actionText}>{articleData.comments}</ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                            <FontAwesome6 name="share-from-square" size={20} color="#666" />
                            <ThemedText style={styles.actionText}>{articleData.shares}</ThemedText>
                        </TouchableOpacity>
                    </View>

                    {/* Related Articles Section */}
                    <View style={styles.relatedSection}>
                        <ThemedText style={styles.relatedTitle}>Related Articles</ThemedText>
                        <View style={styles.relatedList}>
                            {relatedArticles.map(item => renderRelatedArticle(item))}
                        </View>
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
    coverImage: {
        width: '100%',
        height: 280,
        resizeMode: 'cover',
    },
    articleTitle: {
        fontSize: 22,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        lineHeight: 30,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 16,
    },

    summaryContainer: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    summary: {
        fontSize: 16,
        fontFamily: 'tenez',
        color: '#555',
        lineHeight: 24,
    },
    authorSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        marginVertical: 8,
    },
    authorImage: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 12,
        borderWidth: 2,
        borderColor: '#4B59B3',
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
    postDate: {
        fontSize: 13,
        fontFamily: 'tenez',
        color: '#999',
    },
    htmlContentArea: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    readMoreContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    readMoreText: {
        fontSize: 15,
        fontFamily: 'CoFoRaffineBold',
        color: '#4B59B3',
    },
    actionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        marginVertical: 16,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    actionButtonActive: {
        // For active state
    },
    actionText: {
        fontSize: 14,
        fontFamily: 'CoFoRaffineMedium',
        color: '#666',
    },
    relatedSection: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    relatedTitle: {
        fontSize: 20,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        marginBottom: 16,
    },
    relatedList: {
        gap: 16,
    },
    relatedArticleCard: {
        flexDirection: 'row',
        gap: 12,
        paddingVertical: 12,

    },
    relatedArticleImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    relatedArticleContent: {
        flex: 1,
    },
    relatedArticleTitle: {
        fontSize: 15,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        marginBottom: 4,
        lineHeight: 18,
    },
    relatedArticleDescription: {
        fontSize: 12,
        fontFamily: 'tenez',
        color: '#666',
        lineHeight: 16,
        marginBottom: 8,
    },
    relatedArticleStats: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    relatedStatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    relatedStatText: {
        fontSize: 11,
        fontFamily: 'tenez',
        color: '#000',
    },
});