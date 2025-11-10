console.log('Access File SpeachToTextGenerationFunctions.tsx ----------------------------------------------------')

// // Functions/SpeachToTextGenerationFunctions.tsx

// import RNFS from "react-native-fs";
// import { GOOGLE_SPEECH_API_KEY } from "@env";

// /**
//  * Convert recorded audio file (local URI) -> recognized text using
//  * Google Cloud Speech-to-Text REST API (synchronous recognize).
//  *
//  * Notes:
//  *  - Works best for short recordings (<= ~60s, <= ~10MB).
//  *  - For long files use GCS + longRunningRecognize (see notes below).
//  *
//  * @param fileUri local file path/URI (e.g. result returned by react-native-audio-recorder-player)
//  * @param languageCode BCP-47 language code, default "en-US"
//  * @returns recognized text (string) or throws an Error
//  */
// export async function convertSpeechFileToText(
//   fileUri: string,
//   languageCode: string = "en-US"
// ): Promise<string> {
//   try {
//     if (!fileUri) throw new Error("No file URI provided.");

//     // Read file as base64
//     // For Android fileUri might be 'file:///...' or a path. RNFS accepts either.
//     const path = fileUri.startsWith("file://") ? fileUri.replace("file://", "") : fileUri;

//     // Check file exists
//     const exists = await RNFS.exists(path);
//     if (!exists) throw new Error(`File not found at path: ${path}`);

//     // Read file as base64
//     const base64 = await RNFS.readFile(path, "base64");

//     // Construct request payload
//     // Use encoding unspecified; Google will auto-detect in many cases.
//     // If you know the exact encoding (e.g., "LINEAR16", "OGG_OPUS"), set it in config.encoding for more accuracy.
//     const requestBody = {
//       config: {
//         // encoding: "ENCODING_UNSPECIFIED", // optional
//         sampleRateHertz: 16000, // approximate; if you don't know sample rate, you can omit
//         languageCode,
//         enableAutomaticPunctuation: true,
//         model: "default",
//         profanityFilter: false,
//       },
//       audio: {
//         content: base64,
//       },
//     };

//     // Use your API key in query param
//     const apiKey = GOOGLE_SPEECH_API_KEY;
//     if (!apiKey) throw new Error("Please set GOOGLE_SPEECH_API_KEY in your .env");

//     const url = `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`;

//     const res = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(requestBody),
//     });

//     if (!res.ok) {
//       const errText = await res.text();
//       throw new Error(`Google Speech API error: ${res.status} ${res.statusText} - ${errText}`);
//     }

//     const json = await res.json();

//     // Google returns results[] with alternatives[]; join them into a single string
//     const results = json.results || [];
//     if (!results.length) return "";

//     const transcripts: string[] = results.map((r: any) => {
//       const alt = (r.alternatives && r.alternatives[0]) || null;
//       return alt ? alt.transcript : "";
//     }).filter(Boolean);

//     return transcripts.join(" ").trim();
//   } catch (err: any) {
//     // bubble up
//     throw new Error(err?.message || String(err));
//   }
// }


// // Functions/SpeachToTextGenerationFunctions.tsx
// import RNFS from "react-native-fs";
// import { GOOGLE_SPEECH_API_KEY } from "@env";

// /**
//  * Convert recorded audio file (local URI) -> recognized text using
//  * Google Cloud Speech-to-Text REST API (synchronous recognize).
//  *
//  * Works for short recordings (<60s) in .m4a format from Nitro Sound
//  *
//  * @param fileUri local file path/URI
//  * @param languageCode BCP-47 language code, default "en-US"
//  * @returns recognized text (string)
//  */
// export async function convertSpeechFileToText(
//   fileUri: string,
//   languageCode: string = "en-US"
// ): Promise<string> {
//   try {
//     if (!fileUri) throw new Error("No file URI provided.");

//     // Convert file:// path for RNFS
//     const path = fileUri.startsWith("file://") ? fileUri.replace("file://", "") : fileUri;

//     const exists = await RNFS.exists(path);
//     if (!exists) throw new Error(`File not found at path: ${path}`);

//     const base64 = await RNFS.readFile(path, "base64");

//     const requestBody = {
//       config: {
//         encoding: "MPEG4",           // ✅ specify correct encoding for .m4a
//         sampleRateHertz: 44100,      // ✅ match Nitro Sound recording rate
//         languageCode,
//         enableAutomaticPunctuation: true,
//         model: "default",
//         profanityFilter: false,
//       },
//       audio: {
//         content: base64,
//       },
//     };

//     const apiKey = GOOGLE_SPEECH_API_KEY;
//     if (!apiKey) throw new Error("Please set GOOGLE_SPEECH_API_KEY in your .env");

//     const url = `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`;

//     const res = await fetch(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(requestBody),
//     });

//     if (!res.ok) {
//       const errText = await res.text();
//       throw new Error(`Google Speech API error: ${res.status} ${res.statusText} - ${errText}`);
//     }

//     const json = await res.json();
//     const results = json.results || [];
//     if (!results.length) return "";

//     const transcripts: string[] = results
//       .map((r: any) => r.alternatives?.[0]?.transcript || "")
//       .filter(Boolean);

//     return transcripts.join(" ").trim();
//   } catch (err: any) {
//     throw new Error(err?.message || String(err));
//   }
// }

// this is my SpeachToTextGenerationFunctions.tsx do only the required changes and give me full code

// import RNFS from "react-native-fs";
// import { GOOGLE_SPEECH_API_KEY } from "@env";

// /**
//  * Convert recorded audio file (local URI) -> recognized text using
//  * Google Cloud Speech-to-Text REST API (synchronous recognize).
//  *
//  * Works for short recordings (<60s) in .wav LINEAR16 format
//  *
//  * @param fileUri local file path/URI
//  * @param languageCode BCP-47 language code, default "en-US"
//  * @returns recognized text (string)
//  */
// export async function convertSpeechFileToText(
//   fileUri: string,
//   languageCode: string = "en-US"
// ): Promise<string> {
//   try {
//     if (!fileUri) throw new Error("No file URI provided.");

//     // Convert file:// path for RNFS
//     const path = fileUri.startsWith("file://") ? fileUri.replace("file://", "") : fileUri;

//     const exists = await RNFS.exists(path);
//     if (!exists) throw new Error(`File not found at path: ${path}`);

//     const base64 = await RNFS.readFile(path, "base64");

//     const requestBody = {
//       config: {
//         encoding: "LINEAR16",         // ✅ updated to match WAV file
//         sampleRateHertz: 44100,       // ✅ match recorder
//         languageCode,
//         enableAutomaticPunctuation: true,
//         model: "default",
//         profanityFilter: false,
//       },
//       audio: {
//         content: base64,
//       },
//     };

//     const apiKey = GOOGLE_SPEECH_API_KEY;
//     if (!apiKey) throw new Error("Please set GOOGLE_SPEECH_API_KEY in your .env");

//     const url = `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`;

//     const res = await fetch(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(requestBody),
//     });

//     if (!res.ok) {
//       const errText = await res.text();
//       throw new Error(`Google Speech API error: ${res.status} ${res.statusText} - ${errText}`);
//     }

//     const json = await res.json();
//     const results = json.results || [];
//     if (!results.length) return "";

//     const transcripts: string[] = results
//       .map((r: any) => r.alternatives?.[0]?.transcript || "")
//       .filter(Boolean);

//     return transcripts.join(" ").trim();
//   } catch (err: any) {
//     throw new Error(err?.message || String(err));
//   }
// }


// import RNFS from "react-native-fs";
// import { GOOGLE_SPEECH_API_KEY } from "@env";

// /**
//  * Convert recorded audio file (local URI) -> recognized text using
//  * Google Cloud Speech-to-Text REST API (synchronous recognize).
//  *
//  * Works for short recordings (<60s) in .wav LINEAR16 format
//  *
//  * @param fileUri local file path/URI
//  * @param languageCode BCP-47 language code, default "en-US"
//  * @returns recognized text (string)
//  */
// export async function convertSpeechFileToText(
//   fileUri: string,
//   languageCode: string = "en-US"
// ): Promise<string> {
//   try {
//     if (!fileUri) throw new Error("No file URI provided.");

//     // Convert file:// path for RNFS
//     const path = fileUri.startsWith("file://") ? fileUri.replace("file://", "") : fileUri;

//     const exists = await RNFS.exists(path);
//     if (!exists) throw new Error(`File not found at path: ${path}`);

//     const base64 = await RNFS.readFile(path, "base64");

//     const requestBody = {
//       config: {
//         encoding: "LINEAR16",      // PCM WAV
//         sampleRateHertz: 16000,    // ✅ must match recorder
//         languageCode,
//         enableAutomaticPunctuation: true,
//         model: "default",
//         profanityFilter: false,
//       },
//       audio: {
//         content: base64,
//       },
//     };

//     const apiKey = GOOGLE_SPEECH_API_KEY;
//     if (!apiKey) throw new Error("Please set GOOGLE_SPEECH_API_KEY in your .env");

//     const url = `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`;

//     const res = await fetch(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(requestBody),
//     });

//     if (!res.ok) {
//       const errText = await res.text();
//       throw new Error(`Google Speech API error: ${res.status} ${res.statusText} - ${errText}`);
//     }

//     const json = await res.json();
//     const results = json.results || [];
//     if (!results.length) return "";

//     const transcripts: string[] = results
//       .map((r: any) => r.alternatives?.[0]?.transcript || "")
//       .filter(Boolean);

//     return transcripts.join(" ").trim();
//   } catch (err: any) {
//     throw new Error(err?.message || String(err));
//   }
// }

// import RNFS from "react-native-fs";
// import { Buffer } from "buffer";
// import { GOOGLE_SPEECH_API_KEY } from "@env";
// import WavDecoder from "wav-decoder";

// /**
//  * Convert Nitro Sound WAV -> LINEAR16 PCM -> Base64 -> Google Speech-to-Text
//  */
// export async function convertSpeechFileToText(
//   fileUri: string,
//   languageCode: string = "en-US"
// ): Promise<string> {
//   try {
//     if (!fileUri) throw new Error("No file URI provided.");

//     const path = fileUri.startsWith("file://") ? fileUri.replace("file://", "") : fileUri;
//     const exists = await RNFS.exists(path);
//     if (!exists) throw new Error(`File not found at path: ${path}`);

//     // Read WAV as base64
//     const fileBase64 = await RNFS.readFile(path, "base64");
//     const nodeBuffer = Buffer.from(fileBase64, "base64");

//     // ✅ Convert Node Buffer to ArrayBuffer
//     const arrayBuffer = nodeBuffer.buffer.slice(
//       nodeBuffer.byteOffset,
//       nodeBuffer.byteOffset + nodeBuffer.byteLength
//     );

//     // Decode WAV
//     const decoded = await WavDecoder.decode(arrayBuffer);
//     const channelData = decoded.channelData[0]; // mono
//     const pcm16 = new Int16Array(channelData.length);

//     // Convert float samples [-1,1] to 16-bit PCM
//     for (let i = 0; i < channelData.length; i++) {
//       let s = Math.max(-1, Math.min(1, channelData[i]));
//       pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
//     }

//     // Convert PCM16 to Base64
//     const pcmBuffer = Buffer.from(pcm16.buffer);
//     const base64 = pcmBuffer.toString("base64");

//     // Send to Google
//     const requestBody = {
//       config: {
//         encoding: "LINEAR16",
//         sampleRateHertz: decoded.sampleRate,
//         languageCode,
//         enableAutomaticPunctuation: true,
//         model: "default",
//         profanityFilter: false,
//       },
//       audio: { content: base64 },
//     };

//     const url = `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_SPEECH_API_KEY}`;
//     const res = await fetch(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(requestBody),
//     });

//     if (!res.ok) {
//       const errText = await res.text();
//       throw new Error(`Google Speech API error: ${res.status} ${res.statusText} - ${errText}`);
//     }

//     const json = await res.json();
//     const results = json.results || [];
//     if (!results.length) return "";

//     return results
//       .map((r: any) => r.alternatives?.[0]?.transcript || "")
//       .filter(Boolean)
//       .join(" ")
//       .trim();
//   } catch (err: any) {
//     throw new Error(err?.message || String(err));
//   }
// }


// // Functions/SpeachToTextGenerationFunctions.tsx
// import RNFS from "react-native-fs";
// import { GOOGLE_SPEECH_API_KEY } from "@env";

// /**
//  * Temporary function to test transcription of a local WAV file
//  * Works for short files (<60s), LINEAR16 PCM, 44.1 kHz, mono
//  */
// export async function convertSpeechFileToText(): Promise<string> {
//   try {
//     // Adjust path according to platform / where you placed the file
//     // Example: Project root -> Assets/Recording.wav
//     const fileUri = `${RNFS.MainBundlePath}/Assets/Recording.wav`;

//     // Convert file:// path for RNFS
//     const path = fileUri.startsWith("file://") ? fileUri.replace("file://", "") : fileUri;

//     const exists = await RNFS.exists(path);
//     if (!exists) throw new Error(`File not found at path: ${path}`);

//     // Read file as base64
//     const base64 = await RNFS.readFile(path, "base64");

//     const apiKey = GOOGLE_SPEECH_API_KEY;
//     if (!apiKey) throw new Error("Please set GOOGLE_SPEECH_API_KEY in your .env");

//     const requestBody = {
//       config: {
//         encoding: "LINEAR16",       // PCM WAV
//         sampleRateHertz: 44100,     // matches your WAV
//         languageCode: "en-US",
//         enableAutomaticPunctuation: true,
//         model: "default",
//         profanityFilter: false,
//       },
//       audio: {
//         content: base64,
//       },
//     };

//     const url = `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`;
//     const res = await fetch(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(requestBody),
//     });

//     if (!res.ok) {
//       const errText = await res.text();
//       throw new Error(`Google Speech API error: ${res.status} ${res.statusText} - ${errText}`);
//     }

//     const json = await res.json();
//     const results = json.results || [];
//     if (!results.length) return "[No transcript returned]";

//     return results
//       .map((r: any) => r.alternatives?.[0]?.transcript || "")
//       .filter(Boolean)
//       .join(" ")
//       .trim();
//   } catch (err: any) {
//     console.error("Error transcribing local audio:", err);
//     throw new Error(err?.message || String(err));
//   }
// }

import RNFS from "react-native-fs";
import { PermissionsAndroid, Platform } from "react-native";
import { GOOGLE_SPEECH_API_KEY } from "@env";

/**
 * ✅ Request storage/media permissions (Android 10–14 safe)
 */
async function requestStoragePermission(): Promise<boolean> {
  if (Platform.OS !== "android") return true;

  try {
    if (Platform.Version >= 33) {
      // 🔹 Android 13+ (API 33+)
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
      ]);

      const hasPermission =
        granted["android.permission.READ_MEDIA_AUDIO"] === PermissionsAndroid.RESULTS.GRANTED ||
        granted["android.permission.READ_MEDIA_IMAGES"] === PermissionsAndroid.RESULTS.GRANTED ||
        granted["android.permission.READ_MEDIA_VIDEO"] === PermissionsAndroid.RESULTS.GRANTED;

      console.log("📱 Android 13+ storage permission:", hasPermission ? "granted" : "denied");
      return hasPermission;
    } else {
      // 🔹 Android 12 or below
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Storage Permission",
          message: "Gossipy needs access to storage to read your test audio file.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );

      const hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
      console.log("📱 Legacy storage permission:", hasPermission ? "granted" : "denied");
      return hasPermission;
    }
  } catch (err) {
    console.warn("⚠️ Permission request error:", err);
    return false;
  }
}

/**
 * 🎧 Convert local WAV file → Base64 → Google Speech API → text
 * Make sure your audio file is: 16-bit PCM, mono, 44.1kHz
 */
export async function convertSpeechFileToText(): Promise<string> {
  try {
    // ✅ Ask permission before reading file
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) throw new Error("Storage permission denied by user or system.");

    // ✅ Path to your test WAV file
    const fileUri = "file:///storage/emulated/0/Snk/Recording.wav";
    const path = fileUri.startsWith("file://") ? fileUri.replace("file://", "") : fileUri;

    console.log("🎧 Checking path:", path);

    const exists = await RNFS.exists(path);
    if (!exists) throw new Error(`File not found at path: ${path}`);

    console.log("📂 Reading audio file...");
    const base64 = await RNFS.readFile(path, "base64");

    const apiKey = GOOGLE_SPEECH_API_KEY;
    if (!apiKey) throw new Error("Please set GOOGLE_SPEECH_API_KEY in your .env file");

    const requestBody = {
      config: {
        encoding: "LINEAR16", // PCM WAV
        sampleRateHertz: 44100, // your WAV file setting
        languageCode: "en-US",
        enableAutomaticPunctuation: true,
        model: "default",
      },
      audio: { content: base64 },
    };

    const url = `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`;
    console.log("🌐 Sending request to Google Speech API...");

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Google Speech API error: ${res.status} ${res.statusText} - ${errText}`);
    }

    const json = await res.json();
    console.log("✅ Google API Response:", JSON.stringify(json, null, 2));

    const results = json.results || [];
    if (!results.length) return "[No transcript returned]";

    const transcript = results
      .map((r: any) => r.alternatives?.[0]?.transcript || "")
      .filter(Boolean)
      .join(" ")
      .trim();

    console.log("🗣️ Transcript:", transcript);
    return transcript;
  } catch (err: any) {
    console.error("❌ Error transcribing local audio:", err);
    throw new Error(err?.message || String(err));
  }
}
