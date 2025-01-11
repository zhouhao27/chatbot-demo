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

export const setLLM = async (llm: string) => {
  try {
    await AsyncStorage.setItem("llm", llm);
  } catch (e) {
    console.error(e);
  }
};

export const getLLM = async () => {
  try {
    const value = await AsyncStorage.getItem("llm");
    return value;
  } catch (e) {
    return null;
  }
};

export const setPlayState = async (playState: boolean) => {
  try {
    await AsyncStorage.setItem("play-state", String(playState));
  } catch (e) {
    console.error(e);
  }
};

export const getPlayState = async () => {
  try {
    const value = await AsyncStorage.getItem("play-state");
    return value === "true";
  } catch (e) {
    return false;
  }
};
