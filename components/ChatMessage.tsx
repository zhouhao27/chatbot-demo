import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Message, Role } from '@/models'
import { FontAwesome5 } from '@expo/vector-icons'
import Colors from '@/constants/Colors'
import { Flow } from 'react-native-animated-spinkit'
import { getPlayState, setPlayState } from '@/storage'
import SoundManager from '@/tts/SoundManager'

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    gap: 10,
    marginVertical: 8,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginTop: 6,
  },
  item: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  text: {
    paddingHorizontal: 4,
    paddingVertical: 0,
    fontSize: 16,
    flexWrap: 'wrap',
    flex: 1,
    color: '#00247B'
  },
  messageItemContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,
    marginVertical: 8,
  },
  botResponseText: {
    paddingHorizontal: 4,
    paddingVertical: 0,
    fontSize: 16,
    flexWrap: 'wrap',
    flex: 1,
    color: '#2D3642',
  }
})

type ChatMessageProps = {
  isPlaying: boolean;
  message: Message;
  onReplay: (content: string, onComplete?: () => void) => void;
}


const ChatMessage = ({ isPlaying, message, onReplay }: ChatMessageProps) => {

  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  useEffect(() => {
    getPlayState().then((playState) => {
      setIsAudioPlaying(playState);
    });
    // setPlayState(!isAudioPlaying)
  }, [isAudioPlaying])
  console.log("isAudioPlaying", isAudioPlaying)
  const handlePress = () => {
    const soundManager = SoundManager.getInstance();
    if (isAudioPlaying) {
      soundManager.stopSound(() => {
        setPlayState(false);
        setIsAudioPlaying(false);
      });
    } else {
      setPlayState(true);
      getPlayState().then((playState) => {
        setIsAudioPlaying(playState);
      });
      onReplay(message.content, () => {
        setIsAudioPlaying(false);
      });
    }

  };

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
          message.content.length == 0 ? <Flow size={24} color={Colors.grey} style={{ marginTop: 4, marginLeft: 8 }} /> : <Text style={message.role === Role.Bot ? styles.botResponseText : styles.text}>{message.content}</Text>
        }
        {message.role === Role.Bot && message.content.length > 0 && (
          <TouchableOpacity onPress={handlePress} style={{ marginTop: 12 }}>
            <FontAwesome5 name={isAudioPlaying ? 'stop-circle' : 'volume-up'} size={isAudioPlaying ? 24 : 20} color={'#A0ABB8'} />
          </TouchableOpacity>)}
      </View>
    </View >
  )
}

export default ChatMessage