import postDataStream from "@/chatgpt/streaming";
import ChatMessage from "@/components/ChatMessage";
import MessageInput from "@/components/MessageInput";
import { Message, Role } from "@/models";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View, Image, Text, Animated, ToastAndroid, Alert, Dimensions } from "react-native";
import { GestureHandlerRootView, TouchableOpacity } from "react-native-gesture-handler";
import Config from "react-native-config";
import { tts } from "@/tts";
import { convertToText, startRecording, stopRecording } from "@/stt";
import { getLanguageCode, getLLM } from "@/storage";
import { LANGUAGES } from "@/constants";
import { Link, useFocusEffect } from "expo-router";
import { chat } from "@/chatgpt/api";
import TopQuestions from "@/components/TopQuestions";
import WelcomeMessage from "@/components/WelcomeMessage";
import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { Colors } from "react-native/Libraries/NewAppScreen";

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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#006eab',
    padding: 16,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: Dimensions.get('window').width,
    height: '100%',
    backgroundColor: '#ffffff',
    elevation: 5,
    zIndex: 10,
  },
  drawerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  languageOption: {
    paddingVertical: 10,
  },
  languageText: {
    fontSize: 16,
    color: '#333',
  },
  selectedLanguage: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  notification: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  languageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginVertical: 10,
    alignSelf: 'center',
  },
});

export default function Index() {
  const [messages, setMessages] = useState<Message[]>([]);
  const flashListRef = useRef<FlashList<Message>>(null);
  const [language, setLanguage] = useState<string>('English');
  const [engine, setEngine] = useState<string>('OpenAI');
  const [session, setSession] = useState<string | undefined>(undefined);
  const isReplayRunning = useRef(false);
  const [isQuerying, setIsQuerying] = useState(false);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const slideAnim = useState(new Animated.Value(Dimensions.get('window').width))[0];
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');

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
      setIsQuerying(true);
      await postDataStream(
        Config.OPENAI_URL!,
        'gpt-3.5-turbo',
        512,
        message,
        updateRecievedMessage
      );
      setIsQuerying(false);
    } else {
      // method 2: Call BE API    
      // TODO: 
      // 1. session (history) implementation
      // 2. tools in message
      setIsQuerying(true);
      const response = await chat(message, session);
      setIsQuerying(false);
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

    tts(content);

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
    console.log('renderMessageItem:', item)
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

  const startNewSession = () => {
    setSession(undefined);
    setMessages([]);
  };

  const toggleDrawer = () => {
    if (isDrawerOpen) {
      Animated.timing(slideAnim, {
        toValue: Dimensions.get('window').width,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setIsDrawerOpen(false));
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setIsDrawerOpen(true));
    }
  };

  const notifyLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    const message = `Selected language is ${language}`;
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Notification', message);
    }
    toggleDrawer(); // Close drawer after selection
  };

  useFocusEffect(() => {
    getLanguageCode().then((languageCode) => {
      if (LANGUAGES.has(languageCode ?? 'en-US')) {
        setLanguage(LANGUAGES.get(languageCode ?? 'en-US')!);
      }
    });
  });


  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <View
          style={{
            flex: 1,
          }}
        >
          {messages.length === 0 && <View style={styles.languageContainer}>
            <FontAwesome5 name="globe" size={16} color="#333" />
            <Text style={styles.languageText}>{`Selected Language: ${language}`}</Text>
          </View>}
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
          {messages.length === 0 && <WelcomeMessage />}
          {messages.length === 0 && <TopQuestions onMessageSelect={getCompletion} />}
          <MessageInput onShouldSendMessage={getCompletion} onStartRecording={startRecord} onStopRecording={stopRecord} onNewSession={startNewSession} isQuerying={isQuerying} />
        </KeyboardAvoidingView>
      </View>
    </GestureHandlerRootView>
  );
}
