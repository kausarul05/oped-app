import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import RenderHTML from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacyPolicy({ navigation }) {
    const { width } = useWindowDimensions();
    const { colors } = useTheme();

    const htmlContent = `
        <h1>Privacy Policy</h1>
        <p>Last updated: February 25, 2026</p>
        
        <h2>1. Information We Collect</h2>
        <p>We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us for support. This information may include your name, email address, phone number, and payment information.</p>
        
        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process your transactions and send you related information</li>
            <li>Send you technical notices, updates, security alerts, and support messages</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Personalize your experience on our platform</li>
        </ul>
        
        <h2>3. Sharing of Information</h2>
        <p>We do not share your personal information with third parties except in the following circumstances:</p>
        <ul>
            <li>With your consent</li>
            <li>To comply with laws or to respond to lawful requests and legal process</li>
            <li>To protect the rights and property of HOPED, our users, or others</li>
            <li>In connection with a merger, acquisition, or sale of assets</li>
        </ul>
        
        <h2>4. Data Security</h2>
        <p>We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.</p>
        
        <h2>5. Your Choices</h2>
        <p>You may update, correct, or delete your account information at any time by logging into your account. You may also contact us directly to request access to, correction, or deletion of your personal information.</p>
        
        <h2>6. Changes to This Policy</h2>
        <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page with an updated effective date.</p>
        
        <h2>7. Contact Us</h2>
        <p>If you have any questions about this privacy policy, please contact us at:</p>
        <p>Email: privacy@hoped.com<br>
        Address: 123 Media Street, New York, NY 10001</p>
    `;

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
            fontWeight: '400',
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
    };

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <ThemedText style={styles.headerTitle}>Privacy Policy</ThemedText>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView 
                    showsVerticalScrollIndicator={false} 
                    contentContainerStyle={styles.scrollContent}
                >
                    <RenderHTML
                        contentWidth={width - 32}
                        source={{ html: htmlContent }}
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