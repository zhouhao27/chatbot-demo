import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Picker } from '@react-native-picker/picker';
import { LANGUAGES } from '@/constants/Config';
import { getLanguageCode, setLanguageCode } from '@/storage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  title: {
    paddingTop: 16,
    alignSelf: 'flex-start',
    fontSize: 20,
    fontWeight: 'bold'
  },
});

export const arrOfLanguages = Object.entries(LANGUAGES);

const Settings = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');

  const onLanguageChange = (itemValue: string, itemIndex: number) => {
    setLanguageCode(itemValue);
    setSelectedLanguage(itemValue)
  };

  useEffect(() => {
    getLanguageCode().then((languageCode) => {
      setSelectedLanguage(languageCode || 'en-US');
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select language:</Text>
      <Picker
        selectedValue={selectedLanguage}
        onValueChange={onLanguageChange}>
        {
          arrOfLanguages.map(([key, value]) => (
            <Picker.Item key={key} label={value} value={key} />
          ))
        }
      </Picker>
    </View>
  )
}

export default Settings
