# Setup Google Cloud Account

To use `Text-To-Speech` and `Speech-To-Text` API:

## Create a Google Cloud Account:

• Go to Google Cloud Console.
• Create a new project or select an existing one.

## Enable APIs:

• Navigate to the API Library in the console.
• Enable the Cloud `Text-to-Speech` API and Cloud `Speech-to-Text` API for your project.

## Set Up Billing:

• Google Cloud requires billing to be enabled, even for free-tier usage. Add a billing account to your project.

## Generate API key:

• Go to APIs & Services.
• Go to Credentials. Select CREATE CREDENTIALS and create an API Keys.
• Restrict this API key only for TTS/STT API.

## NOTICE:

Based on what I tested:

• The recorded audio format must be wav with the following options:

```json
  sampleRate: 16000, // default 44100
  channels: 1, // 1 or 2, default 1
  bitsPerSample: 16, // 8 or 16, default 16
```
