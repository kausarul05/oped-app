import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthorProfile({ route, navigation }) {
    const { colors } = useTheme();
    const [activeTab, setActiveTab] = useState('Stories');
    
    // Mock author data
    const author = {
        id: '1',
        name: 'Eric Lach',
        formerTitle: 'FORMERLY MasterChef',
        coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2020&q=80',
        profileImage: 'https://randomuser.me/api/portraits/women/1.jpg',
        bio: 'Katy Waldman is a culture and lifestyle writer who explores modern trends, human stories, and creative perspectives. Her writing focuses on thoughtful analysis and engaging storytelling. She brings clarity and insight to complex topics through well-researched and compelling articles.',
    };

    // Mock stories data
    const stories = [
        {
            id: '1',
            title: 'The Future of Digital Media and the Changing Voice of Independent Journal...',
            type: 'Featured Story',
            image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        },
        {
            id: '2',
            title: 'The Future of Digital Media and the Changing Voice of Independent Journal...',
            type: 'Featured Article',
            image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        },
        {
            id: '3',
            title: 'The Future of Digital Media and the Changing Voice of Independent Journal...',
            type: 'Featuring Story',
            image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        },
        {
            id: '4',
            title: 'The Future of Digital Media and the Changing Voice of Independent Journal...',
            type: 'Featured Story',
            image: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80',
        },
        {
            id: '5',
            title: 'The Future of Digital Media and the Changing Voice of Independent Journal...',
            type: 'Featuring Story',
            image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        },
    ];

    // Mock podcasts data
    const podcasts = [
        {
            id: '1',
            title: 'The Future of Digital Media and the Changing Voice of Independent Journal...',
            type: 'Featured Podcast',
            image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        },
        {
            id: '2',
            title: 'The Future of Digital Media and the Changing Voice of Independent Journal...',
            type: 'Featured Podcast',
            image: 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        },
        {
            id: '3',
            title: 'The Future of Digital Media and the Changing Voice of Independent Journal...',
            type: 'Featured Podcast',
            image: 'https://images.unsplash.com/photo-1590602847861-f3579e41b79e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        },
    ];

    const renderStoryItem = ({ item }) => (
        <TouchableOpacity style={styles.storyItem}>
            <Image source={{ uri: item.image }} style={styles.storyImage} />
            <View style={styles.storyContent}>
                <ThemedText style={styles.storyTitle}>{item.title}</ThemedText>
                <ThemedText style={styles.storyType}>{item.type}</ThemedText>
            </View>
        </TouchableOpacity>
    );

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* Header with Back Button */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <ThemedText style={styles.headerTitle}>Author Profile</ThemedText>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Cover Image */}
                    <Image source={{ uri: author.coverImage }} style={styles.coverImage} />

                    {/* Profile Info Section */}
                    <View style={styles.profileInfoContainer}>
                        {/* Profile Image - Positioned to overlap cover */}
                        <View style={styles.profileImageWrapper}>
                            <Image source={{ uri: author.profileImage }} style={styles.profileImage} />
                        </View>

                        {/* Author Name and Former Title */}
                        <View style={styles.nameContainer}>
                            <ThemedText style={styles.authorName}>{author.name}</ThemedText>
                            <ThemedText style={styles.formerTitle}>{author.formerTitle}</ThemedText>
                        </View>

                        {/* Author Bio */}
                        <ThemedText style={styles.authorBio}>{author.bio}</ThemedText>
                    </View>

                    {/* Stories | Podcasts Tabs */}
                    <View style={styles.tabsContainer}>
                        <TouchableOpacity 
                            style={[styles.tab, activeTab === 'Stories' && styles.activeTab]}
                            onPress={() => setActiveTab('Stories')}
                        >
                            <ThemedText style={[styles.tabText, activeTab === 'Stories' && styles.activeTabText]}>
                                Stories
                            </ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.tab, activeTab === 'Podcasts' && styles.activeTab]}
                            onPress={() => setActiveTab('Podcasts')}
                        >
                            <ThemedText style={[styles.tabText, activeTab === 'Podcasts' && styles.activeTabText]}>
                                Podcasts
                            </ThemedText>
                        </TouchableOpacity>
                    </View>

                    {/* Stories List */}
                    {activeTab === 'Stories' && (
                        <View style={styles.listContainer}>
                            <FlatList
                                data={stories}
                                renderItem={renderStoryItem}
                                keyExtractor={(item) => item.id}
                                scrollEnabled={false}
                                contentContainerStyle={styles.listContent}
                            />
                        </View>
                    )}

                    {/* Podcasts List */}
                    {activeTab === 'Podcasts' && (
                        <View style={styles.listContainer}>
                            <FlatList
                                data={podcasts}
                                renderItem={renderStoryItem}
                                keyExtractor={(item) => item.id}
                                scrollEnabled={false}
                                contentContainerStyle={styles.listContent}
                            />
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        backgroundColor: '#FFFFFF',
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
    coverImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    profileInfoContainer: {
        paddingHorizontal: 16,
        paddingTop: 40, // Space for overlapping profile image
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    profileImageWrapper: {
        position: 'absolute',
        top: -40,
        left: 16,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#FFFFFF',
        backgroundColor: '#FFFFFF',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    nameContainer: {
        marginBottom: 12,
    },
    authorName: {
        fontSize: 24,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        marginBottom: 4,
    },
    formerTitle: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#4B59B3',
        letterSpacing: 0.5,
    },
    authorBio: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#666',
        lineHeight: 20,
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        gap: 24,
    },
    tab: {
        paddingBottom: 8,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#4B59B3',
    },
    tabText: {
        fontSize: 16,
        fontFamily: 'CoFoRaffineMedium',
        color: '#999',
    },
    activeTabText: {
        color: '#4B59B3',
        fontFamily: 'CoFoRaffineBold',
    },
    listContainer: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    listContent: {
        gap: 16,
    },
    storyItem: {
        flexDirection: 'row',
        gap: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    storyImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },
    storyContent: {
        flex: 1,
        justifyContent: 'center',
    },
    storyTitle: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#333',
        marginBottom: 4,
        lineHeight: 18,
    },
    storyType: {
        fontSize: 12,
        fontFamily: 'CoFoRaffineMedium',
        color: '#4B59B3',
    },
});