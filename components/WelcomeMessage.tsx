import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2563CC',
    },
});

const WelcomeMessage = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Frequently Asked Questions</Text>
        </View>
    );
};

export default WelcomeMessage;
