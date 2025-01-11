import fs from "react-native-fs";
import Sound from "react-native-sound";
import axios from "axios";
import Config from "react-native-config";
import { GOOGLE_TTS_API_URL } from "@/constants";
import { getLanguageCode, setPlayState } from "@/storage";
import { Alert } from "react-native";
import SoundManager from "./SoundManager";

export const tts = async (text: string) => {
  const langaugeCode = (await getLanguageCode()) || "en-US";

  try {
    // Step 1: Call Google TTS API
    const response = await axios.post(
      `${GOOGLE_TTS_API_URL}?key=${Config.GOOGLE_API_KEY}`,
      {
        input: { text },
        voice: { languageCode: langaugeCode, ssmlGender: "NEUTRAL" },
        audioConfig: { audioEncoding: "MP3" },
      }
    );

    console.log("response:", response.status);
    const audioContent = response.data.audioContent;

    // Step 2: Save the audio file
    const filePath = `${fs.DocumentDirectoryPath}/output.mp3`;
    await fs.writeFile(filePath, audioContent, "base64");
    console.log("Audio file saved at: ", filePath);

    // Step 3: Play the audio file
    playSound(filePath);
  } catch (error) {
    Alert.alert("Error", "Failed to generate TTS audio");
  }
};

export const playSound = async (filePath: string, p0: () => void) => {
  Sound.setCategory("Playback", true);
  const sound = new Sound(filePath, "", (error) => {
    if (error) {
      Alert.alert("Error", "Failed to load the sound");
      return;
    }
    console.log("Sound loaded successfully");
    setPlayState(true);
    // sound.play((success) => {
    //   if (success) {
    //     console.log("Successfully played audio");
    //   } else {
    //     Alert.alert("Error", "Playback failed due to an audio decoding error");
    //   }
    //   // onComplete();
    // });
    SoundManager.getInstance().playSound(sound);
  });
};
