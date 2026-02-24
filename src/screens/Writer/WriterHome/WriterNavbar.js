import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WriterNavbar() {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const [currentDate, setCurrentDate] = useState('');

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
                            onPress={() => navigation.navigate('Notifications')}
                        >
                            <Ionicons name="notifications-outline" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    safeArea: {
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#0000001A',
    },
    leftContainer: {
        flex: 1,
        flexDirection: 'column',
        gap: 4,
    },
    logoContainer: {},
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
});