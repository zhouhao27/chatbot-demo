import Colors from "@/constants/Colors";
import { Feather, FontAwesome5, Foundation, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type MessageInputProps = {
  onShouldSendMessage: (message: string) => void;
  // onReplay: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onNewSession: () => void;
  isQuerying: boolean;
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
    borderRadius: 30,
    padding: 15,
    borderColor: '#c8d6e3',
    backgroundColor: Colors.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  buttonView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  sendButton: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: '#c7d0d8',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const MessageInput = ({ onShouldSendMessage, onStartRecording, onStopRecording, onNewSession, isQuerying }: MessageInputProps) => {
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
    <View style={{ paddingBottom: bottom - 10, paddingTop: 20, marginTop: 20, backgroundColor: Colors.light }}>
      <View style={styles.row}>
        <TouchableOpacity onPress={onNewSession} style={styles.sendButton}>
          <Feather name="plus" size={24} color={Colors.white} />
        </TouchableOpacity>
        <TextInput
          autoFocus
          placeholder="Message"
          style={styles.messageInput}
          multiline
          value={message}
          onChangeText={onChangeText}
        />
        {message.length > 0 && !isQuerying ? (
          <TouchableOpacity onPress={onSend} style={styles.sendButton}>
            <Ionicons name="arrow-up-circle-outline" size={24} color={Colors.white} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onHandleRecording}>
            {
              !isQuerying && (
                isRecording ? <MaterialCommunityIcons name="record-circle-outline" size={24} color="red" /> :
                  <FontAwesome5 name="microphone" size={24} color={'#6482AD'} />
              )
            }
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default MessageInput;