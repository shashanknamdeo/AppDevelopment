// UI/TalkUI.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { speakWithPollyGraphQL } from "../Functions/AwsPolly";

export function TalkPage({ onBack }: { onBack: () => void }) {
  const [loading, setLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState("");

  // Example text – replace with dynamic AI reply later
  const reply = "Hello Shashank! This is Gossipy speaking using Amazon Polly.";

  const handleSpeak = async () => {
    try {
      setLoading(true);
      await speakWithPollyGraphQL(reply, "Salli"); // voice matches Amplify setup
      setLastResponse(reply);
    } catch (err) {
      console.error("Error playing Polly audio:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎙️ Gossipy Talk Mode (Polly)</Text>

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.5 }]}
        onPress={handleSpeak}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Speaking..." : "Start Talking"}
        </Text>
      </TouchableOpacity>

      {lastResponse ? (
        <Text style={styles.response}>🤖 {lastResponse}</Text>
      ) : null}

      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>⬅️ Back to Chat</Text>
      </TouchableOpacity>
    </View>
  );
}

// ------------------ Styles ------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  response: {
    fontSize: 16,
    color: "#333",
    marginTop: 20,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  backButton: {
    marginTop: 40,
  },
  backText: {
    color: "#007AFF",
    fontSize: 16,
  },
});
