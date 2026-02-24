import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Saved({ navigation }) {
    const { colors } = useTheme();
    const [activeTab, setActiveTab] = useState('Saved');

    // Saved items data
    const savedItems = [
        {
            id: '1',
            title: 'The Future of Digital Media and the Changing Voice of Independent Journalists',
            date: '20 January',
            type: 'Story',
            image: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80',
        },
        {
            id: '2',
            title: 'The Future of Digital Media and the Changing Voice of Independent Journalists',
            date: '20 January',
            type: 'History',
            image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        },
        {
            id: '3',
            title: 'The Future of Digital Media and the Changing Voice of Independent Journalists',
            date: '20 January',
            type: 'Story',
            image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        },
    ];

    const renderLibraryItem = ({ item }) => (
        <TouchableOpacity style={styles.libraryItem}>
            <Image source={{ uri: item.image }} style={styles.libraryImage} />
            <View style={styles.libraryContent}>
                <ThemedText style={styles.libraryTitle}>{item.title}</ThemedText>
                <ThemedText style={styles.libraryMeta}>{item.date} · {item.type}</ThemedText>
            </View>
            {/* <TouchableOpacity style={styles.menuButton}>
                <Ionicons name="ellipsis-vertical" size={16} color="#999" />
            </TouchableOpacity> */}
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
                    <ThemedText style={styles.headerTitle}>Library</ThemedText>
                    <View style={{ width: 40 }} />
                </View>

                {/* Tabs - Read Later | Saved */}
                {/* <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'Read Later' && styles.activeTab]}
                        onPress={() => {
                            setActiveTab('Read Later');
                            navigation.navigate('ReadLater');
                        }}
                    >
                        <Ionicons 
                            name="time-outline" 
                            size={18} 
                            color={activeTab === 'Read Later' ? '#FFFFFF' : '#4B59B3'} 
                        />
                        <ThemedText style={[styles.tabText, activeTab === 'Read Later' && styles.activeTabText]}>
                            Read Later
                        </ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'Saved' && styles.activeTab]}
                        onPress={() => setActiveTab('Saved')}
                    >
                        <Ionicons 
                            name="bookmark-outline" 
                            size={18} 
                            color={activeTab === 'Saved' ? '#FFFFFF' : '#4B59B3'} 
                        />
                        <ThemedText style={[styles.tabText, activeTab === 'Saved' && styles.activeTabText]}>
                            Saved
                        </ThemedText>
                    </TouchableOpacity>
                </View> */}

                {/* Saved Content */}
                <View style={styles.savedSection}>
                    <View style={{flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 8}}>
                        <MaterialIcons name="save" size={36} color="#8E44AD" />
                        <ThemedText style={styles.savedTitle}>Saved</ThemedText>
                    </View>
                    <ThemedText style={styles.savedDescription}>
                        You can save your favorite issues and stories to this list.
                    </ThemedText>

                    <TouchableOpacity style={styles.privateButton}>
                        <Ionicons name="lock-closed-outline" size={16} color="#666" />
                        <ThemedText style={styles.privateText}>Private</ThemedText>
                    </TouchableOpacity>

                    <FlatList
                        data={savedItems}
                        renderItem={renderLibraryItem}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                    />
                </View>
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
        fontSize: 24,
        fontWeight: '400',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#4B59B3',
        gap: 6,
        backgroundColor: '#FFFFFF',
    },
    activeTab: {
        backgroundColor: '#4B59B3',
        borderColor: '#4B59B3',
    },
    tabText: {
        fontSize: 14,
        fontFamily: 'CoFoRaffineMedium',
        color: '#4B59B3',
    },
    activeTabText: {
        color: '#FFFFFF',
    },
    savedSection: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    savedTitle: {
        fontSize: 24,
        fontWeight: '400',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        // marginBottom: 8,
    },
    savedDescription: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#666',
        lineHeight: 20,
        marginBottom: 16,
    },
    privateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 24,
    },
    privateText: {
        fontSize: 14,
        fontFamily: 'CoFoRaffineMedium',
        color: '#666',
    },
    listContent: {
        gap: 16,
        paddingBottom: 20,
    },
    libraryItem: {
        flexDirection: 'row',
        gap: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        alignItems: 'center',
        backgroundColor: '#fff',
        elevation: 1,
        borderRadius: 8
    },
    libraryImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },
    libraryContent: {
        flex: 1,
    },
    libraryTitle: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#333',
        marginBottom: 4,
        lineHeight: 18,
    },
    libraryMeta: {
        fontSize: 12,
        fontFamily: 'tenez',
        color: '#999',
    },
    menuButton: {
        padding: 8,
    },
});