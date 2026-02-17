import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Image, Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReaderNavbar() {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const [selectedCategory, setSelectedCategory] = useState('Explorer');
    const [currentDate, setCurrentDate] = useState('');
    const [searchModalVisible, setSearchModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const categories = [
        { id: 1, name: 'Explorer', icon: 'compass-outline' },
        { id: 2, name: 'Culture', icon: 'color-palette-outline' },
        { id: 3, name: 'Travel', icon: 'airplane-outline' },
        { id: 4, name: 'Finance', icon: 'trending-up-outline' },
        { id: 5, name: 'Politics', icon: 'flag-outline' },
        { id: 6, name: 'Business', icon: 'briefcase-outline' },
    ];

    useEffect(() => {
        const updateDate = () => {
            const now = new Date();
            const options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };
            const formattedDate = now.toLocaleDateString('en-US', options);
            setCurrentDate(formattedDate);
        };

        updateDate();
        const interval = setInterval(updateDate, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            setSearchModalVisible(false);
            // Navigate to search results screen with query
            navigation.navigate('SearchResults', { query: searchQuery });
        }
    };

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                {/* Header Section */}
                <View style={styles.header}>
                    {/* Left Side - Logo and Date */}
                    <View style={styles.leftContainer}>
                        {/* Logo */}
                        <View style={styles.logoContainer}>
                            <Image
                                source={require('../../../../assets/images/logo-resize.png')}
                                style={styles.logo}
                            />
                        </View>

                        {/* Date */}
                        <ThemedText style={styles.date}>{currentDate}</ThemedText>
                    </View>

                    {/* Right Side - Search Icon */}
                    <View style={styles.rightContainer}>
                        <TouchableOpacity 
                            style={styles.searchButton}
                            onPress={() => setSearchModalVisible(true)}
                        >
                            <Ionicons name="search-outline" size={28} color={colors.text} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Categories Navigation */}
                <View style={styles.categoriesContainer}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoriesScroll}
                    >
                        {categories.map((category) => (
                            <TouchableOpacity
                                key={category.id}
                                style={[
                                    styles.categoryItem,
                                    selectedCategory === category.name && styles.selectedCategoryItem,
                                ]}
                                onPress={() => setSelectedCategory(category.name)}
                            >
                                <Ionicons
                                    name={category.icon}
                                    size={20}
                                    color={selectedCategory === category.name ? '#4B59B3' : colors.textSecondary}
                                />
                                <ThemedText
                                    style={[
                                        styles.categoryText,
                                        {
                                            color: selectedCategory === category.name ? '#4B59B3' : colors.text,
                                        }
                                    ]}
                                >
                                    {category.name}
                                </ThemedText>
                                {selectedCategory === category.name && (
                                    <View style={[styles.activeIndicator, { backgroundColor: '#4B59B3' }]} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </SafeAreaView>

            {/* Search Modal */}
            <Modal
                animationType="slide"
                transparent={false}
                visible={searchModalVisible}
                onRequestClose={() => setSearchModalVisible(false)}
            >
                <ThemedView style={styles.modalContainer}>
                    <SafeAreaView style={styles.modalSafeArea}>
                        {/* Modal Header */}
                        <View style={styles.modalHeader}>
                            <TouchableOpacity 
                                onPress={() => setSearchModalVisible(false)}
                                style={styles.modalBackButton}
                            >
                                <Ionicons name="arrow-back" size={24} color={colors.text} />
                            </TouchableOpacity>
                            <ThemedText style={styles.modalTitle}>Search</ThemedText>
                            <View style={{ width: 40 }} />
                        </View>

                        {/* Search Input */}
                        <View style={styles.searchInputContainer}>
                            <Ionicons name="search-outline" size={20} color={colors.textSecondary} style={styles.searchInputIcon} />
                            <TextInput
                                style={[
                                    styles.searchInput,
                                    {
                                        color: colors.text,
                                        borderColor: colors.border,
                                        backgroundColor: colors.inputBackground,
                                    }
                                ]}
                                placeholder="Search articles, topics..."
                                placeholderTextColor={colors.textTertiary}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                autoFocus={true}
                                returnKeyType="search"
                                onSubmitEditing={handleSearch}
                            />
                            {searchQuery.length > 0 && (
                                <TouchableOpacity onPress={() => setSearchQuery('')}>
                                    <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Recent Searches or Suggestions */}
                        <View style={styles.recentContainer}>
                            <ThemedText style={styles.recentTitle}>Recent Searches</ThemedText>
                            
                            {/* Example recent searches */}
                            {['Technology', 'World News', 'Economy'].map((item, index) => (
                                <TouchableOpacity 
                                    key={index}
                                    style={styles.recentItem}
                                    onPress={() => {
                                        setSearchQuery(item);
                                        setTimeout(() => {
                                            setSearchModalVisible(false);
                                            navigation.navigate('SearchResults', { query: item });
                                        }, 300);
                                    }}
                                >
                                    <Ionicons name="time-outline" size={18} color={colors.textSecondary} />
                                    <ThemedText style={styles.recentItemText}>{item}</ThemedText>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Popular Topics */}
                        <View style={styles.popularContainer}>
                            <ThemedText style={styles.popularTitle}>Popular Topics</ThemedText>
                            <View style={styles.popularTags}>
                                {['Breaking News', 'Trending', 'Latest', 'Editor\'s Pick'].map((tag, index) => (
                                    <TouchableOpacity 
                                        key={index}
                                        style={[styles.popularTag, { borderColor: colors.border }]}
                                        onPress={() => {
                                            setSearchQuery(tag);
                                            setTimeout(() => {
                                                setSearchModalVisible(false);
                                                navigation.navigate('SearchResults', { query: tag });
                                            }, 300);
                                        }}
                                    >
                                        <ThemedText style={styles.popularTagText}>{tag}</ThemedText>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </SafeAreaView>
                </ThemedView>
            </Modal>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: 'transparent',
    },
    safeArea: {
        backgroundColor: 'transparent',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    leftContainer: {
        flex: 1,
        flexDirection: 'column',
        gap: 4,
    },
    logoContainer: {
        // No background needed
    },
    logo: {
        width: 100,
        height: 40,
        resizeMode: 'contain',
    },
    date: {
        fontSize: 14,
        fontWeight: '400',
        fontFamily: 'tenez',
        letterSpacing: 0.5,
    },
    rightContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    categoriesContainer: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#0000001A',
    },
    categoriesScroll: {
        paddingHorizontal: 16,
        gap: 20,
    },
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        gap: 6,
        position: 'relative',
    },
    selectedCategoryItem: {
        // No background, just indicator below
        borderBottomWidth: 1,
        borderBottomColor: '#4B59B3',
    },
    activeIndicator: {
        position: 'absolute',
        bottom: -8,
        left: 0,
        right: 0,
        height: 2,
        borderRadius: 1,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '500',
        fontFamily: 'CoFoRaffineMedium',
        letterSpacing: 0.5,
    },
    // Modal Styles
    modalContainer: {
        flex: 1,
    },
    modalSafeArea: {
        flex: 1,
        paddingHorizontal: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#0000001A',
    },
    modalBackButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    searchInputIcon: {
        position: 'absolute',
        left: 12,
        zIndex: 1,
    },
    searchInput: {
        flex: 1,
        height: 50,
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 40,
        fontSize: 16,
        fontFamily: 'CoFoRaffineMedium',
    },
    recentContainer: {
        marginBottom: 30,
    },
    recentTitle: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        marginBottom: 16,
    },
    recentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        gap: 12,
    },
    recentItemText: {
        fontSize: 15,
        fontFamily: 'CoFoRaffineMedium',
    },
    popularContainer: {
        marginBottom: 30,
    },
    popularTitle: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        marginBottom: 16,
    },
    popularTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    popularTag: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderWidth: 1,
        borderRadius: 20,
    },
    popularTagText: {
        fontSize: 14,
        fontFamily: 'CoFoRaffineMedium',
    },
});