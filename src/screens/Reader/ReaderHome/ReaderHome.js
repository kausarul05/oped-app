import { ThemedView } from '@/src/components/ThemedComponents';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import ReaderNavbar from './ReaderNavbar';

export default function ReaderHome() {
    return (
        <ThemedView style={styles.container}>
            <ReaderNavbar />
            <ScrollView style={styles.content}>
                {/* Your main content here */}
                <View style={styles.placeholder}>
                    {/* Content will go here */}
                </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    placeholder: {
        height: 500,
        // Your content components will go here
    },
});