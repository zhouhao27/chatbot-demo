import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#2563CC',
    },
    subtitle: {
        fontSize: 14,
        color: '#ff8b00',
        marginTop: 8,
    },
});

const WelcomeMessage = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>How can I help you?</Text>
            <Text style={styles.subtitle}>Your AI-Powered Chat Bot</Text>
        </View>
    );
};

export default WelcomeMessage;
