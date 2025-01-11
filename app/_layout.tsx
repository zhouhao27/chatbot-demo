import Colors from "@/constants/Colors";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: '#006eab', // Apply header color to the top area
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#006eab',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  settingsContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: '80%',
    backgroundColor: 'white',
    zIndex: 10,
    elevation: 5,
  },
  content: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Apply the rest of the bottom color
  },
  subtitle: {
    fontSize: 14,
    color: '#ffb74d',
    marginLeft: 10,
  },
  headerIconContainer: {
    padding: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#005787',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default function RootLayout() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const translateX = useSharedValue(0);

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
    translateX.value = withTiming(isSettingsOpen ? 0 : -300, { duration: 300 });
    if (!isSettingsOpen) {
      router.push('/settings');
    } else {
      router.back();
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.headerContainer}>
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <View style={styles.headerIconContainer}>
              <MaterialCommunityIcons name="robot" size={24} color="white" />
            </View>
            <View>
              <Text style={styles.headerTitle}>TTM Chat Bot</Text>
              <Text style={styles.subtitle}>Your AI-Powered Bot</Text>
            </View>
          </View>
          <TouchableOpacity onPress={toggleSettings}>
            <FontAwesome5 name="bars" size={24} color="#E1F0FF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <View style={styles.content}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="settings" />
        </Stack>
      </View>
      <SafeAreaView edges={['bottom']} style={{ backgroundColor: '#fff' }} />
    </View>
  );
}
