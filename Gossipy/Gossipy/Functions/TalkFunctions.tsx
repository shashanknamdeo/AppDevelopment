console.log('Access File TalkFunctions.tsx ---------------------------------------------------------------------')


// ✅ TalkFunctions.tsx
// Central orchestrator that connects:
// 1️⃣ AudioRecorderFunctions
// 2️⃣ SpeachToTextGenerationFunctions
// 3️⃣ TextToTextGenerationFunctions
// 4️⃣ TextToSpeachGenerationFunctions

import { recordAudio, stopRecording } from "./AudioRecorderFunctions";
import { convertSpeechFileToText } from "./SpeachToTextGenerationFunctions";
import { generateGeminiResponse } from "./TextToTextGenerationFunctions";
import { speakWithPolly } from "./TextToSpeachGenerationFunctions";

/**
 * Handles the entire voice conversation pipeline:
 * Speech → Text → Gemini → Speech
 *
 * @param setIsProcessing - function to toggle loading UI
 * @param onTranscript - callback for showing recognized user speech text
 * @param onResponse - callback for showing Gemini response text
 */
export async function handleVoiceConversation(
  setIsProcessing: (val: boolean) => void,
  onTranscript: (text: string) => void,
  onResponse: (responseText: string) => void
) {
  try {
    console.log("🎙️ Starting voice conversation...");
    setIsProcessing(true);

    // ------------------------------------------------------
    // 1️⃣ RECORD AUDIO
    // ------------------------------------------------------
    const audioUri = await recordAudio();
    console.log("✅ Audio recorded at:", audioUri);

    // ------------------------------------------------------
    // 2️⃣ SPEECH ➜ TEXT
    // ------------------------------------------------------
    const transcript = await convertSpeechFileToText(audioUri, "en-IN"); // you can use "hi-IN" for Hindi
    console.log("🗣️ Transcript:", transcript);

    if (!transcript || transcript.trim().length === 0) {
      throw new Error("Speech-to-text conversion failed or empty transcript.");
    }

    // Show recognized user text in UI
    onTranscript(transcript);

    // ------------------------------------------------------
    // 3️⃣ TEXT ➜ GEMINI (TEXT RESPONSE)
    // ------------------------------------------------------
    const aiResponse = await generateGeminiResponse(transcript);
    console.log("🤖 Gemini response:", aiResponse);

    if (!aiResponse || aiResponse.trim().length === 0) {
      throw new Error("Gemini did not return any response.");
    }

    // Show AI response text in UI
    onResponse(aiResponse);

    // ------------------------------------------------------
    // 4️⃣ TEXT ➜ SPEECH (PLAY RESPONSE)
    // ------------------------------------------------------
    await speakWithPolly(aiResponse);
    console.log("🔊 Polly spoke the response successfully!");
  } catch (error: any) {
    console.error("❌ handleVoiceConversation error:", error.message || error);
  } finally {
    setIsProcessing(false);
    console.log("✅ Conversation flow ended.");
  }
}

/**
 * Optional helper: allows only Text→Text→Speech conversion
 * (for when user types a message instead of recording)
 */
export async function handleTypedConversation(
  inputText: string,
  setIsProcessing: (val: boolean) => void,
  onResponse: (responseText: string) => void
) {
  try {
    setIsProcessing(true);

    // 1️⃣ Generate Gemini text
    const aiResponse = await generateGeminiResponse(inputText);
    onResponse(aiResponse);

    // 2️⃣ Speak response
    await speakWithPolly(aiResponse);
  } catch (error: any) {
    console.error("❌ handleTypedConversation error:", error.message || error);
  } finally {
    setIsProcessing(false);
  }
}
