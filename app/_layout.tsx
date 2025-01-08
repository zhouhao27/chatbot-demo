import Colors from "@/constants/Colors";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";

export default function RootLayout() {
  const onSettings = () => {
    console.log('onSettings');
    router.push('/settings');
  };

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'TTM ChatBot',
          // headerRight: () => (
          //   <TouchableOpacity onPress={onSettings}>
          //     <FontAwesome5 name="cog" size={24} color={Colors.grey} />
          //   </TouchableOpacity>
          // ),
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />
    </Stack>
  );
}
