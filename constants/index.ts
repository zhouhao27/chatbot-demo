export const GOOGLE_SPEECH_API_URL =
  "https://speech.googleapis.com/v1/speech:recognize";
export const GOOGLE_TTS_API_URL =
  "https://texttospeech.googleapis.com/v1/text:synthesize";

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
