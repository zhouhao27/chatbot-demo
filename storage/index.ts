import AsyncStorage from "@react-native-async-storage/async-storage";

export const setLanguageCode = async (languageCode: string) => {
  try {
    await AsyncStorage.setItem("language-code", languageCode);
  } catch (e) {
    console.error(e);
  }
};

export const getLanguageCode = async () => {
  try {
    const value = await AsyncStorage.getItem("language-code");
    return value;
  } catch (e) {
    return null;
  }
};
