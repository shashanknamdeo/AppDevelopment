
console.log("Initialize TalkUI ----------------------------------------------------------------------------------")

// // UI/TalkUI.tsx
// import React, { useState } from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { generateSpeech } from "../Functions/AwsTextToSpeech";

// export function TalkUI({ onBack }: { onBack: () => void }) {
//   const [loading, setLoading] = useState(false);
//   const [lastResponse, setLastResponse] = useState("");

//   const handleSpeak = async () => {
//     try {
//       setLoading(true);
//       const reply = "Hello Shashank! This is Gossipy speaking using Amazon Polly.";
//       await generateSpeech(reply, "Salli");
//       setLastResponse(reply);
//     } catch (err) {
//       console.error("Polly error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>🎙️ Gossipy Talk Mode</Text>

//       <TouchableOpacity
//         style={[styles.button, loading && { opacity: 0.5 }]}
//         onPress={handleSpeak}
//         disabled={loading}
//       >
//         <Text style={styles.buttonText}>{loading ? "Speaking..." : "Start Talking"}</Text>
//       </TouchableOpacity>

//       {lastResponse ? <Text style={styles.response}>🤖 {lastResponse}</Text> : null}

//       <TouchableOpacity onPress={onBack} style={styles.backButton}>
//         <Text style={styles.backText}>⬅️ Back to Chat</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
//   title: { fontSize: 22, fontWeight: "bold", color: "#007AFF", marginBottom: 20 },
//   button: { backgroundColor: "#007AFF", paddingVertical: 14, paddingHorizontal: 40, borderRadius: 30 },
//   buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
//   response: { fontSize: 16, color: "#333", marginTop: 20, textAlign: "center", paddingHorizontal: 20 },
//   backButton: { marginTop: 40 },
//   backText: { color: "#007AFF", fontSize: 16 },
// });

// ---------------------------------------------------------

import Voice from "@react-native-voice/voice";
console.log("Voice module:", Voice);

// ---------------------------------------------------------

import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { recordSpeech } from "../Functions/VoiceToText";
import { generateText } from "../Functions/GoogleTextGen";
import { generateSpeech } from "../Functions/AwsTextToSpeech";

export function TalkUI({ onBack }: { onBack: () => void }) {
  const [loading, setLoading] = useState(false);
  const [userSpeech, setUserSpeech] = useState("");
  const [botReply, setBotReply] = useState("");

  const handleConversation = async () => {
    try {
      setLoading(true);
      setUserSpeech("");
      setBotReply("");

      // 🎤 Step 1: Record user's voice → text
      const speechText = await recordSpeech();
      if (!speechText) {
        setBotReply("I didn’t catch that. Please try again.");
        return;
      }
      setUserSpeech(speechText);

      // 🤖 Step 2: Generate AI reply from Gemini
      const reply = await generateText(speechText);
      setBotReply(reply);

      // 🔊 Step 3: Speak reply using AWS Polly
      await generateSpeech(reply, "Salli");
    } catch (err) {
      console.error("TalkUI conversation error:", err);
      setBotReply("⚠️ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎙️ Gossipy Talk Mode</Text>

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.5 }]}
        onPress={handleConversation}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Listening & Thinking..." : "🎤 Talk to Gossipy"}
        </Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />}

      {userSpeech ? <Text style={styles.response}>🗣️ You: {userSpeech}</Text> : null}
      {botReply ? <Text style={styles.response}>🤖 Gossipy: {botReply}</Text> : null}

      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>⬅️ Back to Chat</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", color: "#007AFF", marginBottom: 20 },
  button: { backgroundColor: "#007AFF", paddingVertical: 14, paddingHorizontal: 40, borderRadius: 30 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  response: { fontSize: 16, color: "#333", marginTop: 20, textAlign: "center", paddingHorizontal: 20 },
  backButton: { marginTop: 40 },
  backText: { color: "#007AFF", fontSize: 16 },
});
