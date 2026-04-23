import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReaderNavbar() {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const [selectedCategory, setSelectedCategory] = useState('Explore');
    const [currentDate, setCurrentDate] = useState('');

    const categories = [
        { id: 1, name: 'Explore', icon: 'compass-outline', route: 'ReaderHome', categoryParam: null },
        { id: 2, name: 'Politics', icon: 'flag-outline', route: 'CategoryStories', categoryParam: 'politics' },
        { id: 3, name: 'Business', icon: 'briefcase-outline', route: 'CategoryStories', categoryParam: 'business' },
        { id: 4, name: 'Finance', icon: 'trending-up-outline', route: 'CategoryStories', categoryParam: 'finance' },
        { id: 5, name: 'Technology', icon: 'hardware-chip-outline', route: 'CategoryStories', categoryParam: 'technology' },
        { id: 6, name: 'Culture', icon: 'color-palette-outline', route: 'CategoryStories', categoryParam: 'culture' },
        { id: 7, name: 'Travel', icon: 'airplane-outline', route: 'CategoryStories', categoryParam: 'travel' },
        { id: 8, name: 'Gastronomy', icon: 'restaurant-outline', route: 'CategoryStories', categoryParam: 'gastronomy' },
        { id: 10, name: 'Live News', icon: 'radio-outline', route: 'LiveNews', categoryParam: null },
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

    const handleCategoryPress = async (category) => {
        setSelectedCategory(category.name);
        
        if (category.route === 'ReaderHome') {
            navigation.navigate('ReaderHome');
        } else if (category.route === 'CategoryStories') {
            navigation.navigate('CategoryStories', { 
                category: category.name,
                categoryId: category.categoryParam 
            });
        } else if (category.route === 'PodcastHome') {
            navigation.navigate('PodcastHome');
        } else if (category.route === 'LiveNews') {
            navigation.navigate('LiveNews');
        }
    };

    const handleNotificationPress = () => {
        navigation.navigate('Notifications');
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

                    {/* Right Side - Notification Icon */}
                    <View style={styles.rightContainer}>
                        <TouchableOpacity 
                            style={styles.notificationButton}
                            onPress={handleNotificationPress}
                        >
                            <Ionicons name="notifications-outline" size={28} color={colors.text} />
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
                                onPress={() => handleCategoryPress(category)}
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
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
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
    notificationButton: {
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
});