import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Picker } from '@react-native-picker/picker';
import { LANGUAGES } from '@/constants/Config';
import { getLanguageCode, getLLM, setLanguageCode, setLLM } from '@/storage';
import { Feather } from '@expo/vector-icons';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { playSound } from '@/tts';
import { Asset } from 'expo-asset';
import DeviceInfo from 'react-native-device-info';

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
  text: {
    paddingTop: 16,
    alignSelf: 'flex-start',
    fontSize: 16,
    color: 'gray'
  },

});

const Settings = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [selectedLLM, setSelectedLLM] = useState('OpenAI');
  const [version, setVersion] = useState('');

  const onLanguageChange = (itemValue: string, itemIndex: number) => {
    setLanguageCode(itemValue);
    setSelectedLanguage(itemValue)
  };

  const onSelectLLM = (itemValue: string, itemIndex: number) => {
    setLLM(itemValue);
    setSelectedLLM(itemValue)
  };

  const onTestSound = async () => {
    const soundFile = Asset.fromModule(require('../assets/sounds/test.mp3'));
    await soundFile.downloadAsync();
    if (soundFile.localUri) {
      playSound(soundFile.localUri, () => { })
    }
  };

  const getVersion = async () => {
    // const version = await DeviceInfo.getVersion();
    // const build = await DeviceInfo.getBuildNumber();
    // setVersion(`version: ${version}, build: ${build}`);

    const readableVersion = DeviceInfo.getReadableVersion();
    setVersion(`version: ${readableVersion}`);
  }

  useEffect(() => {
    getLanguageCode().then((languageCode) => {
      setSelectedLanguage(languageCode || 'en-US');
    });
    getLLM().then((llm) => {
      setSelectedLLM(llm || 'OpenAI');
    });
    getVersion();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{version}</Text>
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
      <TouchableOpacity onPress={onTestSound}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Text style={{ fontSize: 16 }}>Test sound</Text>
          <Feather name="speaker" size={24} color={Colors.grey} />
        </View>
      </TouchableOpacity>

    </View>
  )
}

export default Settings
