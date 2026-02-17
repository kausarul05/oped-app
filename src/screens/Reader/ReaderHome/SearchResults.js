import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SearchResults({ route, navigation }) {
    const { colors } = useTheme();
    const { query } = route.params || { query: '' };

    // Mock search results - replace with actual API call
    const searchResults = [
        { id: 1, title: 'Latest Technology Trends', category: 'Technology', date: '2 hours ago' },
        { id: 2, title: 'World Politics Update', category: 'Politics', date: '5 hours ago' },
        { id: 3, title: 'Business Market Analysis', category: 'Business', date: '1 day ago' },
        { id: 4, title: 'Cultural Events Around World', category: 'Culture', date: '2 days ago' },
    ];

    const renderResultItem = ({ item }) => (
        <TouchableOpacity style={styles.resultItem}>
            <View style={styles.resultContent}>
                <ThemedText style={styles.resultTitle}>{item.title}</ThemedText>
                <View style={styles.resultMeta}>
                    <ThemedText style={styles.resultCategory}>{item.category}</ThemedText>
                    <ThemedText style={styles.resultDate}>• {item.date}</ThemedText>
                </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
    );

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <ThemedText style={styles.headerTitle}>Search Results</ThemedText>
                    <View style={{ width: 40 }} />
                </View>

                {/* Search Query Display */}
                <View style={styles.queryContainer}>
                    <ThemedText style={styles.queryLabel}>Results for:</ThemedText>
                    <ThemedText style={styles.queryText}>"{query}"</ThemedText>
                </View>

                {/* Results List */}
                <FlatList
                    data={searchResults}
                    renderItem={renderResultItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.resultsList}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="search-outline" size={60} color={colors.textSecondary} />
                            <ThemedText style={styles.emptyText}>No results found</ThemedText>
                        </View>
                    }
                />
            </SafeAreaView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#0000001A',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
    },
    queryContainer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#0000001A',
    },
    queryLabel: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#666',
        marginBottom: 4,
    },
    queryText: {
        fontSize: 20,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
    },
    resultsList: {
        padding: 20,
    },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#0000001A',
    },
    resultContent: {
        flex: 1,
    },
    resultTitle: {
        fontSize: 16,
        fontWeight: '500',
        fontFamily: 'CoFoRaffineMedium',
        marginBottom: 6,
    },
    resultMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    resultCategory: {
        fontSize: 13,
        fontFamily: 'tenez',
        color: '#4B59B3',
    },
    resultDate: {
        fontSize: 13,
        fontFamily: 'tenez',
        color: '#999',
        marginLeft: 6,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
    },
    emptyText: {
        fontSize: 16,
        fontFamily: 'CoFoRaffineMedium',
        marginTop: 16,
    },
});