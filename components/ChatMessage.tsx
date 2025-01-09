import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Message, Role } from '@/models'
import { FontAwesome5 } from '@expo/vector-icons'
import Colors from '@/constants/Colors'
import { Flow } from 'react-native-animated-spinkit'

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    gap: 16,
    marginVertical: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  item: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  text: {
    padding: 4,
    fontSize: 16,
    flexWrap: 'wrap',
    flex: 1,
  },
  messageItemContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    flex: 1,
    marginVertical: 8,
  }
})

type ChatMessageProps = {
  isPlaying: boolean;
  message: Message;
  onReplay: (content: string) => void;
}

const ChatMessage = ({ isPlaying, message, onReplay }: ChatMessageProps) => {
  return (
    <View style={styles.row}>
      {message.role === Role.Bot ? (
        <View style={styles.item} >
          <Image
            source={require('../assets/images/Chatbot.png')}
            style={styles.avatar}
          />
        </View>
      ) : (
        <Image
          source={require('../assets/images/user.png')}
          style={styles.avatar}
        />
      )}
      <View style={styles.messageItemContainer} >
        {
          message.content.length == 0 ? <Flow size={24} color={Colors.grey} /> : <Text style={styles.text}>{message.content}</Text>
        }
        {message.role === Role.Bot && message.content.length > 0 && (
          <TouchableOpacity onPress={() => onReplay(message.content)} style={{ marginTop: 8 }}>
            <FontAwesome5 name="headphones" size={24} color={Colors.greyLight} />
          </TouchableOpacity>)}
      </View>
    </View >
  )
}

export default ChatMessage