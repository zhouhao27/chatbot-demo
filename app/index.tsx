import postDataStream from "@/chatgpt/streaming";
import ChatMessage from "@/components/ChatMessage";
import MessageIdeas from "@/components/MessageIdeas";
import MessageInput from "@/components/MessageInput";
import { Message, Role } from "@/models";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View, Image, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Tts from 'react-native-tts';
import Config from "react-native-config";
import { tts } from "@/tts";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    paddingTop: 100,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: 128,
    height: 128,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});

export default function Index() {
  const [messages, setMessages] = useState<Message[]>([]);
  const flashListRef = useRef<FlashList<Message>>(null);

  const getCompletion = async (message: string) => {
    console.log('getCompletion:', message)
    if (messages.length === 0) {

    }

    setMessages([
      ...messages,
      {
        role: Role.User,
        content: message,
      },
      {
        role: Role.Bot,
        content: '',
      }
    ])

    const updateRecievedMessage = (done: boolean, delta: string) => {
      console.log('updateRecievedMessage:', done, delta)
      if (!done) {
        // Update the last message with the new delta since we created a new empty message when we start to send message
        setMessages((prevMessages) => {
          if (delta.length > 0) {
            prevMessages[prevMessages.length - 1].content = delta;
            return [...prevMessages];
          }
          return prevMessages;
        });
      } else {
        console.log('done:', done, delta)
      }
    }

    // call chatgpt api
    const response = await postDataStream(
      Config.OPENAI_URL!,
      'gpt-3.5-turbo',
      512,
      message,
      updateRecievedMessage
    );
  }

  useEffect(() => {
    if (flashListRef.current) {
      console.log('scrollToEnd')
      flashListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const availableVoices = async () => {
    const voices = await Tts.voices();
    const availableVoices = voices
      .filter(v => !v.networkConnectionRequired && !v.notInstalled)
      .map(v => {
        return { id: v.id, name: v.name, language: v.language };
      });
    console.log('availableVoices:', availableVoices)
    // Tts.setDefaultLanguage('zh-CN');
    // Tts.setDefaultLanguage('ta-IN');
  };

  useEffect(() => {
    availableVoices();
  }, []);

  const renderMessageItem = ({ item, index }: { item: Message, index: number }) => {
    return <ChatMessage message={item} onReplay={content => {
      // Tts.speak(content);
      tts(content);
    }} />
  }

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <View
          style={{
            flex: 1,
          }}
        >
          {messages.length === 0 && (
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/images/react-logo.png')}
                style={styles.image} />
            </View>
          )}
          <FlashList
            ref={flashListRef}
            data={messages}
            renderItem={renderMessageItem}
            estimatedItemSize={400}
            contentContainerStyle={{
              paddingBottom: 100,
              paddingTop: 30,
            }}
            keyboardDismissMode="on-drag"
          />
        </View>
        <KeyboardAvoidingView
          keyboardVerticalOffset={70}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%'
          }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {messages.length === 0 && <MessageIdeas onMessageSelect={getCompletion} />}
          <MessageInput onShouldSendMessage={getCompletion} />
        </KeyboardAvoidingView>
      </View>
    </GestureHandlerRootView>
  );
}
