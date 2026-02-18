import { ThemedView } from '@/src/components/ThemedComponents';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import PostsList from './PostsList';
import ReaderNavbar from './ReaderNavbar';
import ReaderQuickLink from './ReaderQuickLink';
import ReaderSlider from './ReaderSlider';

export default function ReaderHome() {
    return (
        <ThemedView style={styles.container}>
            <ReaderNavbar />
            <FlatList
                data={[]}
                renderItem={null}
                ListHeaderComponent={
                    <View style={styles.headerContainer}>
                        <ReaderSlider />
                        <ReaderQuickLink />
                    </View>
                }
                ListFooterComponent={<PostsList />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',

    },
    listContent: {
        paddingHorizontal: 16, // Add paddingHorizontal to the entire list
    },
    headerContainer: {
        width: '100%',
        marginTop: 24
    },
});