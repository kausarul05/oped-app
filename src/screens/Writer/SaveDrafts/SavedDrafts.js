import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
    FlatList,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SavedDrafts({ navigation }) {
    const { colors } = useTheme();
    const [activeTab, setActiveTab] = useState('Publish Status');
    const [menuVisible, setMenuVisible] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const scrollViewRef = useRef(null);

    // All tabs
    const tabs = [
        'Publish Status',
        'Scheduled',
        'Request Revision',
        'Draft (10)',
        'Save (8)',
        'Rejected'
    ];

    const gradientColors = ['#343E87', '#3448D6', '#343E87'];

    // Different data for each tab
    const getTabData = () => {
        switch (activeTab) {
            case 'Publish Status':
                return publishStatusData;
            case 'Scheduled':
                return scheduledData;
            case 'Request Revision':
                return requestRevisionData;
            case 'Draft (10)':
                return draftData;
            case 'Save (8)':
                return saveData;
            case 'Rejected':
                return rejectedData;
            default:
                return publishStatusData;
        }
    };

    // Publish Status Data
    const publishStatusData = [
        {
            id: 'p1',
            title: 'Why Subscription-Based Content Is Growing Fast.',
            description: 'As technology evolves and reader habits shift, independ...',
            date: '25 January, 10:00 AM',
            image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        },
        {
            id: 'p2',
            title: 'The Future of Digital Media',
            description: 'Digital platforms are redefining how stories are told...',
            date: '24 January, 2:30 PM',
            image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        },
        {
            id: 'p3',
            title: 'AI-Powered Journalism',
            description: 'How artificial intelligence is transforming newsrooms...',
            date: '23 January, 11:15 AM',
            image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        },
        {
            id: 'p4',
            title: 'The Rise of Podcasting',
            description: 'Audio content is becoming the preferred medium for many...',
            date: '22 January, 3:45 PM',
            image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        },
        {
            id: 'p5',
            title: 'Digital Advertising Trends 2026',
            description: 'New strategies for monetizing content in a changing...',
            date: '21 January, 9:20 AM',
            image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
        },
        {
            id: 'p6',
            title: 'Climate Change Reporting',
            description: 'How journalists are covering the biggest story of our...',
            date: '20 January, 1:10 PM',
            image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2027&q=80',
        },
        {
            id: 'p7',
            title: 'Social Media Impact on News',
            description: 'How platforms are changing the way we consume news...',
            date: '19 January, 4:30 PM',
            image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
        },
        {
            id: 'p8',
            title: 'Local News Revival',
            description: 'Community journalism is making a comeback...',
            date: '18 January, 10:45 AM',
            image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        },
        {
            id: 'p9',
            title: 'Investigative Journalism in 2026',
            description: 'New tools and techniques for deep reporting...',
            date: '17 January, 2:15 PM',
            image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1973&q=80',
        },
        {
            id: 'p10',
            title: 'The Future of Newsletters',
            description: 'Why email is becoming the most personal news platform...',
            date: '16 January, 11:30 AM',
            image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
        },
    ];
    
    // Scheduled Data
    const scheduledData = [
        {
            id: 's1',
            title: 'Understanding Reader Habits',
            description: 'How readers consume content in the digital age...',
            date: '26 January, 9:00 AM',
            image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        },
        {
            id: 's2',
            title: 'The Rise of Independent Journalism',
            description: 'Independent platforms are gaining trust worldwide...',
            date: '27 January, 11:30 AM',
            image: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80',
        },
    ];

    // Request Revision Data (with View Feedback button)
    const requestRevisionData = [
        {
            id: 'r1',
            title: 'AI in Modern Journalism',
            description: 'How artificial intelligence is changing newsrooms...',
            image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            hasFeedback: true,
        },
        {
            id: 'r2',
            title: 'Climate Change Coverage',
            description: 'New approaches to environmental journalism...',
            image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            hasFeedback: true,
        },
    ];

    // Draft Data (no time, no feedback)
    const draftData = [
        {
            id: 'd1',
            title: 'Local News Evolution',
            description: 'How local newspapers are adapting to digital...',
            image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        },
        {
            id: 'd2',
            title: 'Podcasting Trends 2026',
            description: 'What\'s next in the world of audio content...',
            image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        },
    ];

    // Save Data (no time, no feedback)
    const saveData = [
        {
            id: 'sv1',
            title: 'Media Ethics Today',
            description: 'Navigating ethical challenges in modern media...',
            image: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80',
        },
        {
            id: 'sv2',
            title: 'Digital Subscription Models',
            description: 'How to grow your subscriber base...',
            image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        },
    ];

    // Rejected Data (no time, no feedback)
    const rejectedData = [
        {
            id: 'rj1',
            title: 'Controversial Opinion Piece',
            description: 'This article did not meet our guidelines...',
            image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        },
        {
            id: 'rj2',
            title: 'Unverified Sources',
            description: 'Article rejected due to fact-checking issues...',
            image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        },
    ];

    const handleThreeDotPress = (itemId) => {
        setSelectedItem(itemId);
        setMenuVisible(true);
    };

    const handleMenuOption = (option) => {
        setMenuVisible(false);
        console.log(`${option} clicked for item ${selectedItem}`);
        // Add your logic here for each option
    };

    const getMenuOptions = () => {
        // For Draft, Save, Rejected tabs - show all options
        if (activeTab === 'Draft (10)' || activeTab === 'Save (8)' || activeTab === 'Rejected') {
            return [
                { icon: 'send-outline', label: 'Send to Editor', color: '#000' },
                { icon: 'create-outline', label: 'Edit', color: '#000' },
                { icon: 'document-text-outline', label: 'Draft', color: '#000' },
                { icon: 'bookmark-outline', label: 'Save', color: '#000' },
                { icon: 'trash-outline', label: 'Delete', color: '#FF3B30' },
            ];
        } else {
            // For other tabs - keep original options
            return [
                { icon: 'create-outline', label: 'Edit', color: '#000' },
                { icon: 'document-text-outline', label: 'Draft', color: '#000' },
                { icon: 'bookmark-outline', label: 'Save', color: '#000' },
                { icon: 'trash-outline', label: 'Delete', color: '#FF3B30' },
            ];
        }
    };

    const renderDraftItem = ({ item }) => {
        // Check if current tab is Request Revision
        const isRequestRevision = activeTab === 'Request Revision';
        // Check if current tab should show time (Publish Status, Scheduled)
        const showTime = activeTab === 'Publish Status' || activeTab === 'Scheduled';

        return (
            <TouchableOpacity style={styles.draftItem}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    {/* Show date/time only for Publish Status and Scheduled tabs */}
                    {showTime && item.date && (
                        <ThemedText style={styles.draftDate}>{item.date}</ThemedText>
                    )}

                    {/* Show View Feedback button only for Request Revision tab */}
                    {isRequestRevision && (
                        <TouchableOpacity style={styles.feedbackButton}>
                            <ThemedText style={styles.feedbackButtonText}>View Feedback</ThemedText>
                        </TouchableOpacity>
                    )}

                    {!showTime && !isRequestRevision && (
                        <View />
                    )}

                    <TouchableOpacity
                        style={styles.menuButton}
                        onPress={() => handleThreeDotPress(item.id)}
                    >
                        <Ionicons name="ellipsis-horizontal" size={16} color="#999" />
                    </TouchableOpacity>
                </View>
                <View style={styles.draftContent}>
                    <View style={{ width: '70%' }}>
                        <ThemedText style={styles.draftTitle}>{item.title}</ThemedText>
                        <ThemedText style={styles.draftDescription}>{item.description}</ThemedText>
                    </View>
                    <View style={{ width: '25%' }}>
                        {/* Image on the right side */}
                        <Image source={{ uri: item.image }} style={styles.draftImage} />
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const menuOptions = getMenuOptions();

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <ThemedText style={styles.headerTitle}>Save & Draft</ThemedText>
                    {/* <TouchableOpacity style={styles.searchButton}>
                        <Ionicons name="search-outline" size={24} color="#000" />
                    </TouchableOpacity> */}
                    <View />
                </View>

                {/* Horizontal Scroll Tabs */}
                <View style={styles.tabsWrapper}>
                    <ScrollView
                        ref={scrollViewRef}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.tabsScrollContent}
                    >
                        {tabs.map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                onPress={() => setActiveTab(tab)}
                                style={styles.tabContainer}
                            >
                                {activeTab === tab ? (
                                    <LinearGradient
                                        colors={gradientColors}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.activeTabGradient}
                                    >
                                        <ThemedText style={styles.activeTabText}>
                                            {tab}
                                        </ThemedText>
                                    </LinearGradient>
                                ) : (
                                    <View style={[styles.inactiveTab, { borderColor: '#343E87' }]}>
                                        <ThemedText style={styles.inactiveTabText}>
                                            {tab}
                                        </ThemedText>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Drafts List */}
                <FlatList
                    data={getTabData()}
                    renderItem={renderDraftItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            </SafeAreaView>

            {/* Three Dot Menu Modal */}
            <Modal
                visible={menuVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setMenuVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setMenuVisible(false)}
                >
                    <View style={styles.menuContainer}>
                        {menuOptions.map((option, index) => (
                            <React.Fragment key={option.label}>
                                <TouchableOpacity
                                    style={styles.menuItem}
                                    onPress={() => handleMenuOption(option.label)}
                                >
                                    <Ionicons name={option.icon} size={20} color={option.color} />
                                    <ThemedText style={[styles.menuText, option.label === 'Delete' && styles.deleteText]}>
                                        {option.label}
                                    </ThemedText>
                                </TouchableOpacity>
                                {index < menuOptions.length - 1 && <View style={styles.menuDivider} />}
                            </React.Fragment>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
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
    searchButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabsWrapper: {
        paddingVertical: 12,
        // borderBottomWidth: 1,
        // borderBottomColor: '#F0F0F0',
    },
    tabsScrollContent: {
        paddingHorizontal: 16,
        gap: 12,
    },
    tabContainer: {
        marginRight: 8,
    },
    activeTabGradient: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 25,
        shadowColor: '#343E87',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#343E87',
    },
    activeTabText: {
        fontSize: 16,
        fontFamily: 'CoFoRaffineBold',
        color: '#FFFFFF',
        letterSpacing: 1
    },
    inactiveTab: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 25,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#343E87',
    },
    inactiveTabText: {
        fontSize: 16,
        fontFamily: 'CoFoRaffineMedium',
        color: '#666',
        letterSpacing: 1
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginBottom: 8,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 20,
    },
    draftItem: {
        // flexDirection: 'row',
        // alignItems: 'center',
        // paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        gap: 12,
        backgroundColor: '#fff',
        elevation: 1,
        marginBottom: 16,
        borderRadius: 8,
        padding: 8
    },
    draftContent: {
        // flex: 1,
        flexDirection: "row",
        justifyContent: 'space-between',
        gap: 12
    },
    draftDate: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#000',
        marginBottom: 4,
        backgroundColor: '#AAB44F1A',
        padding: 4,
        borderRadius: 25,
        paddingHorizontal: 8,
        letterSpacing: 1
    },
    draftTitle: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        marginBottom: 4,
        letterSpacing: 1
    },
    draftDescription: {
        fontSize: 13,
        fontFamily: 'tenez',
        color: '#666',
        lineHeight: 18,
        marginBottom: 8,
        letterSpacing: 1
    },
    draftImage: {
        width: 90,
        height: 90,
        borderRadius: 8,
    },
    menuButton: {
        padding: 4,
    },
    feedbackButton: {
        backgroundColor: '#e9ecff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        alignSelf: 'flex-start',
        // marginTop: 4,
    },
    feedbackButtonText: {
        fontSize: 12,
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 8,
        width: '80%',
        maxWidth: 300,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
    },
    menuText: {
        fontSize: 16,
        fontFamily: 'CoFoRaffineMedium',
        color: '#000',
    },
    menuDivider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginHorizontal: 16,
    },
    deleteText: {
        color: '#FF3B30',
    },
});