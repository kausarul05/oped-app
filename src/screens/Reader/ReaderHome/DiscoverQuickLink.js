import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    FlatList,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DiscoverQuickLink({ navigation }) {
    const { colors } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');

    const categories = [
        // {
        //     id: 1,
        //     title: 'Explore',
        //     description: 'Discover trending stories and personalized content',
        //     icon: 'compass-outline',
        //     color: '#4B59B3',
        //     route: 'ReaderHome',
        // },
        {
            id: 2,
            title: 'Politics',
            description: 'Political news, analysis, and expert opinions',
            icon: 'flag-outline',
            color: '#6C5CE7',
            route: 'CategoryStories',
            categoryParam: 'politics',
        },
        {
            id: 3,
            title: 'Business',
            description: 'Market news, companies, and global business insights',
            icon: 'briefcase-outline',
            color: '#A8E6CF',
            route: 'CategoryStories',
            categoryParam: 'business',
        },
        {
            id: 4,
            title: 'Finance',
            description: 'Financial news, markets, and economic insights',
            icon: 'trending-up-outline',
            color: '#FFD93D',
            route: 'CategoryStories',
            categoryParam: 'finance',
        },
        {
            id: 5,
            title: 'Technology',
            description: 'Tech innovations, gadgets, and digital trends',
            icon: 'hardware-chip-outline',
            color: '#5856D6',
            route: 'CategoryStories',
            categoryParam: 'technology',
        },
        {
            id: 6,
            title: 'Culture',
            description: 'Arts, lifestyle, traditions, and cultural perspectives',
            icon: 'color-palette-outline',
            color: '#FF6B6B',
            route: 'CategoryStories',
            categoryParam: 'culture',
        },
        {
            id: 7,
            title: 'Travel',
            description: 'Destinations, experiences, and travel inspiration',
            icon: 'airplane-outline',
            color: '#4ECDC4',
            route: 'CategoryStories',
            categoryParam: 'travel',
        },
        {
            id: 8,
            title: 'Gastronomy',
            description: 'Food, cuisine, and culinary experiences',
            icon: 'restaurant-outline',
            color: '#FF6B35',
            route: 'CategoryStories',
            categoryParam: 'gastronomy',
        },
        // {
        //     id: 9,
        //     title: 'Podcasts',
        //     description: 'Audio stories, interviews, and discussions',
        //     icon: 'mic-outline',
        //     color: '#9B59B6',
        //     route: 'PodcastHome',
        // },
        {
            id: 10,
            title: 'Live News',
            description: 'Real-time updates and breaking news',
            icon: 'radio-outline',
            color: '#FF3B30',
            route: 'LiveNews',
        },
    ];

    const handleCategoryPress = (category) => {
        if (category.route === 'ReaderHome') {
            navigation.navigate('ReaderHome');
        } else if (category.route === 'CategoryStories') {
            navigation.navigate('CategoryStories', { 
                category: category.title,
                categoryId: category.categoryParam 
            });
        } else if (category.route === 'PodcastHome') {
            navigation.navigate('PodcastHome');
        } else if (category.route === 'LiveNews') {
            navigation.navigate('LiveNews');
        }
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigation.navigate('SearchResults', { query: searchQuery });
        }
    };

    const renderCategory = ({ item }) => (
        <TouchableOpacity 
            style={styles.categoryCard}
            onPress={() => handleCategoryPress(item)}
        >
            <View style={[styles.categoryIconContainer, { backgroundColor: `${item.color}15` }]}>
                <Ionicons name={item.icon} size={28} color={item.color} />
            </View>
            <View style={styles.categoryContent}>
                <ThemedText style={styles.categoryTitle}>{item.title}</ThemedText>
                <ThemedText style={styles.categoryDescription}>{item.description}</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
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
                    <ThemedText style={styles.headerTitle}>Explore</ThemedText>
                    <View style={{ width: 40 }} />
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search here...."
                        placeholderTextColor="#999"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        returnKeyType="search"
                        onSubmitEditing={handleSearch}
                    />
                </View>

                {/* Discoverer Categories Title */}
                <ThemedText style={styles.categoriesTitle}>Discoverer Categories</ThemedText>

                {/* Categories List */}
                <FlatList
                    data={categories}
                    renderItem={renderCategory}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.categoriesList}
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
        fontSize: 20,
        fontWeight: '400',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginTop: 20,
        marginBottom: 24,
        paddingHorizontal: 12,
        height: 50,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        elevation: 1
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        fontFamily: 'tenez',
        color: '#333',
        paddingVertical: 8,
    },
    categoriesTitle: {
        fontSize: 18,
        fontWeight: '400',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    categoriesList: {
        paddingHorizontal: 16,
        gap: 12,
    },
    categoryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    categoryIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    categoryContent: {
        flex: 1,
    },
    categoryTitle: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        marginBottom: 4,
    },
    categoryDescription: {
        fontSize: 13,
        fontFamily: 'tenez',
        color: '#666',
        lineHeight: 18,
    },
});