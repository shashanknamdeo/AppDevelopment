import { Alert } from "react-native";
import { uiLog } from "../Functions/Logger";

import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

// ------------------------------------------------------------------------------------------------

const SyncScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Snk</Text>
      <Text style={styles.subtitle}>Keep your files up to date</Text>

      <TouchableOpacity style={[styles.button, styles.syncButton]}>
        <Text style={styles.buttonText}>Sync</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.uploadButton]}>
        <Text style={styles.buttonText}>Force Upload</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.downloadButton]}>
        <Text style={styles.buttonText}>Force Download</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SyncScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 40,
  },
  button: {
    width: "80%",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 10,
    elevation: 3, // shadow for Android
  },
  syncButton: {
    backgroundColor: "#3B82F6", // blue
  },
  uploadButton: {
    backgroundColor: "#10B981", // green
  },
  downloadButton: {
    backgroundColor: "#F59E0B", // amber
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});




// ------------------------------------------------------------------------------------------------

export function confirmForceUpload(): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert(
      "⚠️ Force Upload",
      "This will remove files from S3 that don’t exist locally.\nDo you want to continue?",
      [
        { text: "Cancel", onPress: () => resolve(false), style: "cancel" },
        { text: "Confirm", onPress: () => resolve(true), style: "destructive" },
      ],
      { cancelable: false }
    );
  });
}


export function confirmForceDownload(): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert(
      "⚠️ Force Download",
      "This will delete files from your local storage that don’t exist in S3.\nDo you want to continue?",
      [
        { text: "Cancel", onPress: () => resolve(false), style: "cancel" },
        { text: "Confirm", onPress: () => resolve(true), style: "destructive" },
      ],
      { cancelable: false }
    );
  });
}
