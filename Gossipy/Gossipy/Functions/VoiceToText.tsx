// Functions/VoiceToText.tsx

console.log("Initialize VoiceToText -----------------------------------------------------------------------------")

// ---------------------------------------------------------

import Voice from "@react-native-voice/voice";
console.log("Voice module:", Voice);

// ---------------------------------------------------------

export async function recordSpeech(): Promise<string> {
  try {
    console.log("Initializing Voice...");
    if (!Voice._loaded) {
      // This forces the native module to load
      console.log('Start Voice.isAvailable')
      await Voice.isAvailable();
      console.log('End Voice.isAvailable')
      console.log("Voice module loaded:", Voice._loaded);
    }

    await Voice.start("en-US");

    return new Promise((resolve) => {
      Voice.onSpeechResults = (e) => {
        console.log("Speech results:", e.value);
        resolve(e.value?.[0] || "");
        Voice.stop();
      };
      Voice.onSpeechError = (err) => {
        console.error("Speech recognition error:", err);
        resolve("");
      };
    });
  } catch (error) {
    console.error("Voice start error:", error);
    return "";
  }
}
