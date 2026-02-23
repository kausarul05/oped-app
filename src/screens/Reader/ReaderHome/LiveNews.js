import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LiveNews({ navigation }) {
    const { colors } = useTheme();
    const [refreshing, setRefreshing] = useState(false);
    const [liveTime, setLiveTime] = useState('');

    // Update live time every second
    useEffect(() => {
        const updateLiveTime = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit',
                hour12: false 
            });
            setLiveTime(timeString);
        };

        updateLiveTime();
        const interval = setInterval(updateLiveTime, 1000);
        return () => clearInterval(interval);
    }, []);

    // Live news data matching your image
    const liveNewsData = [
        {
            id: '1',
            time: '15:07',
            title: "Kurtulmuş'tan yeni yıl mesajı: TBMM Başkanı Numun Kurtulmuş, yayımladığı yeni yıl mesajında.",
            description: '"Terörsüz Türkiye" hedefine ulaşmayı umduklarını ifade etti. Kurtulmuş, mesajında Türkiye\'nin terörle mücadelesine vurgu yaparak yeni yılda bu hedef doğrultusunda kararlılığın süreceğini dile getirdi.',
            isBreaking: true,
        },
        {
            id: '2',
            time: '15:07',
            title: 'Adalet Bakanı Tunç\'un açıklaması: Adalet Bakanı Yılmaz Tunç, felç kalma riski bulunduğu belirtilen şehir plancısı Tayfun Kahraman\'ın sağlık durumuna ilişkin son kararı Adli Tıp Kurumu\'nun vereceğini.',
            description: 'Tunç, Kahraman\'ın avukatının kamuoyuna yansıyan "felç kalma riski var" açıklamasının ardından sürecin Adli Tıp raporları doğrultusunda yürütüleceğini ifade etti.',
            isBreaking: false,
        },
        {
            id: '3',
            time: '12:07',
            title: 'Adalet Bakanı Tunç\'un açıklaması: Adalet Bakanı Yılmaz Tunç, felç kalma riski bulunduğu belirtilen şehir plancısı Tayfun Kahraman\'ın sağlık durumuna ilişkin son kararı Adli Tıp Kurumu\'nun vereceğini.',
            description: 'Tunç, Kahraman\'ın avukatının kamuoyuna yansıyan "felç kalma riski var" açıklamasının ardından sürecin Adli Tıp raporları doğrultusunda yürütüleceğini ifade etti.',
            isBreaking: false,
        },
        {
            id: '4',
            time: '10:30',
            title: 'Cumhurbaşkanı Erdoğan\'dan yeni yıl mesajı: Cumhurbaşkanı Recep Tayyip Erdoğan, yayımladığı video mesajında.',
            description: '2024 yılının Türkiye ve tüm insanlık için hayırlara vesile olmasını dileyen Erdoğan, ekonomi ve dış politika başta olmak üzere birçok alanda önemli adımlar atıldığını belirtti.',
            isBreaking: false,
        },
        {
            id: '5',
            time: '09:15',
            title: 'Merkez Bankası faiz kararını açıkladı: Türkiye Cumhuriyet Merkez Bankası (TCMB) Para Politikası Kurulu, politika faizini yüzde 42,5 seviyesinde sabit tuttu.',
            description: 'Kurul, enflasyon görünümünde belirgin ve kalıcı bir iyileşme sağlanana kadar sıkı para politikası duruşunun sürdürüleceğini vurguladı.',
            isBreaking: false,
        },
        {
            id: '6',
            time: '08:45',
            title: 'İstanbul\'da yoğun sis ulaşımı aksattı: Sabah saatlerinden itibaren etkili olan yoğun sis nedeniyle İstanbul Boğazı\'nda gemi trafiği geçici olarak durduruldu.',
            description: 'Havayolu ulaşımında da aksamalar yaşanırken, yetkililer sürücüleri görüş mesafesinin düşük olduğu yollarda dikkatli olmaları konusunda uyardı.',
            isBreaking: false,
        },
    ];

    const onRefresh = () => {
        setRefreshing(true);
        // Simulate fetching new data
        setTimeout(() => {
            setRefreshing(false);
            Alert.alert('Refreshed', 'Live news updated!');
        }, 2000);
    };

    const renderNewsItem = ({ item, index }) => (
        <TouchableOpacity 
            style={[
                styles.newsItem,
                index === 0 && styles.firstNewsItem
            ]}
            onPress={() => Alert.alert('News Detail', item.title)}
        >
            {/* Time Column */}
            <View style={styles.timeColumn}>
                <ThemedText style={styles.timeText}>{item.time}</ThemedText>
                {item.isBreaking && (
                    <View style={styles.breakingBadge}>
                        <ThemedText style={styles.breakingText}>BREAKING</ThemedText>
                    </View>
                )}
            </View>

            {/* Content Column */}
            <View style={styles.contentColumn}>
                <ThemedText style={styles.newsTitle}>{item.title}</ThemedText>
                <ThemedText style={styles.newsDescription}>{item.description}</ThemedText>
                
                {/* Live Indicator for first item */}
                {index === 0 && (
                    <View style={styles.liveIndicator}>
                        <View style={styles.liveDot} />
                        <ThemedText style={styles.liveText}>A few seconds ago</ThemedText>
                    </View>
                )}
            </View>
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
                    <View style={styles.headerTitleContainer}>
                        <ThemedText style={styles.headerTitle}>Live News</ThemedText>
                        <View style={styles.headerLiveIndicator}>
                            <View style={styles.headerLiveDot} />
                            <ThemedText style={styles.headerLiveText}>LIVE</ThemedText>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
                        <Ionicons name="refresh-outline" size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                {/* Live Time Bar */}
                <View style={styles.liveTimeBar}>
                    <Ionicons name="radio-outline" size={18} color="#FF3B30" />
                    <ThemedText style={styles.liveTimeText}>{liveTime}</ThemedText>
                    <View style={styles.liveNowBadge}>
                        <View style={styles.liveNowDot} />
                        <ThemedText style={styles.liveNowText}>LIVE NOW</ThemedText>
                    </View>
                </View>

                {/* News List */}
                <FlatList
                    data={liveNewsData}
                    renderItem={renderNewsItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.newsList}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '400',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
    },
    headerLiveIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF3B30',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    headerLiveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FFFFFF',
    },
    headerLiveText: {
        fontSize: 10,
        fontFamily: 'CoFoRaffineBold',
        color: '#FFFFFF',
    },
    refreshButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    liveTimeBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF0F0',
        paddingHorizontal: 16,
        paddingVertical: 10,
        gap: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#FFE0E0',
    },
    liveTimeText: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#FF3B30',
        flex: 1,
    },
    liveNowBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF3B30',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    liveNowDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FFFFFF',
    },
    liveNowText: {
        fontSize: 10,
        fontFamily: 'CoFoRaffineBold',
        color: '#FFFFFF',
    },
    newsList: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    newsItem: {
        flexDirection: 'row',
        paddingVertical: 16,
    },
    firstNewsItem: {
        backgroundColor: '#FFF9F9',
        borderRadius: 12,
        paddingHorizontal: 12,
        marginHorizontal: -12,
    },
    timeColumn: {
        width: 60,
        marginRight: 12,
    },
    timeText: {
        fontSize: 16,
        fontFamily: 'CoFoRaffineBold',
        color: '#4B59B3',
        marginBottom: 4,
    },
    breakingBadge: {
        backgroundColor: '#FF3B30',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
    breakingText: {
        fontSize: 8,
        fontFamily: 'CoFoRaffineBold',
        color: '#FFFFFF',
    },
    contentColumn: {
        flex: 1,
    },
    newsTitle: {
        fontSize: 14,
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        lineHeight: 20,
        marginBottom: 6,
    },
    newsDescription: {
        fontSize: 13,
        fontFamily: 'tenez',
        color: '#666',
        lineHeight: 18,
    },
    liveIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 6,
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FF3B30',
    },
    liveText: {
        fontSize: 11,
        fontFamily: 'tenez',
        color: '#FF3B30',
    },
    separator: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 8,
    },
});