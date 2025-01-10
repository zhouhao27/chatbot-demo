import axios from "axios";
import fs from "react-native-fs";
import Config from "react-native-config";
import { GOOGLE_SPEECH_API_URL } from "@/constants";
import AudioRecord from "react-native-audio-record";
import { getLanguageCode } from "@/storage";
import { PermissionsAndroid, Platform } from "react-native";

const requestPermission = async () => {
  if (Platform.OS === "android") {
    try {
      const grants = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);

      console.log("write external storage", grants);

      if (
        grants["android.permission.WRITE_EXTERNAL_STORAGE"] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        grants["android.permission.READ_EXTERNAL_STORAGE"] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        grants["android.permission.RECORD_AUDIO"] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log("Permissions granted");
      } else {
        console.log("All required permissions not granted");
        return;
      }
    } catch (err) {
      console.warn(err);
      return;
    }
  }
};

export const startRecording = async () => {
  // const result = await audioRecorderPlayer.startRecorder();
  // console.log("Recording started: ", result);

  // request permission
  await requestPermission();

  // use AudioRecord to start recording
  const options = {
    sampleRate: 16000, // default 44100
    channels: 1, // 1 or 2, default 1
    bitsPerSample: 16, // 8 or 16, default 16
    audioSource: 6, // android only (see below)
    wavFile: "sound.wav", // default 'audio.wav'
  };

  AudioRecord.init(options);
  AudioRecord.start();

  console.log("Recording started: ");
};

export const stopRecording = async () => {
  // const result = await audioRecorderPlayer.stopRecorder();
  // console.log("Recording stopped: ", result);
  // return result; // Path to the audio file

  const audioFile = await AudioRecord.stop();
  console.log("Recording stopped: ", audioFile);

  AudioRecord.on("data", (data) => {
    // base64-encoded audio data chunks
  });

  return audioFile;
  // return "/data/user/0/com.anonymous.chatgpt/files/sound.wav";
};

export const convertToText = async (audioPath: string) => {
  const base64Audio = await fs.readFile(audioPath, "base64");
  const langaugeCode = (await getLanguageCode()) || "en-US";

  try {
    const url = `${GOOGLE_SPEECH_API_URL}?key=${Config.GOOGLE_API_KEY}`;
    console.log("url:", url);
    const response = await axios.post(url, {
      config: {
        encoding: "LINEAR16",
        sampleRateHertz: 16000,
        languageCode: langaugeCode,
      },
      audio: {
        content: base64Audio,
      },
    });

    console.log("response:", response.data);

    const transcription = response.data.results
      .map((result: any) => result.alternatives[0].transcript)
      .join("\n");

    console.log("transcription:", transcription);
    return transcription;
  } catch (error) {
    console.error("Error with Speech-to-Text API:", error);
    return null;
  }
};
