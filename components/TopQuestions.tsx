import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
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
    backgroundColor: '#F8FAFC',
    borderColor: 'lightblue', // Set border color to light blue
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    // marginVertical: 8,
    alignSelf: 'center', // Center align the items
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 14,
    color: Colors.grey,
    textAlign: 'center', // Center align the text
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
          gap: 12,
          alignItems: 'center', // Center align the items
        }}
      >
        {PredefinedMessages.map((message, index) => (
          <TouchableOpacity
            key={index}
            style={styles.container}
            onPress={() => onMessageSelect(`${message.text}`)}
          >
            <Text style={styles.text}>{message.text}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default TopQuestions;