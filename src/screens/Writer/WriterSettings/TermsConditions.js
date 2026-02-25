import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import RenderHTML from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TermsConditions({ navigation }) {
    const { width } = useWindowDimensions();
    const { colors } = useTheme();

    const htmlContent = `
        <h1>Terms & Conditions</h1>
        <p>Last updated: February 25, 2026</p>
        
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing or using the HOPED application, you agree to be bound by these Terms & Conditions. If you do not agree to all the terms and conditions, you may not access or use our services.</p>
        
        <h2>2. User Accounts</h2>
        <p>When you create an account with us, you must provide accurate, complete, and current information. You are responsible for maintaining the security of your account and for all activities that occur under your account.</p>
        
        <h2>3. Content and Intellectual Property</h2>
        <p>The content on HOPED, including articles, podcasts, and other materials, is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express permission.</p>
        
        <h2>4. User Conduct</h2>
        <p>You agree not to use the service to:</p>
        <ul>
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe upon the rights of others</li>
            <li>Post or transmit any harmful, offensive, or inappropriate content</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Interfere with the proper functioning of the service</li>
        </ul>
        
        <h2>5. Subscriptions and Payments</h2>
        <p>Premium subscriptions are billed on a monthly or yearly basis. All payments are non-refundable except as required by law. You may cancel your subscription at any time, and you will continue to have access until the end of your billing period.</p>
        
        <h2>6. Termination</h2>
        <p>We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms & Conditions or is harmful to other users, us, or third parties.</p>
        
        <h2>7. Limitation of Liability</h2>
        <p>To the maximum extent permitted by law, HOPED shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service.</p>
        
        <h2>8. Changes to Terms</h2>
        <p>We reserve the right to modify these terms at any time. We will provide notice of significant changes by posting the new terms on this page with an updated effective date.</p>
        
        <h2>9. Contact Information</h2>
        <p>If you have any questions about these Terms & Conditions, please contact us at:</p>
        <p>Email: legal@hoped.com<br>
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
    };

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <ThemedText style={styles.headerTitle}>Terms & Conditions</ThemedText>
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