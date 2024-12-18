import { View, Text, StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler';
import Colors from '@/constants/Colors';

const PredefinedMessages = [
  { title: 'Explain React Native', text: "like I'm five years old" },
  { title: 'Suggest fun activites', text: 'for a family visting San Francisco' },
  { title: 'Recommend a dish', text: "to impress a date who's a picky eater" },
];

type MessageIdeasProps = {
  onMessageSelect: (message: string) => void;

};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.input,
    padding: 16,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    color: Colors.grey,
  },
});

const MessageIdeas = ({ onMessageSelect }: MessageIdeasProps) => {
  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 10,
          gap: 16,
        }}
      >
        {PredefinedMessages.map((message, index) => (
          <TouchableOpacity
            key={index}
            style={styles.container}
            onPress={() => onMessageSelect(`${message.title} ${message.text}`)}
          >
            <Text style={styles.title}>{message.title}</Text>
            <Text style={styles.text}>{message.text}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

export default MessageIdeas