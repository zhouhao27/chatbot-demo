import Colors from "@/constants/Colors";
import { FontAwesome5, Foundation, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type MessageInputProps = {
  onShouldSendMessage: (message: string) => void;
  // onReplay: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  roundBtn: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: Colors.input,
    alignItems: 'center',
    justifyContent: 'center'
  },
  messageInput: {
    flex: 1,
    marginHorizontal: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 20,
    padding: 10,
    borderColor: Colors.greyLight,
    backgroundColor: Colors.light
  },
  buttonView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  }
});

const MessageInput = ({ onShouldSendMessage, onStartRecording, onStopRecording }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const { bottom } = useSafeAreaInsets();
  const [isRecording, setIsRecording] = useState(false);

  const onChangeText = (text: string) => {
    setMessage(text)
  }

  const onSend = () => {
    onShouldSendMessage(message)
    setMessage('')
  }

  const onHandleRecording = () => {
    console.log('onHandleRecording:', isRecording)
    if (isRecording) {
      setIsRecording(false)
      onStopRecording()
    } else {
      setIsRecording(true)
      onStartRecording()
    }
  }

  return (
    <View style={{ paddingBottom: bottom + 10, paddingTop: 10, backgroundColor: Colors.light }}>
      <View style={styles.row}>
        <TextInput
          autoFocus
          placeholder="Message"
          style={styles.messageInput}
          multiline
          value={message}
          onChangeText={onChangeText}
        />
        {message.length > 0 ? (
          <TouchableOpacity onPress={onSend}>
            <Ionicons name="arrow-up-circle-outline" size={24} color={Colors.grey} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onHandleRecording}>
            {
              isRecording ? <MaterialCommunityIcons name="record-circle-outline" size={24} color="red" /> :
                <FontAwesome5 name="microphone" size={24} color={Colors.grey} />
            }

          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default MessageInput;