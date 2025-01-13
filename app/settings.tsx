import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { LANGUAGES } from '@/constants';
import { getLanguageCode, setHasSettingsScreen, setLanguageCode } from '@/storage';
import { playSound } from '@/tts';
import { Asset } from 'expo-asset';
import DeviceInfo from 'react-native-device-info';
import { router } from 'expo-router';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    paddingTop: 10,
    paddingBottom: 12,
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  text: {
    paddingTop: 16,
    alignSelf: 'flex-start',
    fontSize: 16,
    color: 'gray',
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 6,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedOption: {
    backgroundColor: '#e0f7fa',
    borderColor: '#00acc1',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  versionContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    color: 'gray',
  },
});

const Settings = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [version, setVersion] = useState('');
  // const [isSettingsOpen] = useState(false);

  const onLanguageChange = (language: string) => {
    setLanguageCode(language);
    setSelectedLanguage(language);
    setHasSettingsScreen(false);
    router.back();
  };

  /*  const onTestSound = async () => {
     const soundFile = Asset.fromModule(require('../assets/sounds/test.mp3'));
     await soundFile.downloadAsync();
     if (soundFile.localUri) {
       playSound(soundFile.localUri, () => { });
     }
   }; */

  const getVersion = async () => {
    const readableVersion = DeviceInfo.getReadableVersion();
    setVersion(`version: ${readableVersion}`);
  };

  useEffect(() => {
    getLanguageCode().then((languageCode) => {
      setSelectedLanguage(languageCode || 'en-US');
    });
    getVersion();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select language</Text>
      <FlatList
        data={LANGUAGES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.option,
              selectedLanguage === item.id && styles.selectedOption,
            ]}
            onPress={() => onLanguageChange(item.id)}
          >
            <Text style={styles.optionText}>{(item.label)}</Text>
          </TouchableOpacity>
        )}
      />
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>{version}</Text>
      </View>
    </View>
  );
};

export default Settings;
