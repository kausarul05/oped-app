import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
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

    const categories = [
        {
            id: 1,
            title: 'Culture',
            description: 'Arts, lifestyle, traditions, and cultural perspectives',
            icon: 'color-palette-outline',
            color: '#FF6B6B',
        },
        {
            id: 2,
            title: 'Travel',
            description: 'Destinations, experiences, and travel inspiration',
            icon: 'airplane-outline',
            color: '#4ECDC4',
        },
        {
            id: 3,
            title: 'Finance',
            description: 'Financial news, markets, and economic insights',
            icon: 'trending-up-outline',
            color: '#FFD93D',
        },
        {
            id: 4,
            title: 'Politics',
            description: 'Politics-related articles, analysis, and publications',
            icon: 'flag-outline',
            color: '#6C5CE7',
        },
        {
            id: 5,
            title: 'Business',
            description: 'Market news, companies, and global business insights',
            icon: 'briefcase-outline',
            color: '#A8E6CF',
        },
    ];

    const renderCategory = ({ item }) => (
        <TouchableOpacity 
            style={styles.categoryCard}
            onPress={() => navigation.navigate('CategoryStories', { category: item.title })}
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
                        returnKeyType="search"
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