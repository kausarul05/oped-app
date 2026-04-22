import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import RenderHTML from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';
import settingsService from '../../../../services/settingsService';

export default function AboutUs({ navigation }) {
    const { width } = useWindowDimensions();
    const { colors } = useTheme();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const result = await settingsService.getSettings();
            if (result.success && result.data) {
                setContent(result.data.aboutUs);
            } else {
                setContent("");
            }
        } catch (error) {
            console.error('Error fetching about us:', error);
            setContent("");
        } finally {
            setLoading(false);
        }
    };

    const getDefaultContent = () => {
        return `
            <h1>About OPED</h1>
            
            <p>HOPED is a premier digital media platform dedicated to delivering high-quality journalism, podcasts, and cultural content to readers around the world. Founded in 2020, we've grown from a small blog to a trusted source for independent journalism.</p>
            
            <h2>Our Mission</h2>
            <p>Our mission is to provide thoughtful, well-researched, and engaging content that informs, inspires, and empowers our readers. We believe in the power of storytelling to connect people and create positive change.</p>
            
            <h2>Our Values</h2>
            <ul>
                <li><strong>Integrity:</strong> We uphold the highest journalistic standards and ethics.</li>
                <li><strong>Independence:</strong> We maintain editorial independence and freedom.</li>
                <li><strong>Innovation:</strong> We embrace new technologies and storytelling formats.</li>
                <li><strong>Inclusivity:</strong> We celebrate diverse voices and perspectives.</li>
            </ul>
            
            <h2>Contact Information</h2>
            <p><strong>Email:</strong> hello@hoped.com<br>
            <strong>Phone:</strong> +1 (555) 123-4567<br>
            <strong>Address:</strong> 123 Media Street, New York, NY 10001</p>
        `;
    };

    const htmlStyles = {
        h1: {
            fontSize: 24,
            fontWeight: '400',
            fontFamily: 'CoFoRaffineBold',
            color: '#000',
            marginBottom: 12,
            marginTop: 8,
        },
        h2: {
            fontSize: 20,
            fontWeight: '600',
            fontFamily: 'CoFoRaffineBold',
            color: '#000',
            marginBottom: 8,
            marginTop: 16,
        },
        p: {
            fontSize: 16,
            fontFamily: 'tenez',
            color: '#444',
            lineHeight: 24,
            marginBottom: 12,
        },
        ul: {
            marginBottom: 12,
            paddingLeft: 20,
        },
        li: {
            fontSize: 16,
            fontFamily: 'tenez',
            color: '#444',
            lineHeight: 24,
            marginBottom: 4,
        },
        strong: {
            fontFamily: 'CoFoRaffineBold',
            fontWeight: '600',
        },
    };

    if (loading) {
        return (
            <ThemedView style={[styles.container, styles.centerContainer]}>
                <ActivityIndicator size="large" color="#4B59B3" />
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <ThemedText style={styles.headerTitle}>About Us</ThemedText>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView 
                    showsVerticalScrollIndicator={false} 
                    contentContainerStyle={styles.scrollContent}
                >
                    <RenderHTML
                        contentWidth={width - 32}
                        source={{ html: content }}
                        tagsStyles={htmlStyles}
                        defaultTextProps={{
                            style: { fontFamily: 'tenez' }
                        }}
                    />
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
    centerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
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
    scrollContent: {
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
});