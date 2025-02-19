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
  {
    id: "en-US",
    value: "English",
    label: "English",
    vcn: "x4_EnUK_Lizzy_assist",
  },
  {
    id: "zh-CN",
    value: "Mandarin",
    label: "Mandarin / 中文",
    vcn: "x4_lingxiaoqi",
  },
  {
    id: "bn-IN",
    value: "Bengali",
    label: "Bengali / বাংলা",
    vcn: "x2_BnBd_Elmy",
  },
  { id: "ta-IN", value: "Tamil", label: "Tamil / தமிழ்", vcn: "x2_Taln_Udaya" },
  { id: "th-TH", value: "Thai", label: "Thai / ไทย", vcn: "" },
  {
    id: "vi-VN",
    value: "Vietnamese",
    label: "Vietnamese / Tiếng Việt",
    vcn: "x2_ViVn_ThuHien",
  },
];
