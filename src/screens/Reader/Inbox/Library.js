import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import {
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Library({ navigation }) {
    const { colors } = useTheme();

    // Recently Read data
    const recentlyReadItems = [
        {
            id: '1',
            title: 'The Future of Digital Media and the Changing Voice of Independent Journalists',
            date: '20 January',
            type: 'Story',
            image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        },
        {
            id: '2',
            title: 'The Future of Digital Media and the Changing Voice of Independent Journalists',
            date: '20 January',
            type: 'History',
            image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        },
        {
            id: '3',
            title: 'The Future of Digital Media and the Changing Voice of Independent Journalists',
            date: '20 January',
            type: 'Story',
            image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
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

                {/* Tabs - Read Later | Saved with Icons */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        style={styles.tab}
                        onPress={() => navigation.navigate('ReadLater')}
                    >
                        <Ionicons name="bookmark-outline" size={22} color="#0000" />
                        <ThemedText style={styles.tabText}>Read Later</ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tab, {backgroundColor: '#8E44AD1A'}]}
                        onPress={() => navigation.navigate('Saved')}
                    >
                        <MaterialIcons name="save" size={22} color="black" />
                        <ThemedText style={styles.tabText}>Saved</ThemedText>
                    </TouchableOpacity>
                </View>

                {/* Recently Read Section */}
                <View style={styles.recentSection}>
                    <ThemedText style={styles.recentTitle}>Recently Read</ThemedText>
                    
                    <FlatList
                        data={recentlyReadItems}
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
        paddingVertical: 22,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#27AE601A',
        gap: 8,
        backgroundColor: '#27AE601A',
        // elevation: 1,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.1,
        // shadowRadius: 2,
    },
    tabText: {
        fontSize: 18,
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
    },
    recentSection: {
        flex: 1,
        paddingTop: 20,
    },
    recentTitle: {
        fontSize: 18,
        fontWeight: '400',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    listContent: {
        paddingHorizontal: 16,
        gap: 16,
        paddingBottom: 20,
    },
    libraryItem: {
        flexDirection: 'row',
        gap: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        backgroundColor: '#fff',
        alignItems: 'center',
        elevation: 1,
        padding: 4,
        borderRadius: 8,
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