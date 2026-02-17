import { ThemedView } from '@/src/components/ThemedComponents';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import ReaderNavbar from './ReaderNavbar';
import ReaderSlider from './ReaderSlider';

export default function ReaderHome() {
    return (
        <ThemedView style={styles.container}>
            <ReaderNavbar />
            <ScrollView style={styles.content}>
                <ReaderSlider />
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