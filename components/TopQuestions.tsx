import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import Colors from '@/constants/Colors';
import { useFocusEffect } from 'expo-router';
import { getLanguageCode } from '@/storage';
import { LANGUAGES } from '@/constants';

/* const PredefinedMessages = [
  { text: "What if I don't get paid" },
  { text: 'What if I get hurt' },
  { text: "What are the laws in Singapore" },
]; */
type LanguageKeys = 'English' | 'Tamil' | 'Mandarin' | 'Bengali' | 'Vietnamese' | 'Thai';

const predefinedQuestions: Record<LanguageKeys, { text: string }[]> = {
  English: [
    { text: "What if I don't get paid?" },
    { text: "What if I get hurt?" },
    { text: "What are the laws in Singapore?" },
  ],
  Tamil: [
    { text: "நான் சம்பளம் பெறவில்லை என்றால் என்ன செய்வது?" },
    { text: "நான் காயப்பட்டால் என்ன செய்வது?" },
    { text: "சிங்கப்பூரில் உள்ள சட்டங்கள் என்ன?" },
  ],
  Mandarin: [
    { text: "如果我没拿到工资怎么办？" },
    { text: "如果我受伤了怎么办？" },
    { text: "新加坡的法律是什么？" },
  ],
  Bengali: [
    { text: "যদি আমি বেতন না পাই?" },
    { text: "যদি আমি আঘাত পাই?" },
    { text: "সিঙ্গাপুরে আইন কি?" },
  ],
  Vietnamese: [
    { text: "Nếu tôi không được trả lương thì sao?" },
    { text: "Nếu tôi bị thương thì sao?" },
    { text: "Luật pháp ở Singapore là gì?" },
  ],
  Thai: [
    { text: "ถ้าฉันไม่ได้รับเงินจะเป็นอย่างไร?" },
    { text: "ถ้าฉันได้รับบาดเจ็บจะทำอย่างไร?" },
    { text: "กฎหมายในสิงคโปร์คืออะไร?" },
  ],
};


type MessageIdeasProps = {
  onMessageSelect: (message: string) => void;
  selectedLanguage?: string;
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

  const [language, setLanguage] = useState<LanguageKeys>('English');

  useFocusEffect(() => {
    getLanguageCode().then((languageCode) => {
      const selectedLanguage = LANGUAGES.find((lang) => lang.id === languageCode);
      if (selectedLanguage) {
        setLanguage(selectedLanguage.value as LanguageKeys);
      } else {
        setLanguage('English');
      }
      /* if (LANGUAGES.has(languageCode ?? 'en-US')) {
        setLanguage(LANGUAGES.get(languageCode ?? 'en-US')! as LanguageKeys);
      } */
    });
  });

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
        {predefinedQuestions[language].map((message, index) => (
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