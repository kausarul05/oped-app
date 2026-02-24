import GradientButton from '@/src/components/GradientButton';
import { ThemedText, ThemedView } from '@/src/components/ThemedComponents';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Subscription({ navigation }) {
    const { colors } = useTheme();
    const [selectedPlan, setSelectedPlan] = useState('monthly');
    const [loading, setLoading] = useState(false);

    const handleSubscribe = () => {
        setLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            Alert.alert(
                'Success', 
                `You have successfully subscribed to the ${selectedPlan === 'monthly' ? 'Monthly' : 'Yearly'} plan!`
            );
        }, 2000);
    };

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <ThemedText style={styles.headerTitle}>Subscription</ThemedText>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Upgrade to Premium Section */}
                    <View style={styles.upgradeSection}>
                        <ThemedText style={styles.upgradeTitle}>Upgrade to Premium</ThemedText>
                        <ThemedText style={styles.upgradeDescription}>
                            Enjoy premium articles, saved stories, and personalized reading.
                        </ThemedText>
                    </View>

                    {/* Monthly Plan */}
                    <TouchableOpacity 
                        style={[
                            styles.planCard,
                            selectedPlan === 'monthly' && styles.selectedPlanCard
                        ]}
                        onPress={() => setSelectedPlan('monthly')}
                    >
                        <View style={styles.planHeader}>
                            <ThemedText style={styles.planName}>Monthly</ThemedText>
                            <ThemedText style={styles.planPrice}>$9.99/month</ThemedText>
                        </View>

                        <View style={styles.featuresList}>
                            <View style={styles.featureItem}>
                                <Ionicons name="checkmark-circle" size={20} color="#4B59B3" />
                                <ThemedText style={styles.featureText}>
                                    Unlimited access to premium articles
                                </ThemedText>
                            </View>
                            <View style={styles.featureItem}>
                                <Ionicons name="checkmark-circle" size={20} color="#4B59B3" />
                                <ThemedText style={styles.featureText}>
                                    Unlimited access to premium articles, billed monthly.
                                </ThemedText>
                            </View>
                            <View style={styles.featureItem}>
                                <Ionicons name="checkmark-circle" size={20} color="#4B59B3" />
                                <ThemedText style={styles.featureText}>
                                    Exclusive opinions & long-form content
                                </ThemedText>
                            </View>
                            <View style={styles.featureItem}>
                                <Ionicons name="checkmark-circle" size={20} color="#4B59B3" />
                                <ThemedText style={styles.featureText}>
                                    Save articles & personalized recommendations
                                </ThemedText>
                            </View>
                        </View>

                        {selectedPlan === 'monthly' && (
                            <View style={styles.selectedIndicator}>
                                <Ionicons name="radio-button-on" size={20} color="#4B59B3" />
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* Yearly Plan with Save Badge */}
                    <TouchableOpacity 
                        style={[
                            styles.planCard,
                            selectedPlan === 'yearly' && styles.selectedPlanCard
                        ]}
                        onPress={() => setSelectedPlan('yearly')}
                    >
                        <View style={styles.planHeader}>
                            <View style={styles.planNameContainer}>
                                <ThemedText style={styles.planName}>Yearly</ThemedText>
                                <View style={styles.saveBadge}>
                                    <ThemedText style={styles.saveText}>SAVE 20%</ThemedText>
                                </View>
                            </View>
                            <ThemedText style={styles.planPrice}>$99.99 / $9.99 / Year</ThemedText>
                        </View>

                        <View style={styles.featuresList}>
                            <View style={styles.featureItem}>
                                <Ionicons name="checkmark-circle" size={20} color="#4B59B3" />
                                <ThemedText style={styles.featureText}>
                                    Unlimited access to premium articles
                                </ThemedText>
                            </View>
                            <View style={styles.featureItem}>
                                <Ionicons name="checkmark-circle" size={20} color="#4B59B3" />
                                <ThemedText style={styles.featureText}>
                                    Save articles & personalized recommendations
                                </ThemedText>
                            </View>
                            <View style={styles.featureItem}>
                                <Ionicons name="checkmark-circle" size={20} color="#4B59B3" />
                                <ThemedText style={styles.featureText}>
                                    Exclusive opinions & long-form content
                                </ThemedText>
                            </View>
                            <View style={styles.featureItem}>
                                <Ionicons name="checkmark-circle" size={20} color="#4B59B3" />
                                <ThemedText style={styles.featureText}>
                                    Save more with full premium access, billed yearly.
                                </ThemedText>
                            </View>
                        </View>

                        {selectedPlan === 'yearly' && (
                            <View style={styles.selectedIndicator}>
                                <Ionicons name="radio-button-on" size={20} color="#4B59B3" />
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* Subscribe Button */}
                    <GradientButton
                        title="Subscribe Now"
                        onPress={handleSubscribe}
                        loading={loading}
                        variant="PRIMARY"
                        size="LARGE"
                        fullWidth={true}
                        style={styles.subscribeButton}
                        gradientColors={['#343E87', '#3448D6', '#343E87']}
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
        paddingBottom: 30,
    },
    upgradeSection: {
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 16,
        
    },
    upgradeTitle: {
        fontSize: 28,
        fontWeight: '400',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
        marginBottom: 8,
        textAlign: 'center'
    },
    upgradeDescription: {
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#000',
        lineHeight: 20,
        textAlign: 'center',
        width: '90%',
        margin: 'auto'
    },
    planCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        marginHorizontal: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        position: 'relative',
    },
    selectedPlanCard: {
        borderColor: '#4B59B3',
        borderWidth: 2,
        backgroundColor: '#F8F9FF',
    },
    planHeader: {
        marginBottom: 16,
    },
    planNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 4,
    },
    planName: {
        fontSize: 20,
        fontWeight: '600',
        fontFamily: 'CoFoRaffineBold',
        color: '#000',
    },
    saveBadge: {
        backgroundColor: '#4B59B3',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    saveText: {
        fontSize: 12,
        fontFamily: 'CoFoRaffineBold',
        color: '#FFFFFF',
    },
    planPrice: {
        fontSize: 16,
        fontFamily: 'tenez',
        color: '#4B59B3',
    },
    featuresList: {
        gap: 12,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    featureText: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'tenez',
        color: '#666',
        lineHeight: 18,
    },
    selectedIndicator: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
    subscribeButton: {
        paddingHorizontal: 16,
        marginTop: 20,
        marginBottom: 20,
    },
});