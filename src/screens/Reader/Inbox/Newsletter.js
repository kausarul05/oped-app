import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import followService from '../../../services/followService';

export default function Newsletter({ navigation }) {
    const { colors } = useTheme();
    const [newsletters, setNewsletters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
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

    // Fetch following list (newsletters)
    const fetchFollowingList = async () => {
        try {
            const result = await followService.getFollowing(currentUserId, 1, 100);
            
            if (result.success && result.data) {
                const formattedNewsletters = result.data.map(follow => ({
                    id: follow._id,
                    name: follow.name,
                    avatar: follow.profileImage,
                    bio: follow.bio,
                    followersCount: follow.followersCount,
                }));
                setNewsletters(formattedNewsletters);
            }
        } catch (error) {
            console.error('Error fetching following list:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchFollowingList();
    };

    useEffect(() => {
        if (currentUserId) {
            fetchFollowingList();
        }
    }, [currentUserId]);

    const renderNewsletterItem = ({ item }) => (
        <TouchableOpacity
            style={styles.newsletterItem}
            onPress={() => navigation.navigate('AuthorProfile', { 
                authorId: item.id,
                // authorName: item.name,
                // authorImage: item.avatar,
                // authorBio: item.bio
            })}
        >
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.newsletterContent}>
                <View style={styles.nameContainer}>
                    <ThemedText style={styles.newsletterName}>{item.name}</ThemedText>
                </View>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <ThemedView style={[styles.container, styles.centerContainer]}>
                <ActivityIndicator size="large" color="#4B59B3" />
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
                    <ThemedText style={styles.headerTitle}>Your Newsletters</ThemedText>
                    <View style={{ width: 40 }} />
                </View>

                {/* Newsletter List */}
                {newsletters.length > 0 ? (
                    <FlatList
                        data={newsletters}
                        renderItem={renderNewsletterItem}
                        keyExtractor={(item) => item.id}
                        numColumns={1}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={['#4B59B3']}
                            />
                        }
                    />
                ) : (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="people-outline" size={64} color="#ccc" />
                        <ThemedText style={styles.emptyText}>No newsletters yet</ThemedText>
                        <ThemedText style={styles.emptySubText}>
                            Follow authors to see them here
                        </ThemedText>
                    </View>
                )}
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
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 18,
        fontFamily: 'CoFoRaffineBold',
        color: '#999',
        marginTop: 16,
    },
    emptySubText: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#ccc',
        marginTop: 8,
    },
});