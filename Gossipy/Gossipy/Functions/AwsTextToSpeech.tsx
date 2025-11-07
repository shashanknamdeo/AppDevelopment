// Functions/AwsTextToSpeech.tsx
console.log("Initialize AwsTextToSpeech --------------------------------------------------------------------------------");

// Functions/AudioRecorder.tsx
import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import AudioRecorderPlayer from "react-native-audio-recorder-player";

interface AudioRecorderProps {
  onStopRecording: (uri: string) => void;
}

const audioRecorderPlayer = new AudioRecorderPlayer();

export function AudioRecorder({ onStopRecording }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingPath, setRecordingPath] = useState<string>("");

  // Start recording
  const startRecording = async () => {
    try {
      const path = "gossipy_record.m4a"; // Android/iOS filename
      const uri = await audioRecorderPlayer.startRecorder(path);
      audioRecorderPlayer.addRecordBackListener((e) => {
        // optional: you can track recording progress here
        return;
      });
      setRecordingPath(uri);
      setIsRecording(true);
      console.log("Recording started at:", uri);
    } catch (err) {
      console.error("Failed to start recording:", err);
    }
  };

  // Stop recording
  const stopRecording = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setIsRecording(false);
      console.log("Recording stopped. File saved at:", result);
      onStopRecording(result);
    } catch (err) {
      console.error("Failed to stop recording:", err);
    }
  };

  // Optional: play recording
  const playRecording = async () => {
    try {
      await audioRecorderPlayer.startPlayer(recordingPath);
      audioRecorderPlayer.addPlayBackListener((e) => {
        if (e.current_position === e.duration) {
          audioRecorderPlayer.stopPlayer();
          audioRecorderPlayer.removePlayBackListener();
        }
      });
    } catch (err) {
      console.error("Failed to play recording:", err);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isRecording && styles.recordingButton]}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Text style={styles.buttonText}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Text>
      </TouchableOpacity>

      {recordingPath ? (
        <TouchableOpacity style={styles.playButton} onPress={playRecording}>
          <Text style={styles.buttonText}>Play Recording</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

// ------------------ Styles ------------------
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 10,
  },
  recordingButton: {
    backgroundColor: "#FF3B30",
  },
  playButton: {
    backgroundColor: "#28A745",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
