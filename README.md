# An Chat Bot Demo

A POC application to demostrate the ChatBot talke to OpenAI. It supports TTS/STT with Google Cloud Text-to-Speech and Speech-to-Text.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

   Install CocoaPods in `ios` folder

   ```bash
   pod install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

   Or run in iOS simulator

   ```bash
   npm run ios
   ```

## Setup ChatGPT

Add the `OPENAI_URL` and `OPENAI_TOKEN` in `.env` file. For example:

```bash
OPENAI_URL = https://openai_url
OPENAI_TOKEN = xxxxxxxxxxxxxxxxx
GOOGLE_API_KEY = xxxxxxxxxxxxxxx
```

## Setup Google Cloud

[Setup Google Cloud for Text-to-Speech and Speech-to-Text API](./google-cloud-setup.md)

## TODO:

- Auto detect the language.
- Integrate to BE API.
- Integrate to real application. Only UI-related components are expo components. The other part should be able to be used in old React-native version.
