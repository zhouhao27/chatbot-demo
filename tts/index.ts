import fs from "react-native-fs";
import Sound from "react-native-sound";
import axios from "axios";
import Config from "react-native-config";

const GOOGLE_TTS_API_URL =
  "https://texttospeech.googleapis.com/v1/text:synthesize";

export const tts = async (text: string) => {
  try {
    // Step 1: Call Google TTS API
    const response = await axios.post(
      `${GOOGLE_TTS_API_URL}?key=${Config.GOOGLE_API_KEY}`,
      {
        input: { text },
        voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
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
    const sound = new Sound(filePath, "", (error) => {
      if (error) {
        console.log("Failed to load the sound", error);
        return;
      }
      sound.play((success) => {
        if (success) {
          console.log("Successfully played audio");
        } else {
          console.log("Playback failed due to an audio decoding error");
        }
      });
    });
  } catch (error) {
    console.error("Error during TTS processing:", error);
  }
};
