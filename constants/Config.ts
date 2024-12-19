export const GOOGLE_SPEECH_API_URL =
  "https://speech.googleapis.com/v1/speech:recognize";
export const GOOGLE_TTS_API_URL =
  "https://texttospeech.googleapis.com/v1/text:synthesize";

export const LANGUAGES: Map<string, string> = new Map([
  ["en-US", "English"],
  ["zh-CN", "Chinese"],
  ["bn-IN", "Bengali"],
  ["ta-IN", "Tamil"],
  ["th-TH", "Thai"],
  ["vi-VN", "Vietnamese"],
]);
