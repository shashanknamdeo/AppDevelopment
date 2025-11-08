console.log('Access File  AudioRecorderFunctions.tsx ------------------------------------------------------------')

// import React, { useState } from "react";
// import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
// import Sound from "react-native-nitro-sound";
// import RNFS from "react-native-fs";

// interface AudioRecorderProps {
//   onStopRecording: (uri: string, sizeInKB: number) => void;
// }

// export function AudioRecorder({ onStopRecording }: AudioRecorderProps) {
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordingPath, setRecordingPath] = useState<string>("");

//   const getRecordingPath = () => `${RNFS.CachesDirectoryPath}/gossipy_record.m4a`;

//   const startRecording = async () => {
//     try {
//       const path = getRecordingPath();
//       console.log("🎙️ Starting recording at:", path);

//       const uri = await Sound.startRecorder(path);
//       Sound.addRecordBackListener(() => {});
//       setRecordingPath(uri);
//       setIsRecording(true);
//       console.log("✅ Recording started:", uri);
//     } catch (error) {
//       console.error("❌ Error starting recording:", error);
//     }
//   };

//   const stopRecording = async () => {
//     try {
//       const result = await Sound.stopRecorder();
//       Sound.removeRecordBackListener();
//       setIsRecording(false);
//       console.log("✅ Recording stopped:", result);

//       const stats = await RNFS.stat(result);
//       const sizeInKB = parseFloat((stats.size / 1024).toFixed(2));
//       console.log(`📦 Audio file size: ${sizeInKB} KB`);

//       onStopRecording(result, sizeInKB);
//     } catch (error) {
//       console.error("❌ Error stopping recording:", error);
//     }
//   };

//   const playRecording = async () => {
//     try {
//       if (!recordingPath) return;
//       console.log("🎧 Playing:", recordingPath);
//       await Sound.startPlayer(recordingPath);
//       Sound.addPlaybackEndListener(() => {
//         console.log("Playback finished!");
//         Sound.stopPlayer();
//         Sound.removePlayBackListener();
//       });
//     } catch (error) {
//       console.error("❌ Error playing:", error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         style={[styles.button, isRecording && styles.recordingButton]}
//         onPress={isRecording ? stopRecording : startRecording}
//       >
//         <Text style={styles.buttonText}>
//           {isRecording ? "Stop Recording" : "Start Recording"}
//         </Text>
//       </TouchableOpacity>

//       {recordingPath ? (
//         <TouchableOpacity style={styles.playButton} onPress={playRecording}>
//           <Text style={styles.buttonText}>Play Recording</Text>
//         </TouchableOpacity>
//       ) : null}
//     </View>
//   );
// }

// // -----------------------
// // NEW: Function for TalkFunctions
// // -----------------------
// export async function recordAudio(): Promise<string> {
//   try {
//     const path = `${RNFS.CachesDirectoryPath}/gossipy_record.m4a`;
//     console.log("🎙️ [recordAudio] Starting recording at:", path);

//     const uri = await Sound.startRecorder(path);
//     Sound.addRecordBackListener(() => {});
//     console.log("✅ [recordAudio] Recording started:", uri);

//     // Automatically stop after 5 seconds for demo / short recording
//     await new Promise((resolve) => setTimeout(resolve, 5000));
//     const result = await Sound.stopRecorder();
//     Sound.removeRecordBackListener();
//     console.log("✅ [recordAudio] Recording stopped:", result);

//     return result; // return URI to caller
//   } catch (err) {
//     console.error("❌ [recordAudio] Error:", err);
//     throw err;
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     alignItems: "center",
//     marginVertical: 20,
//   },
//   button: {
//     backgroundColor: "#007AFF",
//     paddingVertical: 14,
//     paddingHorizontal: 30,
//     borderRadius: 30,
//     marginBottom: 10,
//   },
//   recordingButton: {
//     backgroundColor: "#FF3B30",
//   },
//   playButton: {
//     backgroundColor: "#28A745",
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     borderRadius: 30,
//   },
//   buttonText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
// });

// this is my AudioRecorderFunctions.tsx do only the required changes and give me full code

// import React, { useState } from "react";
// import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
// import Sound from "react-native-nitro-sound";
// import RNFS from "react-native-fs";

// interface AudioRecorderProps {
//   onStopRecording: (uri: string, sizeInKB: number) => void;
// }

// export function AudioRecorder({ onStopRecording }: AudioRecorderProps) {
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordingPath, setRecordingPath] = useState<string>("");

//   // ✅ Change file extension to .wav for LINEAR16
//   const getRecordingPath = () => `${RNFS.CachesDirectoryPath}/gossipy_record.wav`;

//   const startRecording = async () => {
//     try {
//       const path = getRecordingPath();
//       console.log("🎙️ Starting recording at:", path);

//       const uri = await Sound.startRecorder(path); // Nitro Sound should support WAV/LINEAR16
//       Sound.addRecordBackListener(() => {});
//       setRecordingPath(uri);
//       setIsRecording(true);
//       console.log("✅ Recording started:", uri);
//     } catch (error) {
//       console.error("❌ Error starting recording:", error);
//     }
//   };

//   const stopRecording = async () => {
//     try {
//       const result = await Sound.stopRecorder();
//       Sound.removeRecordBackListener();
//       setIsRecording(false);
//       console.log("✅ Recording stopped:", result);

//       const stats = await RNFS.stat(result);
//       const sizeInKB = parseFloat((stats.size / 1024).toFixed(2));
//       console.log(`📦 Audio file size: ${sizeInKB} KB`);

//       onStopRecording(result, sizeInKB);
//     } catch (error) {
//       console.error("❌ Error stopping recording:", error);
//     }
//   };

//   const playRecording = async () => {
//     try {
//       if (!recordingPath) return;
//       console.log("🎧 Playing:", recordingPath);
//       await Sound.startPlayer(recordingPath);
//       Sound.addPlaybackEndListener(() => {
//         console.log("Playback finished!");
//         Sound.stopPlayer();
//         Sound.removePlayBackListener();
//       });
//     } catch (error) {
//       console.error("❌ Error playing:", error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         style={[styles.button, isRecording && styles.recordingButton]}
//         onPress={isRecording ? stopRecording : startRecording}
//       >
//         <Text style={styles.buttonText}>
//           {isRecording ? "Stop Recording" : "Start Recording"}
//         </Text>
//       </TouchableOpacity>

//       {recordingPath ? (
//         <TouchableOpacity style={styles.playButton} onPress={playRecording}>
//           <Text style={styles.buttonText}>Play Recording</Text>
//         </TouchableOpacity>
//       ) : null}
//     </View>
//   );
// }

// // -----------------------
// // Function for TalkFunctions
// // -----------------------
// export async function recordAudio(): Promise<string> {
//   try {
//     const path = `${RNFS.CachesDirectoryPath}/gossipy_record.wav`;
//     console.log("🎙️ [recordAudio] Starting recording at:", path);

//     const uri = await Sound.startRecorder(path);
//     Sound.addRecordBackListener(() => {});
//     console.log("✅ [recordAudio] Recording started:", uri);

//     // Automatically stop after 5 seconds (demo / short recording)
//     await new Promise((resolve) => setTimeout(resolve, 5000));
//     const result = await Sound.stopRecorder();
//     Sound.removeRecordBackListener();
//     console.log("✅ [recordAudio] Recording stopped:", result);

//     return result; // return URI to caller
//   } catch (err) {
//     console.error("❌ [recordAudio] Error:", err);
//     throw err;
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     alignItems: "center",
//     marginVertical: 20,
//   },
//   button: {
//     backgroundColor: "#007AFF",
//     paddingVertical: 14,
//     paddingHorizontal: 30,
//     borderRadius: 30,
//     marginBottom: 10,
//   },
//   recordingButton: {
//     backgroundColor: "#FF3B30",
//   },
//   playButton: {
//     backgroundColor: "#28A745",
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     borderRadius: 30,
//   },
//   buttonText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
// });


import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Sound from "react-native-nitro-sound";
import RNFS from "react-native-fs";

interface AudioRecorderProps {
  onStopRecording: (uri: string, sizeInKB: number) => void;
}

export function AudioRecorder({ onStopRecording }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingPath, setRecordingPath] = useState<string>("");

  // File path for LINEAR16 WAV
  const getRecordingPath = () => `${RNFS.CachesDirectoryPath}/gossipy_record.wav`;

  const startRecording = async () => {
    try {
      const path = getRecordingPath();
      console.log("🎙️ Starting recording at:", path);

      // Force 16kHz, mono, 16-bit PCM WAV
      const uri = await Sound.startRecorder(path, {
        format: "wav",
        sampleRate: 16000,
        channels: 1,
        bitsPerSample: 16,
      });
      Sound.addRecordBackListener(() => {});
      setRecordingPath(uri);
      setIsRecording(true);
      console.log("✅ Recording started:", uri);
    } catch (error) {
      console.error("❌ Error starting recording:", error);
    }
  };

  const stopRecording = async () => {
    try {
      const result = await Sound.stopRecorder();
      Sound.removeRecordBackListener();
      setIsRecording(false);
      console.log("✅ Recording stopped:", result);

      const stats = await RNFS.stat(result);
      const sizeInKB = parseFloat((stats.size / 1024).toFixed(2));
      console.log(`📦 Audio file size: ${sizeInKB} KB`);

      onStopRecording(result, sizeInKB);
    } catch (error) {
      console.error("❌ Error stopping recording:", error);
    }
  };

  const playRecording = async () => {
    try {
      if (!recordingPath) return;
      console.log("🎧 Playing:", recordingPath);
      await Sound.startPlayer(recordingPath);
      Sound.addPlaybackEndListener(() => {
        console.log("Playback finished!");
        Sound.stopPlayer();
        Sound.removePlayBackListener();
      });
    } catch (error) {
      console.error("❌ Error playing:", error);
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

// -----------------------
// Function for TalkFunctions
// -----------------------
export async function recordAudio(): Promise<string> {
  try {
    const path = `${RNFS.CachesDirectoryPath}/gossipy_record.wav`;
    console.log("🎙️ [recordAudio] Starting recording at:", path);

    // 16kHz, mono, 16-bit PCM WAV
    const uri = await Sound.startRecorder(path, {
      format: "wav",
      sampleRate: 16000,
      channels: 1,
      bitsPerSample: 16,
    });
    Sound.addRecordBackListener(() => {});
    console.log("✅ [recordAudio] Recording started:", uri);

    // Auto-stop after 5 seconds (for testing; can be removed later)
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const result = await Sound.stopRecorder();
    Sound.removeRecordBackListener();
    console.log("✅ [recordAudio] Recording stopped:", result);

    return result;
  } catch (err) {
    console.error("❌ [recordAudio] Error:", err);
    throw err;
  }
}

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
