import { Platform } from "react-native";
import RNFS from "react-native-fs";

export const GOOGLE_SPEECH_API_URL =
  "https://speech.googleapis.com/v1/speech:recognize";
export const GOOGLE_TTS_API_URL =
  "https://texttospeech.googleapis.com/v1/text:synthesize";

// export const outPutFilePath =
//   (Platform.OS === "ios"
//     ? RNFS.MainBundlePath
//     : RNFS.ExternalStorageDirectoryPath + "/Download") + "/tts_result.mp3";

export const outPutFilePath =
  (Platform.OS === "ios" ? RNFS.MainBundlePath : RNFS.DocumentDirectoryPath) +
  "/tts_result.mp3";

export const appid = "bbf547d6";
export const apiSecret = "MmIwZGQ1YmEyZDMxYzI1ZTRmMjljOGY5";
export const apiKey = "07b5abadd308a3f6490da1b70fa1d41a";

/* export const LANGUAGES: Map<string, string> = new Map([
  ["en-US", "English"],
  ["zh-CN", "Mandarin"],
  ["bn-IN", "Bengali"],
  ["ta-IN", "Tamil"],
  ["th-TH", "Thai"],
  ["vi-VN", "Vietnamese"],
]); */
export const LANGUAGES = [
  { id: "en-US", value: "English", label: "English" },
  { id: "zh-CN", value: "Mandarin", label: "Mandarin / 中文" },
  { id: "bn-IN", value: "Bengali", label: "Bengali / বাংলা" },
  { id: "ta-IN", value: "Tamil", label: "Tamil / தமிழ்" },
  { id: "th-TH", value: "Thai", label: "Thai / ไทย" },
  { id: "vi-VN", value: "Vietnamese", label: "Vietnamese / Tiếng Việt" },
];
