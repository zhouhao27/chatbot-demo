import postDataStream from "@/chatgpt/streaming";
import ChatMessage from "@/components/ChatMessage";
import MessageIdeas from "@/components/MessageIdeas";
import MessageInput from "@/components/MessageInput";
import { Message, Role } from "@/models";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View, Image, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
// import Tts from 'react-native-tts';
import Config from "react-native-config";
import { tts } from "@/tts";
import { convertToText, startRecording, stopRecording } from "@/stt";
import { getLanguageCode, getLLM } from "@/storage";
import { LANGUAGES } from "@/constants/Config";
import { Link, useFocusEffect } from "expo-router";
import { chat } from "@/chatgpt/api";

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
  prompt: {
    padding: 16,
    fontSize: 16,
    textAlign: 'center',
    color: 'gray',
  },
  link: {
    padding: 16,
    fontSize: 16,
    textAlign: 'center',
    color: 'blue',
    textDecorationLine: 'underline'
  }

});

export default function Index() {
  const [messages, setMessages] = useState<Message[]>([]);
  const flashListRef = useRef<FlashList<Message>>(null);
  const [language, setLanguage] = useState<string>('English');
  const [engine, setEngine] = useState<string>('OpenAI');
  const [session, setSession] = useState<string | undefined>(undefined);
  const isReplayRunning = useRef(false);

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

    // call chat api
    const llm = await getLLM();

    // method 1: Call ChatGPT API
    if (llm === 'OpenAI') {
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
      await postDataStream(
        Config.OPENAI_URL!,
        'gpt-3.5-turbo',
        512,
        message,
        updateRecievedMessage
      );
    } else {
      // method 2: Call BE API    
      // TODO: 
      // 1. session (history) implementation
      // 2. tools in message
      const response = await chat(message, session);
      const id = response.id;
      setSession(id);
      const newMessage = response.choices[0].messages[0].content;
      setMessages((prevMessages) => {
        prevMessages[prevMessages.length - 1].content = newMessage;
        return [...prevMessages];
      });
    }
  }

  useEffect(() => {
    if (flashListRef.current && messages.length > 0) {
      flashListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  useFocusEffect(() => {
    getLanguageCode().then((languageCode) => {
      if (LANGUAGES.has(languageCode ?? 'en-US')) {
        setLanguage(LANGUAGES.get(languageCode ?? 'en-US')!);
      }
    });
    getLLM().then((llm) => {
      setEngine(llm ?? 'OpenAI');
    });
  });

  const onReplay = async (content: string) => {

    tts(content, () => {
      console.log('TTS done')
    })

    // if (isReplayRunning.current) {
    //   return;
    // }

    // isReplayRunning.current = true;

    // try {
    //   await tts(content, () => {
    //     isReplayRunning.current = false;
    //   });
    // } catch (error) {
    //   console.error('Error during TTS processing:', error);
    //   isReplayRunning.current = false;
    // }
  };

  const renderMessageItem = ({ item, index }: { item: Message, index: number }) => {
    return <ChatMessage message={item} isPlaying={isReplayRunning.current} onReplay={onReplay} />
  }

  const startRecord = async () => {
    startRecording();
  };

  const stopRecord = async () => {
    const audioFile = await stopRecording();

    const text = await convertToText(audioFile);
    if (text) {
      getCompletion(text);
    }
  };

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <View
          style={{
            flex: 1,
          }}
        >
          <Text style={styles.prompt}>{`Current language is ${language}. Please use this language to ask questions.`}</Text>
          <Link href="/settings"><Text style={styles.link}>Settings</Text></Link>
          {/* {messages.length === 0 && (
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/images/react-logo.png')}
                style={styles.image} />
            </View>
          )} */}
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
          {/* {messages.length === 0 && <MessageIdeas onMessageSelect={getCompletion} />} */}
          <MessageInput onShouldSendMessage={getCompletion} onStartRecording={startRecord} onStopRecording={stopRecord} />
        </KeyboardAvoidingView>
      </View>
    </GestureHandlerRootView>
  );
}
