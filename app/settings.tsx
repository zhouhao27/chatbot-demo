import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Picker } from '@react-native-picker/picker';
import { LANGUAGES } from '@/constants/Config';
import { getLanguageCode, getLLM, setLanguageCode, setLLM } from '@/storage';

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

const Settings = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [selectedLLM, setSelectedLLM] = useState('OpenAI');

  const onLanguageChange = (itemValue: string, itemIndex: number) => {
    setLanguageCode(itemValue);
    setSelectedLanguage(itemValue)
  };

  const onSelectLLM = (itemValue: string, itemIndex: number) => {
    setLLM(itemValue);
    setSelectedLLM(itemValue)
  };

  useEffect(() => {
    getLanguageCode().then((languageCode) => {
      setSelectedLanguage(languageCode || 'en-US');
    });
    getLLM().then((llm) => {
      setSelectedLLM(llm || 'OpenAI');
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select language:</Text>
      <Picker
        selectedValue={selectedLanguage}
        onValueChange={onLanguageChange}>
        {
          Array.from(LANGUAGES.keys())
            .map((key) => (
              <Picker.Item key={key} label={LANGUAGES.get(key)} value={key} />
            ))
        }
      </Picker>
      <Text style={styles.title}>Large Language model:</Text>
      <Picker
        selectedValue={selectedLLM}
        onValueChange={onSelectLLM}>
        <Picker.Item key={0} label='OpenAI' value='OpenAI' />
        <Picker.Item key={1} label='BE' value='BE' />
      </Picker>

    </View>
  )
}

export default Settings
