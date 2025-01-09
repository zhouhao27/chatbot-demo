import { View, Text, StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler';
import Colors from '@/constants/Colors';

const PredefinedMessages = [
  { text: "Employer no give money for 3 months?" },
  { text: 'What is talk to MOM' },
  { text: "What are the laws in Singapore" },
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

const TopQuestions = ({ onMessageSelect }: MessageIdeasProps) => {
  return (
    <View>
      <ScrollView
        horizontal={false}
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
            onPress={() => onMessageSelect(`${message.text}`)}
          >
            {/* <Text style={styles.title}>{message.title}</Text> */}
            <Text style={styles.text}>{message.text}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

export default TopQuestions