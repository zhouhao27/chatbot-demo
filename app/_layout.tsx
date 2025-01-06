import Colors from "@/constants/Colors";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";

export default function RootLayout() {
  const onSettings = () => {
    router.push('./settings');
  };

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'TTM ChatBot',
          // headerLeft: () => (
          //   <TouchableOpacity onPress={() => console.log('headerLeft')}>
          //     <MaterialIcons name="chat-bubble-outline" size={24} color={Colors.grey} />
          //   </TouchableOpacity>
          // ),
          headerRight: () => (
            <TouchableOpacity onPress={onSettings}>
              <FontAwesome5 name="cog" size={24} color={Colors.grey} />
            </TouchableOpacity>
          ),
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
